import { NextRequest, NextResponse } from "next/server";
import { requireFormAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = await params;
  if (!await requireFormAccess(formId)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [form, submissions] = await Promise.all([
    prisma.form.findUnique({
      where: { id: formId },
      include: { fields: { orderBy: { order: "asc" } } },
    }),
    prisma.formSubmission.findMany({
      where: { formId },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ form, submissions });
}
