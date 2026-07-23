import { NextRequest, NextResponse } from "next/server";
import { requireFormAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = await params;
  if (!await requireFormAccess(formId)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { label, metraje, precio } = await req.json();

  if (!label?.trim()) return NextResponse.json({ error: "Nombre del stand requerido" }, { status: 400 });
  if (!metraje?.trim()) return NextResponse.json({ error: "Metraje requerido" }, { status: 400 });
  const precioNum = Number(precio);
  if (!Number.isFinite(precioNum) || precioNum < 0) {
    return NextResponse.json({ error: "Precio inválido" }, { status: 400 });
  }

  const last = await prisma.standOption.findFirst({ where: { formId }, orderBy: { order: "desc" } });
  const order = (last?.order ?? -1) + 1;

  const option = await prisma.standOption.create({
    data: { formId, label: label.trim(), metraje: metraje.trim(), precio: precioNum, order },
  });
  return NextResponse.json(option, { status: 201 });
}
