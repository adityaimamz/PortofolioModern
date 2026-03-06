import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJwtToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Tidak ada sesi." }, { status: 401 });
    }

    try {
      // Verify will throw error if token is expired or invalid
      await verifyJwtToken(token);
      return NextResponse.json(
        { success: true, role: "admin" },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
    }
  } catch (error) {
    console.error("ME endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
