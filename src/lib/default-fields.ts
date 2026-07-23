import type { FieldType, FormCategory } from "@prisma/client";

export interface DefaultField {
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
}

// Campos que se precargan solos al crear un formulario de esta categoría.
// El admin los puede editar, borrar o agregar más arriba/abajo como a
// cualquier otro campo — esto solo evita tener que tipearlos cada vez.
export const DEFAULT_FIELDS: Partial<Record<FormCategory, DefaultField[]>> = {
  STAND: [
    { type: "TEXT",     label: "Nombre del emprendimiento", placeholder: "Ej: La Cueva del Cómic",                required: true },
    { type: "TEXT",     label: "Nombre de contacto",         placeholder: "Ej: María Pérez",                       required: true },
    { type: "PHONE",    label: "Teléfono de contacto",       placeholder: "Ej: 099 123 456",                       required: true },
    { type: "TEXTAREA", label: "Descripción breve",          placeholder: "Contanos qué vendés o qué hacés en tu stand...", required: true },
    { type: "TEXT",     label: "Redes sociales",              placeholder: "Instagram, TikTok, etc.",               required: true },
  ],
};
