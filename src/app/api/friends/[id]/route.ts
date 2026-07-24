import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Aceptar una solicitud pendiente. Solo quien la recibió puede aceptarla.
export async function PATCH(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const friendship = await prisma.friendship.findUnique({ where: { id } });
  if (!friendship) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  if (friendship.addresseeId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (friendship.status !== "PENDING") {
    return NextResponse.json({ error: "Ya fue respondida" }, { status: 400 });
  }

  const updated = await prisma.friendship.update({
    where: { id },
    data: { status: "ACCEPTED", respondedAt: new Date() },
  });
  return NextResponse.json(updated);
}

// Rechazar una solicitud recibida, cancelar una que mandaste, o eliminar
// una amistad existente — las tres acciones son "borrar la fila" y las
// puede hacer cualquiera de las dos partes.
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const friendship = await prisma.friendship.findUnique({ where: { id } });
  if (!friendship) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  if (friendship.requesterId !== userId && friendship.addresseeId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.friendship.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
