import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PRIVATE_ROUTES = ["/perfil", "/formularios", "/dashboard"];
const ADMIN_ROUTES   = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));
  const isAdmin   = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  if (isPrivate || isAdmin) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "auth-required");
      return NextResponse.redirect(loginUrl);
    }
    if (isAdmin && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|api|_next/static|_next/image|favicon.ico).*)"],
};
