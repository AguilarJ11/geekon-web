import { NextRequest, NextResponse } from "next/server";
import { requireFormAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  const { id: formId, fieldId } = await params;
  if (!await requireFormAccess(formId)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { label, placeholder, required, options, order } = await req.json();

  if (label !== undefined && !label.trim()) {
    return NextResponse.json({ error: "Label requerido" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (label !== undefined) update.label = label.trim();
  if (placeholder !== undefined) update.placeholder = placeholder?.trim() || null;
  if (required !== undefined) update.required = !!required;
  // options arrives as array from POST, as pre-stringified string from PATCH
  if (options !== undefined) {
    if (options === null) update.options = null;
    else update.options = typeof options === "string" ? options : JSON.stringify(options);
  }
  if (order !== undefined) update.order = order;

  const field = await prisma.formField.update({ where: { id: fieldId }, data: update });
  return NextResponse.json(field);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; fieldId: string }> }
) {
  const { id: formId, fieldId } = await params;
  if (!await requireFormAccess(formId)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.formField.delete({ where: { id: fieldId } });
  return NextResponse.json({ ok: true });
}
