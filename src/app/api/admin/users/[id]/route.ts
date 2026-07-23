import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_ROLES = ["USER", "ADMIN"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { role, name } = await req.json();

  if (role !== undefined && !VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Rol inválido" }, { status: 400 });
  }

  if (role !== undefined) {
    const session = await getServerSession(authOptions);
    const selfId = (session?.user as { id?: string } | undefined)?.id;
    if (selfId === id && role !== "ADMIN") {
      return NextResponse.json({ error: "No podés quitarte el rol de administrador a vos mismo." }, { status: 400 });
    }
  }

  if (name !== undefined && !name.trim()) {
    return NextResponse.json({ error: "El nombre no puede estar vacío" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(role !== undefined ? { role } : {}),
      ...(name !== undefined ? { name: name.trim() } : {}),
    },
    select: {
      id: true, name: true, email: true, image: true, role: true, createdAt: true,
      _count: { select: { ownedForms: true, submissions: true, badges: true } },
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const session = await getServerSession(authOptions);
  const selfId = (session?.user as { id?: string } | undefined)?.id;
  if (selfId === id) {
    return NextResponse.json({ error: "No podés eliminar tu propia cuenta." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
