import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PRIVATE_ROUTES = ["/inscripciones", "/dashboard", "/mis-formularios"];
// Subrutas de /perfil que son privadas (la propia y sus acciones). El resto
// de /perfil/[username] es la vista pública del perfil de otro usuario — cualquiera
// puede entrar ahí, ej. desde el nombre del fotógrafo en un álbum de /galeria.
const PRIVATE_PERFIL_ROUTES = ["/perfil/editar", "/perfil/postulaciones"];
const ADMIN_ROUTES   = ["/admin"];

const ONBOARDING_ROUTE = "/elegir-usuario";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate =
    PRIVATE_ROUTES.some((r) => pathname.startsWith(r)) ||
    pathname === "/perfil" ||
    PRIVATE_PERFIL_ROUTES.some((r) => pathname.startsWith(r));
  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if ((isPrivate || isAdmin) && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    loginUrl.searchParams.set("reason", "auth-required");
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && token && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Todo usuario logueado necesita un username único antes de poder usar el
  // resto del sitio — se lo pedimos apenas entra por primera vez, sin
  // importar a qué página haya intentado ir.
  if (token && !token.username && pathname !== ONBOARDING_ROUTE) {
    const url = new URL(ONBOARDING_ROUTE, req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|api|_next/static|_next/image|favicon.ico).*)"],
};
