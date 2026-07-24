import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username } = await req.json();
  const normalized = typeof username === "string" ? username.trim().toLowerCase() : "";

  if (!USERNAME_RE.test(normalized)) {
    return NextResponse.json({
      error: "El nombre de usuario tiene que tener 3 a 20 caracteres: letras minúsculas, números y guion bajo.",
    }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { username: normalized } });
  if (existing && existing.id !== userId) {
    return NextResponse.json({ error: "Ese nombre de usuario ya está en uso" }, { status: 409 });
  }

  const user = await prisma.user.update({ where: { id: userId }, data: { username: normalized } });
  return NextResponse.json({ username: user.username });
}
