"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { categoryInfo } from "@/lib/form-categories";

interface Form {
  id: string;
  title: string;
  slug: string;
  category: string;
  isPublished: boolean;
  _count: { fields: number; submissions: number };
}

export default function MisFormulariosPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mis-formularios")
      .then(r => r.ok ? r.json() : [])
      .then(d => { setForms(d); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Eyebrow color="violet">Organizador</Eyebrow>
          <h1 className="text-4xl font-black mt-3 tracking-tight">Mis formularios</h1>
          <p className="text-content/55 mt-2">Formularios que administrás como organizador.</p>
        </div>

        {loading ? (
          <div className="text-content/40 text-sm">Cargando...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 text-content/35">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-medium">Todavía no administrás ningún formulario.</p>
            <p className="text-sm mt-1">Un admin te tiene que asignar como organizador de uno.</p>
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
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        form.isPublished
                          ? "text-cyan bg-cyan/10 border-cyan/20"
                          : "text-content/40 bg-white/5 border-white/10"
                      }`}>
                        {form.isPublished ? "Publicado" : "Borrador"}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                        style={{ color: cat.color, background: `${cat.color}18`, borderColor: `${cat.color}40` }}>
                        {cat.icon} {cat.label}
                      </span>
                    </div>
                    <div className="text-xs text-content/40 flex gap-3">
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
      </div>
    </div>
  );
}
