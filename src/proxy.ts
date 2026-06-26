import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // `/notes` (exact) menampilkan hero section saat belum login — bukan redirect paksa.
  // Sub-route (`/notes/123`, `/notes/123/edit`) tetap dilindungi.
  const isPublicPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/notes";

  if (!isLoggedIn && !isPublicPage) {
    const url = req.nextUrl.clone();   // ← clone URL yang udah valid
    url.pathname = "/login";           // ← ganti path-nya doang
    return NextResponse.redirect(url);
  }

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isLoggedIn && isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/notes";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};