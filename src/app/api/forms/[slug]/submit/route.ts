import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const form = await prisma.form.findUnique({
    where: { slug, isPublished: true },
    include: {
      fields: { orderBy: { order: "asc" } },
      standOptions: { orderBy: { order: "asc" } },
    },
  });
  if (!form) return NextResponse.json({ error: "Formulario no encontrado" }, { status: 404 });

  const body = await req.json();
  const userId = (session.user as { id?: string }).id;
  if (!userId) return NextResponse.json({ error: "Usuario inválido" }, { status: 400 });

  const existing = await prisma.formSubmission.findUnique({
    where: { formId_userId: { formId: form.id, userId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya enviaste este formulario" }, { status: 409 });
  }

  // Validate required fields
  for (const field of form.fields) {
    if (field.required && !body[field.id]?.toString().trim()) {
      return NextResponse.json(
        { error: `El campo "${field.label}" es obligatorio` },
        { status: 400 }
      );
    }
  }

  const data: Record<string, unknown> = { ...body };

  // El stand elegido se valida y se congela server-side (nunca confiar en
  // el precio que mande el cliente).
  if (form.standOptions.length > 0) {
    delete data.standOptionId;
    const chosen = form.standOptions.find(o => o.id === body.standOptionId);
    if (!chosen) {
      return NextResponse.json({ error: "Elegí un tipo de stand" }, { status: 400 });
    }
    data.standOption = { id: chosen.id, label: chosen.label, metraje: chosen.metraje, precio: chosen.precio };
  }

  const submission = await prisma.formSubmission.create({
    data: { formId: form.id, userId, data: data as Prisma.InputJsonValue },
  });
  return NextResponse.json(submission, { status: 201 });
}
