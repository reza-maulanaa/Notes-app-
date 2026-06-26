import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!isLoggedIn && !isAuthPage) {
    const url = req.nextUrl.clone();   // ← clone URL yang udah valid
    url.pathname = "/login";           // ← ganti path-nya doang
    return NextResponse.redirect(url);
  }

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