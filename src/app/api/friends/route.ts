import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PUBLIC_SELECT = { id: true, username: true, name: true, image: true } as const;

// Para la vista propia de /perfil: mis amigos, las solicitudes que me
// mandaron y las que yo mandé y siguen pendientes.
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.friendship.findMany({
    where: { OR: [{ requesterId: userId }, { addresseeId: userId }] },
    include: { requester: { select: PUBLIC_SELECT }, addressee: { select: PUBLIC_SELECT } },
    orderBy: { createdAt: "desc" },
  });

  const friends = rows
    .filter(r => r.status === "ACCEPTED")
    .map(r => ({ friendshipId: r.id, user: r.requesterId === userId ? r.addressee : r.requester }));

  const pendingReceived = rows
    .filter(r => r.status === "PENDING" && r.addresseeId === userId)
    .map(r => ({ friendshipId: r.id, user: r.requester }));

  const pendingSent = rows
    .filter(r => r.status === "PENDING" && r.requesterId === userId)
    .map(r => ({ friendshipId: r.id, user: r.addressee }));

  return NextResponse.json({ friends, pendingReceived, pendingSent });
}

// Enviar una solicitud de amistad. Si la otra persona ya te había mandado
// una (pendiente), se acepta directo en vez de crear una segunda fila.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { username } = await req.json();
  if (typeof username !== "string" || !username.trim()) {
    return NextResponse.json({ error: "Falta el usuario destino" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { username: username.trim().toLowerCase() } });
  if (!target) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  if (target.id === userId) return NextResponse.json({ error: "No podés agregarte a vos mismo" }, { status: 400 });

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { requesterId: userId, addresseeId: target.id },
        { requesterId: target.id, addresseeId: userId },
      ],
    },
  });

  if (existing) {
    if (existing.status === "ACCEPTED") {
      return NextResponse.json({ error: "Ya son amigos" }, { status: 409 });
    }
    if (existing.requesterId === userId) {
      return NextResponse.json({ error: "Ya le mandaste una solicitud" }, { status: 409 });
    }
    // La otra persona ya te había mandado una solicitud: se acepta directo.
    const accepted = await prisma.friendship.update({
      where: { id: existing.id },
      data: { status: "ACCEPTED", respondedAt: new Date() },
    });
    return NextResponse.json(accepted, { status: 200 });
  }

  const created = await prisma.friendship.create({
    data: { requesterId: userId, addresseeId: target.id },
  });
  return NextResponse.json(created, { status: 201 });
}
