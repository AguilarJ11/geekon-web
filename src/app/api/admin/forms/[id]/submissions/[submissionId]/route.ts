import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categoryInfo } from "@/lib/form-categories";

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; submissionId: string }> }
) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: formId, submissionId } = await params;

  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    include: { form: { select: { category: true } } },
  });
  if (!submission || submission.formId !== formId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.formSubmission.update({
    where: { id: submissionId },
    data: { status },
  });

  if (status === "APPROVED") {
    const cat = categoryInfo(submission.form.category);
    const badge = await prisma.badge.upsert({
      where: { name: cat.roleLabel },
      update: {},
      create: {
        name: cat.roleLabel,
        description: `Postulación aprobada en la categoría ${cat.label}`,
        icon: cat.icon,
      },
    });
    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId: submission.userId, badgeId: badge.id } },
      update: {},
      create: { userId: submission.userId, badgeId: badge.id },
    });
  }

  return NextResponse.json(updated);
}
