"use client";

import { useState } from "react";
import { FieldType } from "@prisma/client";

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string | null;
  required: boolean;
  order: number;
  options: string | null;
}

export const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "TEXT",     label: "Texto corto" },
  { value: "TEXTAREA", label: "Texto largo" },
  { value: "EMAIL",    label: "Email" },
  { value: "PHONE",    label: "Teléfono" },
  { value: "NUMBER",   label: "Número" },
  { value: "SELECT",   label: "Desplegable" },
  { value: "RADIO",    label: "Opción única" },
  { value: "CHECKBOX", label: "Casilla de verificación" },
  { value: "DATE",     label: "Fecha" },
];

export const NEEDS_OPTIONS: FieldType[] = ["SELECT", "RADIO"];

export function FieldRow({
  field,
  index,
  total,
  onUpdate,
  onDelete,
  onMove,
}: {
  field: Field;
  index: number;
  total: number;
  onUpdate: (id: string, data: Partial<Field>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  const [open, setOpen] = useState(false);
  const [optionsText, setOptionsText] = useState(
    field.options ? (JSON.parse(field.options) as string[]).join("\n") : ""
  );

  function saveOptions() {
    const arr = optionsText.split("\n").map(s => s.trim()).filter(Boolean);
    onUpdate(field.id, { options: arr.length ? JSON.stringify(arr) : null });
  }

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#0A0726" }}>
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <button onClick={() => onMove(field.id, -1)} disabled={index === 0}
            className="text-content/30 hover:text-content/70 disabled:opacity-20 text-xs leading-none">▲</button>
          <button onClick={() => onMove(field.id, 1)} disabled={index === total - 1}
            className="text-content/30 hover:text-content/70 disabled:opacity-20 text-xs leading-none">▼</button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{field.label || "Sin etiqueta"}</div>
          <div className="text-[11px] text-content/40 mt-0.5">
            {FIELD_TYPES.find(t => t.value === field.type)?.label}
            {field.required && " · Requerido"}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOpen(!open)}
            className="text-xs text-violet hover:text-violet/70 transition-colors px-2">
            {open ? "Cerrar" : "Editar"}
          </button>
          <button onClick={() => onDelete(field.id)}
            className="text-xs text-pink/50 hover:text-pink transition-colors px-2">
            Eliminar
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-content/50 mb-1">Etiqueta</label>
              <input
                value={field.label}
                onChange={e => onUpdate(field.id, { label: e.target.value })}
                className="input-premium text-sm py-2"
                placeholder="Ej: Nombre completo"
              />
            </div>
            <div>
              <label className="block text-xs text-content/50 mb-1">Placeholder</label>
              <input
                value={field.placeholder ?? ""}
                onChange={e => onUpdate(field.id, { placeholder: e.target.value })}
                className="input-premium text-sm py-2"
                placeholder="Texto de ayuda..."
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={field.required}
              onChange={e => onUpdate(field.id, { required: e.target.checked })}
              className="accent-violet"
            />
            <span className="text-sm text-content/65">Campo obligatorio</span>
          </label>
          {NEEDS_OPTIONS.includes(field.type) && (
            <div>
              <label className="block text-xs text-content/50 mb-1">
                Opciones (una por línea)
              </label>
              <textarea
                value={optionsText}
                onChange={e => setOptionsText(e.target.value)}
                onBlur={saveOptions}
                className="input-premium text-sm resize-none"
                rows={4}
                placeholder={"Opción A\nOpción B\nOpción C"}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
