"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

interface FormField {
  id: string;
  label: string;
  type: string;
  order: number;
}

type Status = "PENDING" | "APPROVED" | "REJECTED";

interface Submission {
  id: string;
  createdAt: string;
  data: Record<string, unknown>;
  status: Status;
  isWinner: boolean;
  user: { id: string; name: string | null; email: string };
}

const STATUS_LABEL: Record<Status, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const STATUS_STYLE: Record<Status, { color: string; background: string; borderColor: string }> = {
  PENDING:  { color: "#F59E0B", background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" },
  APPROVED: { color: "#10B981", background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" },
  REJECTED: { color: "#FF2D9B", background: "rgba(255,45,155,0.1)", borderColor: "rgba(255,45,155,0.3)" },
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border" style={STATUS_STYLE[status]}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function WinnerBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
      style={{ color: "#F59E0B", background: "rgba(245,158,11,0.12)", borderColor: "rgba(245,158,11,0.35)" }}>
      🏆 Ganador
    </span>
  );
}

interface FormWithSubmissions {
  form: { id: string; title: string; slug: string; fields: FormField[] };
  submissions: Submission[];
}

export default function SubmissionsManager({
  formId,
  backHref,
  notFoundHref,
}: {
  formId: string;
  backHref: string;
  notFoundHref: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<FormWithSubmissions | null>(null);
  const [selected, setSelected] = useState<Submission | null>(null);

  useEffect(() => {
    fetch(`/api/admin/forms/${formId}/submissions`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); else router.push(notFoundHref); });
  }, [formId, notFoundHref, router]);

  async function patchSubmission(submissionId: string, patch: Partial<Pick<Submission, "status" | "isWinner">>) {
    const res = await fetch(`/api/admin/forms/${formId}/submissions/${submissionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok || !data) return;
    setData({
      ...data,
      submissions: data.submissions.map(s => s.id === submissionId ? { ...s, ...patch } : s),
    });
    setSelected(sel => sel && sel.id === submissionId ? { ...sel, ...patch } : sel);
  }

  if (!data) return (
    <div className="min-h-screen bg-navy flex items-center justify-center text-content/40">
      Cargando...
    </div>
  );

  const sortedFields = [...data.form.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="sm" href={backHref}>← Volver</Button>
        </div>
        <h1 className="text-3xl font-black mb-1 mt-4">{data.form.title}</h1>
        <p className="text-content/40 text-sm mb-8">{data.submissions.length} respuestas</p>

        {data.submissions.length === 0 ? (
          <div className="text-center py-20 text-content/30 border border-dashed border-white/10 rounded-xl">
            Todavía no hay respuestas.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl"
            style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#0A0726", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  <th className="text-left px-4 py-3 text-content/40 font-semibold text-xs uppercase tracking-wider">Usuario</th>
                  {sortedFields.map(f => (
                    <th key={f.id} className="text-left px-4 py-3 text-content/40 font-semibold text-xs uppercase tracking-wider">
                      {f.label}
                    </th>
                  ))}
                  <th className="text-left px-4 py-3 text-content/40 font-semibold text-xs uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-4 py-3 text-content/40 font-semibold text-xs uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.submissions.map((sub, i) => (
                  <tr key={sub.id}
                    style={{
                      background: i % 2 === 0 ? "rgba(10,7,38,0.5)" : "transparent",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{sub.user.name ?? "—"}</div>
                      <div className="text-xs text-content/40">{sub.user.email}</div>
                    </td>
                    {sortedFields.map(f => (
                      <td key={f.id} className="px-4 py-3 text-content/70 max-w-[200px] truncate">
                        {String(sub.data[f.id] ?? "—")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-content/40 text-xs whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString("es-AR", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={sub.status} />
                        {sub.isWinner && <WinnerBadge />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setSelected(sub)}
                          className="text-xs text-violet hover:text-violet/70 transition-colors">
                          Ver
                        </button>
                        {sub.status !== "APPROVED" && (
                          <button onClick={() => patchSubmission(sub.id, { status: "APPROVED" })}
                            className="text-xs text-[#10B981] hover:brightness-125 transition-all">
                            Aprobar
                          </button>
                        )}
                        {sub.status !== "REJECTED" && (
                          <button onClick={() => patchSubmission(sub.id, { status: "REJECTED" })}
                            className="text-xs text-pink hover:brightness-125 transition-all">
                            Rechazar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(5,3,26,0.85)", backdropFilter: "blur(12px)" }}
          onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl p-8 max-h-[80vh] overflow-y-auto"
            style={{ background: "#0A0726", border: "1px solid rgba(123,47,255,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-bold">{selected.user.name ?? selected.user.email}</div>
                <div className="text-xs text-content/40">{selected.user.email}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-content/40 hover:text-content text-xl">×</button>
            </div>

            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <StatusBadge status={selected.status} />
              {selected.isWinner && <WinnerBadge />}
              {selected.status !== "APPROVED" && (
                <button onClick={() => patchSubmission(selected.id, { status: "APPROVED" })}
                  className="text-xs text-[#10B981] hover:brightness-125 transition-all">
                  Aprobar
                </button>
              )}
              {selected.status !== "REJECTED" && (
                <button onClick={() => patchSubmission(selected.id, { status: "REJECTED" })}
                  className="text-xs text-pink hover:brightness-125 transition-all">
                  Rechazar
                </button>
              )}
              {selected.status !== "PENDING" && (
                <button onClick={() => patchSubmission(selected.id, { status: "PENDING" })}
                  className="text-xs text-content/40 hover:text-content/70 transition-all">
                  Marcar pendiente
                </button>
              )}
            </div>

            {selected.status === "APPROVED" && (
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-content/65">
                  <input
                    type="checkbox"
                    checked={selected.isWinner}
                    onChange={e => patchSubmission(selected.id, { isWinner: e.target.checked })}
                    className="accent-[#F59E0B]"
                  />
                  🏆 Marcar como ganador/a
                </label>
              </div>
            )}

            <div className="space-y-4">
              {sortedFields.map(f => (
                <div key={f.id}>
                  <div className="text-xs text-content/40 mb-1 uppercase tracking-wider font-semibold">{f.label}</div>
                  <div className="text-sm text-content/85 bg-white/5 rounded-lg px-3 py-2 break-words">
                    {String(selected.data[f.id] ?? "—")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
