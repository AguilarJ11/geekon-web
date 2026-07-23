import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const form = await prisma.form.findUnique({
    where: { slug, isPublished: true },
    include: { fields: { orderBy: { order: "asc" } } },
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

  const submission = await prisma.formSubmission.create({
    data: { formId: form.id, userId, data: body },
  });
  return NextResponse.json(submission, { status: 201 });
}
