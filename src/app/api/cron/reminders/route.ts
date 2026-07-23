import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

const REMINDER_DAYS_BEFORE = 3;

function daysUntil(date: Date): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setUTCHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function standLabelOf(data: unknown): string | null {
  const standOption = (data as { standOption?: { label?: string } } | null)?.standOption;
  return standOption?.label ?? null;
}

function reminderEmail(kind: "seña" | "pago completo", formTitle: string, standLabel: string | null, dueDate: Date, name: string | null) {
  const dateStr = new Intl.DateTimeFormat("es-UY", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(dueDate);
  const standLine = standLabel ? `para tu stand "${standLabel}"` : "para tu stand";
  return {
    subject: `Recordatorio: se acerca el vencimiento de tu ${kind} — ${formTitle}`,
    html: `
      <p>Hola${name ? ` ${name}` : ""},</p>
      <p>Te recordamos que el <strong>${dateStr}</strong> vence el plazo ${standLine} en <strong>${formTitle}</strong> para abonar la <strong>${kind}</strong>.</p>
      <p>Si ya la abonaste, podés ignorar este mensaje.</p>
      <p>— GeekOn!</p>
    `,
  };
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const forms = await prisma.form.findMany({
    where: {
      category: "STAND",
      OR: [{ depositDueDate: { not: null } }, { fullPaymentDueDate: { not: null } }],
    },
    include: {
      submissions: {
        where: { status: "APPROVED" },
        include: { user: { select: { email: true, name: true } } },
      },
    },
  });

  let sent = 0;

  for (const form of forms) {
    for (const submission of form.submissions) {
      const standLabel = standLabelOf(submission.data);

      if (
        form.depositDueDate &&
        !submission.depositReminderSentAt &&
        daysUntil(form.depositDueDate) >= 0 &&
        daysUntil(form.depositDueDate) <= REMINDER_DAYS_BEFORE
      ) {
        const { subject, html } = reminderEmail("seña", form.title, standLabel, form.depositDueDate, submission.user.name);
        await sendMail({ to: submission.user.email, subject, html });
        await prisma.formSubmission.update({ where: { id: submission.id }, data: { depositReminderSentAt: new Date() } });
        sent++;
      }

      if (
        form.fullPaymentDueDate &&
        !submission.fullPaymentReminderSentAt &&
        daysUntil(form.fullPaymentDueDate) >= 0 &&
        daysUntil(form.fullPaymentDueDate) <= REMINDER_DAYS_BEFORE
      ) {
        const { subject, html } = reminderEmail("pago completo", form.title, standLabel, form.fullPaymentDueDate, submission.user.name);
        await sendMail({ to: submission.user.email, subject, html });
        await prisma.formSubmission.update({ where: { id: submission.id }, data: { fullPaymentReminderSentAt: new Date() } });
        sent++;
      }
    }
  }

  return NextResponse.json({ ok: true, sent });
}
