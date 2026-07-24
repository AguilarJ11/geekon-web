import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireFormAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!await requireFormAccess(id)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await prisma.form.findUnique({
    where: { id },
    include: {
      fields: { orderBy: { order: "asc" } },
      standOptions: { orderBy: { order: "asc" } },
      owner: { select: { name: true, email: true } },
    },
  });
  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(form);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const access = await requireFormAccess(id);
  if (!access) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const update: Record<string, unknown> = {};

  const allowedAlways = ["title", "description", "isPublished"] as const;
  for (const key of allowedAlways) if (key in data) update[key] = data[key];

  // Categoría, edición, plazos y dueño son decisiones administrativas: solo el admin global las toca.
  if (access.isAdmin) {
    if ("category" in data) update.category = data.category;
    if ("edition" in data) update.edition = data.edition?.trim() || null;
    if ("depositDueDate" in data) update.depositDueDate = data.depositDueDate ? new Date(data.depositDueDate) : null;
    if ("fullPaymentDueDate" in data) update.fullPaymentDueDate = data.fullPaymentDueDate ? new Date(data.fullPaymentDueDate) : null;

    if ("ownerEmail" in data) {
      if (!data.ownerEmail?.trim()) {
        update.ownerId = null;
      } else {
        const owner = await prisma.user.findUnique({ where: { email: data.ownerEmail.trim() } });
        if (!owner) return NextResponse.json({ error: "No existe ningún usuario con ese email" }, { status: 400 });
        update.ownerId = owner.id;
      }
    }
  }

  const form = await prisma.form.update({ where: { id }, data: update });

  return NextResponse.json(form);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.form.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
