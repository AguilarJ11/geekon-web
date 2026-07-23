"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { categoryInfo } from "@/lib/form-categories";

interface Form {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  category: string;
  edition: string | null;
  hasSubmitted: boolean;
  _count: { fields: number };
}

export default function FormulariosPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/forms")
      .then(r => (r.ok ? r.json() : []))
      .then(d => { setForms(d); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Eyebrow color="violet">Participá</Eyebrow>
          <h1 className="text-4xl font-black mt-3 tracking-tight">Formularios</h1>
          <p className="text-content/55 mt-2">
            Postulate a los concursos, torneos y actividades abiertos de GeekOn!.
          </p>
        </div>

        {loading ? (
          <div className="text-content/40 text-sm">Cargando...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 text-content/35">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-medium">Todavía no hay formularios abiertos.</p>
            <p className="text-sm mt-1">Volvé más adelante, se van a ir publicando a medida que se acerca el evento.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {forms.map(form => {
              const cat = categoryInfo(form.category);
              return (
                <div key={form.id} className="rounded-xl p-5 flex items-center gap-4"
                  style={{ background: "#0A0726", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-semibold truncate">{form.title}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                        style={{ color: cat.color, background: `${cat.color}18`, borderColor: `${cat.color}40` }}>
                        {cat.icon} {cat.label}
                      </span>
                      {form.hasSubmitted && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border text-cyan bg-cyan/10 border-cyan/20">
                          Ya enviaste
                        </span>
                      )}
                    </div>
                    {form.description && (
                      <p className="text-sm text-content/50 truncate">{form.description}</p>
                    )}
                    <div className="text-xs text-content/40 flex gap-3 mt-1">
                      <span>{form._count.fields} campos</span>
                      {form.edition && (
                        <>
                          <span>·</span>
                          <span>{form.edition}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Link href={`/formularios/${form.slug}`}>
                      <Button variant={form.hasSubmitted ? "secondary" : "primary"} size="sm">
                        {form.hasSubmitted ? "Ver formulario" : "Responder"}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
