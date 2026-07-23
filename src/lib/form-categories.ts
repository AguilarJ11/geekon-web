export const FORM_CATEGORIES = [
  { key: "COSPLAY",  label: "Cosplay",              roleLabel: "Cosplayer",   icon: "👘", color: "#7B2FFF" },
  { key: "ARTE",      label: "Arte / Artist Alley",  roleLabel: "Artista",     icon: "🎨", color: "#00E5FF" },
  { key: "TORNEO",    label: "Torneo / Competencia", roleLabel: "Competidor",  icon: "🏆", color: "#F59E0B" },
  { key: "STAND",     label: "Stand Comercial",      roleLabel: "Comerciante", icon: "🛍️", color: "#FF2D9B" },
  { key: "ACTIVIDAD", label: "Actividad",            roleLabel: "Organizador", icon: "💡", color: "#10B981" },
  { key: "OTRO",      label: "Otro",                 roleLabel: "Participante", icon: "⭐", color: "#8B8B9E" },
] as const;

export type FormCategoryKey = typeof FORM_CATEGORIES[number]["key"];

export function categoryInfo(key: string) {
  return FORM_CATEGORIES.find((c) => c.key === key) ?? FORM_CATEGORIES[FORM_CATEGORIES.length - 1];
}
