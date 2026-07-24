"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { ApplicationCard } from "@/app/perfil/components";
import { categoryInfo } from "@/lib/form-categories";

interface OwnedForm {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  _count: { fields: number; submissions: number };
}

interface Submission {
  id: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  isWinner: boolean;
  form: { title: string; category: string; edition: string | null };
}

export default function MisFormulariosPage() {
  const [ownedForms, setOwnedForms] = useState<OwnedForm[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mis-formularios")
      .then(r => r.ok ? r.json() : { ownedForms: [], submissions: [] })
      .then(d => { setOwnedForms(d.ownedForms); setSubmissions(d.submissions); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Eyebrow color="violet">Participá</Eyebrow>
          <h1 className="text-4xl font-black mt-3 tracking-tight">Mis inscripciones</h1>
          <p className="text-content/55 mt-2">
            Las inscripciones en las que participás y las que administrás como organizador.
          </p>
        </div>

        {loading ? (
          <div className="text-content/40 text-sm">Cargando...</div>
        ) : (
          <>
            {/* ── Inscripciones en las que participás ────────────── */}
            <section className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-content/50 mb-3">
                En las que participás
              </h2>
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-content/35 rounded-xl" style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <p className="font-medium">Todavía no te postulaste a nada.</p>
                  <p className="text-sm mt-1">
                    Mirá las <Link href="/inscripciones" className="text-violet hover:text-cyan transition-colors">inscripciones abiertas</Link>.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map(sub => {
                    const cat = categoryInfo(sub.form.category);
                    return (
                      <ApplicationCard
                        key={sub.id}
                        id={sub.id}
                        title={sub.form.title}
                        edition={sub.form.edition}
                        categoryIcon={cat.icon}
                        categoryLabel={cat.label}
                        categoryColor={cat.color}
                        createdAt={new Date(sub.createdAt)}
                        status={sub.status}
                        isWinner={sub.isWinner}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* ── Inscripciones que gestionás ─────────────────────── */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-content/50 mb-3">
                Que gestionás
              </h2>
              {ownedForms.length === 0 ? (
                <div className="text-center py-12 text-content/35 rounded-xl" style={{ border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <p className="font-medium">Todavía no administrás ninguna inscripción.</p>
                  <p className="text-sm mt-1">Un admin te tiene que asignar como organizador de una.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ownedForms.map(form => {
                    const cat = categoryInfo(form.category);
                    return (
                      <div key={form.id} className="rounded-xl p-5 flex items-center gap-4"
                        style={{ background: "#0A0726", border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold truncate block">{form.title}</span>
                          <div className="flex items-center gap-1.5 mt-1.5 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-flex items-center gap-1"
                              style={{ color: cat.color, background: `${cat.color}18`, borderColor: `${cat.color}40` }}>
                              {cat.icon} {cat.label}
                            </span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              form.isPublished
                                ? "text-cyan bg-cyan/10 border-cyan/20"
                                : "text-content/40 bg-white/5 border-white/10"
                            }`}>
                              {form.isPublished ? "Publicado" : "Borrador"}
                            </span>
                          </div>
                          <div className="text-xs text-content/40 flex gap-3 mt-1">
                            <span>{form._count.fields} campos</span>
                            <span>·</span>
                            <span>{form._count.submissions} respuestas</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Link href={`/mis-formularios/${form.id}/respuestas`}>
                            <Button variant="ghost" size="sm">Respuestas</Button>
                          </Link>
                          <Link href={`/mis-formularios/${form.id}/editar`}>
                            <Button variant="secondary" size="sm">Editar</Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
