"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import { categoryInfo, FORM_CATEGORIES } from "@/lib/form-categories";

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

function FormulariosContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get("categoria");
  const activeCategory = categoria ? FORM_CATEGORIES.find(c => c.key === categoria) : undefined;

  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = activeCategory ? `?categoria=${activeCategory.key}` : "";
    fetch(`/api/forms${query}`)
      .then(r => (r.ok ? r.json() : []))
      .then(d => { setForms(d); setLoading(false); });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Eyebrow color="violet">Inscripciones</Eyebrow>
          <h1 className="text-4xl font-black mt-3 tracking-tight">Participá en GeekOn!</h1>
          <p className="text-content/55 mt-2">
            Postulate para participar de los diferentes sectores.
          </p>

          {activeCategory && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5"
                style={{ color: activeCategory.color, background: `${activeCategory.color}18`, borderColor: `${activeCategory.color}40` }}>
                {activeCategory.icon} {activeCategory.label}
              </span>
              <Link href="/inscripciones" className="text-xs text-content/40 hover:text-content/70 transition-colors">
                Ver todos ✕
              </Link>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-content/40 text-sm">Cargando...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 text-content/35">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-medium">
              {activeCategory ? `Todavía no hay formularios de ${activeCategory.label}.` : "Todavía no hay formularios abiertos."}
            </p>
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
                    <span className="font-semibold truncate block">{form.title}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-flex items-center gap-1 mt-1.5 mb-1"
                      style={{ color: cat.color, background: `${cat.color}18`, borderColor: `${cat.color}40` }}>
                      {cat.icon} {cat.label}
                    </span>
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
                  <div className="shrink-0 flex items-center gap-2.5">
                    {form.hasSubmitted && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border text-cyan bg-cyan/10 border-cyan/20 whitespace-nowrap">
                        Ya enviaste
                      </span>
                    )}
                    <Link href={`/inscripciones/${form.slug}`}>
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

export default function FormulariosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center text-content/40">
        Cargando...
      </div>
    }>
      <FormulariosContent />
    </Suspense>
  );
}
