"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { FieldType } from "@prisma/client";
import { categoryInfo } from "@/lib/form-categories";
import { FieldRow, FIELD_TYPES, type Field } from "@/components/forms/FieldRow";

interface Form {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  category: string;
  edition: string | null;
  isPublished: boolean;
  fields: Field[];
}

export default function EditOwnedFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [saving, setSaving] = useState(false);
  const [addType, setAddType] = useState<FieldType>("TEXT");
  const [addLabel, setAddLabel] = useState("");
  const [addRequired, setAddRequired] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  async function load() {
    const res = await fetch(`/api/admin/forms/${id}`);
    if (res.ok) setForm(await res.json());
    else router.push("/mis-formularios");
  }

  useEffect(() => { load(); }, [id]);

  async function saveTitle() {
    if (!form) return;
    setSaving(true);
    await fetch(`/api/admin/forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.title, description: form.description }),
    });
    setSaving(false);
  }

  async function togglePublish() {
    if (!form) return;
    const res = await fetch(`/api/admin/forms/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !form.isPublished }),
    });
    if (res.ok) setForm(f => f ? { ...f, isPublished: !f.isPublished } : f);
  }

  async function addField(e: React.FormEvent) {
    e.preventDefault();
    if (!addLabel.trim()) return;
    const res = await fetch(`/api/admin/forms/${id}/fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: addType, label: addLabel, required: addRequired }),
    });
    if (res.ok) {
      setAddLabel(""); setAddRequired(false); setShowAdd(false);
      load();
    }
  }

  async function updateField(fieldId: string, data: Partial<Field>) {
    setForm(f => f ? {
      ...f,
      fields: f.fields.map(field => field.id === fieldId ? { ...field, ...data } : field)
    } : f);

    await fetch(`/api/admin/forms/${id}/fields/${fieldId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function deleteField(fieldId: string) {
    if (!confirm("¿Eliminás este campo?")) return;
    await fetch(`/api/admin/forms/${id}/fields/${fieldId}`, { method: "DELETE" });
    load();
  }

  async function moveField(fieldId: string, dir: -1 | 1) {
    if (!form) return;
    const fields = [...form.fields].sort((a, b) => a.order - b.order);
    const idx = fields.findIndex(f => f.id === fieldId);
    const target = fields[idx + dir];
    if (!target) return;

    await Promise.all([
      fetch(`/api/admin/forms/${id}/fields/${fieldId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: target.order }),
      }),
      fetch(`/api/admin/forms/${id}/fields/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: fields[idx].order }),
      }),
    ]);
    load();
  }

  if (!form) return (
    <div className="min-h-screen bg-navy flex items-center justify-center text-content/40">
      Cargando...
    </div>
  );

  const sortedFields = [...form.fields].sort((a, b) => a.order - b.order);
  const cat = categoryInfo(form.category);

  return (
    <div className="min-h-screen bg-navy px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button variant="ghost" size="sm" href="/mis-formularios">← Volver</Button>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            form.isPublished
              ? "text-cyan bg-cyan/10 border-cyan/20"
              : "text-content/40 bg-white/5 border-white/10"
          }`}>
            {form.isPublished ? "Publicado" : "Borrador"}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border"
            style={{ color: cat.color, background: `${cat.color}18`, borderColor: `${cat.color}40` }}>
            {cat.icon} {cat.label}{form.edition ? ` · ${form.edition}` : ""}
          </span>
        </div>

        {/* Form meta */}
        <div className="rounded-xl p-5 mb-6 space-y-3"
          style={{ background: "#0A0726", border: "1px solid rgba(123,47,255,0.2)" }}>
          <div>
            <label className="block text-xs text-content/50 mb-1.5">Título</label>
            <input
              value={form.title}
              onChange={e => setForm(f => f ? { ...f, title: e.target.value } : f)}
              onBlur={saveTitle}
              className="input-premium"
            />
          </div>
          <div>
            <label className="block text-xs text-content/50 mb-1.5">Descripción</label>
            <textarea
              value={form.description ?? ""}
              onChange={e => setForm(f => f ? { ...f, description: e.target.value } : f)}
              onBlur={saveTitle}
              className="input-premium resize-none"
              rows={2}
              placeholder="Descripción pública del formulario..."
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-content/40">/formularios/{form.slug}</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm"
                href={`/formularios/${form.slug}`} target="_blank">
                Preview
              </Button>
              <Button
                size="sm"
                variant={form.isPublished ? "ghost" : "primary"}
                onClick={togglePublish}
              >
                {form.isPublished ? "Despublicar" : "Publicar"}
              </Button>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-content/70">
            Campos ({sortedFields.length})
          </h2>
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
            {showAdd ? "Cancelar" : "+ Agregar campo"}
          </Button>
        </div>

        {showAdd && (
          <form onSubmit={addField} className="rounded-xl p-4 mb-3 space-y-3"
            style={{ background: "rgba(123,47,255,0.07)", border: "1px solid rgba(123,47,255,0.2)" }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-content/50 mb-1">Tipo</label>
                <select
                  value={addType}
                  onChange={e => setAddType(e.target.value as FieldType)}
                  className="input-premium text-sm py-2"
                >
                  {FIELD_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-content/50 mb-1">Etiqueta</label>
                <input
                  value={addLabel}
                  onChange={e => setAddLabel(e.target.value)}
                  className="input-premium text-sm py-2"
                  placeholder="Ej: ¿Cuál es tu personaje?"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-content/65">
                <input type="checkbox" checked={addRequired}
                  onChange={e => setAddRequired(e.target.checked)} className="accent-violet" />
                Campo obligatorio
              </label>
              <Button type="submit" size="sm">Agregar</Button>
            </div>
          </form>
        )}

        {sortedFields.length === 0 ? (
          <div className="text-center py-12 text-content/30 text-sm border border-dashed border-white/10 rounded-xl">
            Sin campos todavía. Agregá el primero.
          </div>
        ) : (
          <div className="space-y-2">
            {sortedFields.map((field, i) => (
              <FieldRow
                key={field.id}
                field={field}
                index={i}
                total={sortedFields.length}
                onUpdate={updateField}
                onDelete={deleteField}
                onMove={moveField}
              />
            ))}
          </div>
        )}

        {saving && (
          <div className="fixed bottom-6 right-6 text-xs text-content/50 bg-surface/90 px-3 py-2 rounded-lg border border-white/10">
            Guardando...
          </div>
        )}
      </div>
    </div>
  );
}
