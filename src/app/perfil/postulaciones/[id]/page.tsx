import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { categoryInfo } from "@/lib/form-categories";

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const STATUS_STYLE: Record<SubmissionStatus, { color: string; background: string; borderColor: string }> = {
  PENDING:  { color: "#F59E0B", background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" },
  APPROVED: { color: "#10B981", background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" },
  REJECTED: { color: "#FF2D9B", background: "rgba(255,45,155,0.1)", borderColor: "rgba(255,45,155,0.3)" },
};

const PRICE_FORMAT = new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 });

interface StandOptionSnapshot {
  label: string;
  metraje: string;
  precio: number;
}

export default async function MiPostulacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const submission = await prisma.formSubmission.findUnique({
    where: { id },
    include: {
      form: {
        select: {
          title: true, category: true, edition: true, slug: true,
          fields: { orderBy: { order: "asc" } },
        },
      },
      user: { select: { email: true } },
    },
  });

  if (!submission || submission.user.email !== session.user.email) notFound();

  const cat = categoryInfo(submission.form.category);
  const data = submission.data as Record<string, unknown>;
  const standOption = data.standOption as StandOptionSnapshot | undefined;

  return (
    <div className="min-h-screen bg-navy px-4 py-16 relative overflow-hidden">
      <div className="absolute pointer-events-none top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]" aria-hidden="true">
        <div className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(123,47,255,0.15) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <Button variant="ghost" size="sm" href="/perfil" className="mb-6">← Volver a mi perfil</Button>

        <div className="mb-6">
          <Eyebrow color="violet" className="mb-4">
            <span aria-hidden="true">{cat.icon}</span>&nbsp;{cat.label}
          </Eyebrow>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            {submission.form.title}
            {submission.form.edition && <span className="text-content/40 font-medium"> · {submission.form.edition}</span>}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border" style={STATUS_STYLE[submission.status]}>
              {STATUS_LABEL[submission.status]}
            </span>
            {submission.isWinner && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                style={{ color: "#F59E0B", background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.35)" }}>
                🏆 Ganador/a
              </span>
            )}
          </div>
          <p className="text-xs text-content/35 mt-3">
            Enviada el {new Date(submission.createdAt).toLocaleDateString("es-UY", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
        </div>

        {standOption && (
          <div className="rounded-xl px-4 py-3 mb-4 flex items-center justify-between"
            style={{ background: "rgba(123,47,255,0.08)", border: "1px solid rgba(123,47,255,0.2)" }}>
            <div>
              <div className="font-semibold text-sm">{standOption.label}</div>
              <div className="text-xs text-content/45">{standOption.metraje}</div>
            </div>
            <div className="font-bold text-violet">{PRICE_FORMAT.format(standOption.precio)}</div>
          </div>
        )}

        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(10,7,38,0.75)", border: "1px solid rgba(123,47,255,0.18)", backdropFilter: "blur(20px)" }}>
          {submission.form.fields.map(field => (
            <div key={field.id}>
              <div className="text-xs text-content/40 mb-1 uppercase tracking-wider font-semibold">{field.label}</div>
              <div className="text-sm text-content/85 bg-white/5 rounded-lg px-3 py-2 break-words">
                {String(data[field.id] ?? "—")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
