import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FieldType } from "@prisma/client";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return null;
  return session;
}

const VALID_TYPES: FieldType[] = ["TEXT","TEXTAREA","EMAIL","PHONE","NUMBER","SELECT","RADIO","CHECKBOX","DATE"];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: formId } = await params;
  const { type, label, placeholder, required, options } = await req.json();

  if (!label?.trim()) return NextResponse.json({ error: "Label requerido" }, { status: 400 });
  if (!VALID_TYPES.includes(type)) return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });

  const last = await prisma.formField.findFirst({ where: { formId }, orderBy: { order: "desc" } });
  const order = (last?.order ?? -1) + 1;

  const field = await prisma.formField.create({
    data: {
      formId,
      type,
      label: label.trim(),
      placeholder: placeholder?.trim() || null,
      required: !!required,
      order,
      options: options ? JSON.stringify(options) : null,
    },
  });
  return NextResponse.json(field, { status: 201 });
}
