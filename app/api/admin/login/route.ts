import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword, createAdminToken } from "@/lib/auth";
import {
  checkRateLimit,
  getClientIp,
  createRateLimitResponse,
} from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: max 5 attempts per 15 minutes per IP
    const clientIp = getClientIp(req);
    const rateLimitCheck = checkRateLimit(
      `login:${clientIp}`,
      5,
      15 * 60 * 1000,
    );

    if (!rateLimitCheck.allowed) {
      return createRateLimitResponse(rateLimitCheck.retryAfter);
    }

    // Parse and validate request body
    let password: string;
    try {
      const body = await req.json();
      password = body.password;

      if (!password || typeof password !== "string") {
        return NextResponse.json(
          { error: "Password diperlukan" },
          { status: 400 },
        );
      }

      password = password.trim();

      if (password.length === 0) {
        return NextResponse.json(
          { error: "Password tidak boleh kosong" },
          { status: 400 },
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Get admin password hash from environment
    let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    
    // Normalize: remove any leading backslashes if the env loader didn't consume them
    if (adminPasswordHash && adminPasswordHash.includes('\\$')) {
      adminPasswordHash = adminPasswordHash.replace(/\\/g, '');
    }

    const legacyAdminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPasswordHash && !legacyAdminPassword) {
      console.error("ADMIN_PASSWORD_HASH or ADMIN_PASSWORD not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Verify password
    let passwordMatches = false;

    if (adminPasswordHash) {
      // New secure method: compare with hash
      passwordMatches = await verifyPassword(password, adminPasswordHash);
    }

    if (!adminPasswordHash && legacyAdminPassword) {
      // Legacy method (deprecated): plain text comparison
      // This is for backward compatibility only and should be migrated
      console.warn(
        "Using legacy plain text password. Please set ADMIN_PASSWORD_HASH instead.",
      );
      passwordMatches = password === legacyAdminPassword;
    }

    if (!passwordMatches) {
      // Log failed attempt
      console.warn(`Failed login attempt from IP: ${clientIp}`);
      return NextResponse.json({ error: "Kata sandi salah." }, { status: 401 });
    }

    // Create JWT token
    let jwt: string;
    try {
      jwt = await createAdminToken();
    } catch (error) {
      console.error("JWT creation error:", error);
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Set cookie HTTP-only
    const cookieStore = await cookies();
    cookieStore.set("admin_token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    console.log(`Successful admin login from IP: ${clientIp}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
