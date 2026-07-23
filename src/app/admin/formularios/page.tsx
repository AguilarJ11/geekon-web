"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import AdminTabs from "@/components/admin/AdminTabs";
import { FORM_CATEGORIES, categoryInfo } from "@/lib/form-categories";

interface Form {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  category: string;
  isPublished: boolean;
  createdAt: string;
  _count: { fields: number; submissions: number };
}

export default function AdminFormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("OTRO");
  const [edition, setEdition] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [createError, setCreateError] = useState("");
  const [showNew, setShowNew] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/forms");
    if (res.ok) setForms(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError("");
    const res = await fetch("/api/admin/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, edition, ownerEmail }),
    });
    if (res.ok) {
      const form = await res.json();
      setTitle(""); setDescription(""); setCategory("OTRO"); setEdition(""); setOwnerEmail(""); setShowNew(false);
      window.location.href = `/admin/formularios/${form.id}/editar`;
    } else {
      const d = await res.json().catch(() => ({}));
      setCreateError(d.error ?? "Ocurrió un error");
    }
    setCreating(false);
  }

  async function togglePublish(form: Form) {
    await fetch(`/api/admin/forms/${form.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !form.isPublished }),
    });
    load();
  }

  async function deleteForm(id: string) {
    if (!confirm("¿Eliminás este formulario y todas sus respuestas?")) return;
    await fetch(`/api/admin/forms/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-2 flex items-start justify-between gap-4">
          <div>
            <Eyebrow color="violet">Admin</Eyebrow>
            <h1 className="text-4xl font-black mt-3 tracking-tight">Formularios</h1>
            <p className="text-content/55 mt-2">Creá y gestioná los formularios de participación.</p>
          </div>
          <Button onClick={() => setShowNew(true)} size="md">+ Nuevo formulario</Button>
        </div>

        <AdminTabs />

        {/* New form modal */}
        {showNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(5,3,26,0.85)", backdropFilter: "blur(12px)" }}>
            <div className="w-full max-w-md rounded-2xl p-8"
              style={{ background: "#0A0726", border: "1px solid rgba(123,47,255,0.25)" }}>
              <h2 className="text-xl font-bold mb-6">Nuevo formulario</h2>
              <form onSubmit={create} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-content/65">Título</label>
                  <input value={title} onChange={e => setTitle(e.target.value)}
                    className="input-premium" placeholder="Ej: Artista Alley 2026" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-content/65">Descripción (opcional)</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    className="input-premium resize-none" rows={3}
                    placeholder="Breve descripción del formulario..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-content/65">Categoría</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="input-premium">
                    {FORM_CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-content/35 mt-1.5">
                    Al aprobar una postulación de esta categoría, el usuario recibe el título &quot;{categoryInfo(category).participantRole}&quot; en su perfil.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-content/65">Edición de GeekOn (opcional)</label>
                  <input value={edition} onChange={e => setEdition(e.target.value)}
                    className="input-premium" placeholder="Ej: GeekOn 2026" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-content/65">
                    Organizador / dueño (opcional)
                  </label>
                  <input type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)}
                    className="input-premium" placeholder="email@delusuario.com" />
                  <p className="text-xs text-content/35 mt-1.5">
                    Si asignás un dueño, va a poder administrar este formulario y aprobar sus postulaciones
                    sin acceso al resto del panel admin.
                  </p>
                </div>
                {createError && (
                  <p className="text-xs text-pink">{createError}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={creating} size="md" className="flex-1 justify-center">
                    {creating ? "Creando..." : "Crear y editar"}
                  </Button>
                  <Button variant="secondary" size="md" onClick={() => setShowNew(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Forms list */}
        {loading ? (
          <div className="text-content/40 text-sm">Cargando...</div>
        ) : forms.length === 0 ? (
          <div className="text-center py-20 text-content/35">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-medium">No hay formularios todavía.</p>
            <p className="text-sm mt-1">Creá el primero con el botón de arriba.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {forms.map(form => (
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
                      style={{
                        color: categoryInfo(form.category).color,
                        background: `${categoryInfo(form.category).color}18`,
                        borderColor: `${categoryInfo(form.category).color}40`,
                      }}>
                      {categoryInfo(form.category).icon} {categoryInfo(form.category).participantRole}
                    </span>
                  </div>
                  <div className="text-xs text-content/40 flex gap-3">
                    <span>{form._count.fields} campos</span>
                    <span>·</span>
                    <span>{form._count.submissions} respuestas</span>
                    <span>·</span>
                    <span>/formularios/{form.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/formularios/${form.id}/respuestas`}>
                    <Button variant="ghost" size="sm">Respuestas</Button>
                  </Link>
                  <Link href={`/admin/formularios/${form.id}/editar`}>
                    <Button variant="secondary" size="sm">Editar</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => togglePublish(form)}>
                    {form.isPublished ? "Despublicar" : "Publicar"}
                  </Button>
                  <button onClick={() => deleteForm(form.id)}
                    className="text-xs text-pink/60 hover:text-pink transition-colors px-2 py-1">
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
