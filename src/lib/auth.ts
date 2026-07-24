import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/login" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",      type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name ?? "", role: user.role, username: user.username };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name ?? undefined, image: user.image ?? undefined },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
          },
        });

        user.id = dbUser.id;
        (user as { role?: string }).role = dbUser.role;
        (user as { username?: string | null }).username = dbUser.username;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role     = (user as { role?: string }).role;
        token.id       = user.id;
        token.username = (user as { username?: string | null }).username;
      } else if (token.id) {
        // Se refresca contra la base en cada request de NextAuth (no solo al
        // loguearse): así elegir un username en el onboarding, o un cambio de
        // rol hecho por fuera, se reflejan sin volver a loguearse. El
        // middleware lee este JWT directamente vía getToken(), por eso el
        // refresh tiene que pasar por acá y no solo por el callback de sesión.
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, username: true },
        });
        if (dbUser) {
          token.role     = dbUser.role;
          token.username = dbUser.username;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string; username?: string | null }).role     = token.role as string;
        (session.user as { role?: string; id?: string; username?: string | null }).id       = token.id   as string;
        (session.user as { role?: string; id?: string; username?: string | null }).username = token.username as string | null;
      }
      return session;
    },
  },
};

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return null;
  return session;
}

/**
 * Autoriza al admin global o a usuarios con rol FOTOGRAFO, los únicos que
 * pueden crear álbumes y subir fotos a la galería.
 */
export async function requireGalleryAccess() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "FOTOGRAFO")) return null;
  return session;
}

/**
 * Autoriza al admin global o al dueño asignado de un formulario puntual.
 * El dueño puede administrar únicamente su propio formulario (contenido y
 * postulaciones), no el resto del panel admin.
 */
export async function requireFormAccess(formId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const userId = (session.user as { id?: string }).id;
  const role   = (session.user as { role?: string }).role;

  if (role === "ADMIN") return { session, isAdmin: true as const };

  const form = await prisma.form.findUnique({ where: { id: formId }, select: { ownerId: true } });
  if (form?.ownerId && form.ownerId === userId) return { session, isAdmin: false as const };

  return null;
}
