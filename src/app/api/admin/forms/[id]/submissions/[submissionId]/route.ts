import { NextRequest, NextResponse } from "next/server";
import { requireFormAccess } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categoryInfo, participantBadgeName, winnerBadgeName } from "@/lib/form-categories";
import { awardBadge } from "@/lib/badges";

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; submissionId: string }> }
) {
  const { id: formId, submissionId } = await params;
  if (!(await requireFormAccess(formId))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status, isWinner } = await req.json();
  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const submission = await prisma.formSubmission.findUnique({
    where: { id: submissionId },
    include: { form: { select: { category: true, title: true, edition: true } } },
  });
  if (!submission || submission.formId !== formId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const finalStatus = status ?? submission.status;
  if (isWinner && finalStatus !== "APPROVED") {
    return NextResponse.json({ error: "Solo se puede marcar ganador a una postulación aprobada" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (status !== undefined) update.status = status;
  if (isWinner !== undefined) update.isWinner = !!isWinner;

  const updated = await prisma.formSubmission.update({
    where: { id: submissionId },
    data: update,
  });

  const cat = categoryInfo(submission.form.category);

  if (status === "APPROVED") {
    await awardBadge(
      submission.userId,
      participantBadgeName(cat.participantRole, submission.form.edition),
      `Postulación aprobada en "${submission.form.title}"`,
      cat.icon
    );
  }

  if (isWinner) {
    await awardBadge(
      submission.userId,
      winnerBadgeName(cat.label, submission.form.edition),
      `Ganador/a de "${submission.form.title}"`,
      "🏆"
    );
  }

  return NextResponse.json(updated);
}
