import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PRIVATE_ROUTES = ["/perfil", "/formularios", "/admin", "/dashboard"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));

  if (isPrivate) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|api|_next/static|_next/image|favicon.ico).*)"],
};
