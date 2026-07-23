import { NextRequest, NextResponse } from "next/server";
import { requireFormAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; optionId: string }> }
) {
  const { id: formId, optionId } = await params;
  if (!await requireFormAccess(formId)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { label, metraje, precio } = await req.json();

  const update: Record<string, unknown> = {};
  if (label !== undefined) {
    if (!label.trim()) return NextResponse.json({ error: "Nombre del stand requerido" }, { status: 400 });
    update.label = label.trim();
  }
  if (metraje !== undefined) {
    if (!metraje.trim()) return NextResponse.json({ error: "Metraje requerido" }, { status: 400 });
    update.metraje = metraje.trim();
  }
  if (precio !== undefined) {
    const precioNum = Number(precio);
    if (!Number.isFinite(precioNum) || precioNum < 0) {
      return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
    }
    update.precio = precioNum;
  }

  const option = await prisma.standOption.update({ where: { id: optionId }, data: update });
  return NextResponse.json(option);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; optionId: string }> }
) {
  const { id: formId, optionId } = await params;
  if (!await requireFormAccess(formId)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.standOption.delete({ where: { id: optionId } });
  return NextResponse.json({ ok: true });
}
