import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getJwtSecret } from "@/lib/auth";

// Konfigurasi route mana yang di-intercept oleh proxy ini
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export async function proxy(request: NextRequest) {
  // Biarkan endpoint login dan logout bebas diakses
  if (
    request.nextUrl.pathname.startsWith("/api/admin/login") ||
    request.nextUrl.pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  // Ambil token dari cookie
  const token = request.cookies.get("admin_token")?.value;

  // Coba validasi token
  let isValid = false;
  if (token) {
    try {
      const secret = getJwtSecret();
      // jwtVerify akan throw jika token expired atau tidak valid
      await jwtVerify(token, secret);
      isValid = true;
    } catch (error) {
      console.error("JWT Verification Error:", error);
      isValid = false;
    }
  }

  // Jika token valid, lanjutkan request
  if (isValid) {
    return NextResponse.next();
  }

  // Jika token tidak valid / tidak ada:
  // 1. Jika request ke API, kembalikan 401 Unauthorized
  if (request.nextUrl.pathname.startsWith("/api/admin/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Jika request ke halaman admin, tetapi saat ini berada di /admin untuk login
  // Kita biarkan saja user ke /admin, namun kompenen client akan memaksa mereka login
  // Karena komponen layout merender form login bila belum login.
  // Namun, kita tidak membiarkan rute sub-admin (misal /admin/knowledge)
  if (request.nextUrl.pathname !== "/admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Biarkan halaman /admin lewat, di UI nanti akan cek API (atau kita bisa set param)
  return NextResponse.next();
}
