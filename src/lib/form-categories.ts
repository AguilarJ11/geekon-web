export const FORM_CATEGORIES = [
  { key: "STAND",         label: "Stand Comercial",      participantRole: "Comerciante",  ownerRole: "Encargado de Stand",             icon: "🛍️", color: "#FF2D9B" },
  { key: "ARTE",          label: "Artist Alley",         participantRole: "Artista",      ownerRole: "Organizador de Artist Alley",    icon: "🎨", color: "#00E5FF" },
  { key: "ACTIVIDAD",     label: "Actividades",          participantRole: "Asistente",    ownerRole: "Expositor/a de Actividad",       icon: "💡", color: "#10B981" },
  { key: "CHARLA_TALLER", label: "Charlas / Talleres",   participantRole: "Speaker",      ownerRole: "Organizador de Charla/Taller",   icon: "🎤", color: "#3B82F6" },
  { key: "COSPLAY",       label: "Concurso de Cosplay",  participantRole: "Cosplayer",    ownerRole: "Organizador de Cosplay",         icon: "👘", color: "#7B2FFF" },
  { key: "TORNEO",        label: "Torneo / Competencia", participantRole: "Competidor",   ownerRole: "Organizador de Torneo",          icon: "🏆", color: "#F59E0B" },
  { key: "OTRO",          label: "Otro",                 participantRole: "Participante", ownerRole: "Organizador",                    icon: "⭐", color: "#8B8B9E" },
] as const;

export type FormCategoryKey = typeof FORM_CATEGORIES[number]["key"];

export function categoryInfo(key: string) {
  return FORM_CATEGORIES.find((c) => c.key === key) ?? FORM_CATEGORIES[FORM_CATEGORIES.length - 1];
}

export function participantBadgeName(roleLabel: string, edition?: string | null) {
  return edition ? `${roleLabel} — ${edition}` : roleLabel;
}

export function winnerBadgeName(categoryLabel: string, edition?: string | null) {
  return edition ? `Ganador de ${categoryLabel} — ${edition}` : `Ganador de ${categoryLabel}`;
}
