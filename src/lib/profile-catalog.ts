export const INTEREST_CATALOG = [
  { key: "anime",    label: "Anime",       icon: "🎌" },
  { key: "manga",    label: "Manga",       icon: "📖" },
  { key: "comics",   label: "Cómics",      icon: "💥" },
  { key: "gaming",   label: "Gaming",      icon: "🎮" },
  { key: "cosplay",  label: "Cosplay",     icon: "👘" },
  { key: "tcg",      label: "Cartas TCG",  icon: "🃏" },
  { key: "scifi",    label: "Sci-Fi",      icon: "🚀" },
  { key: "fantasy",  label: "Fantasía",    icon: "🐉" },
  { key: "terror",   label: "Terror",      icon: "🎃" },
  { key: "boardgames", label: "Juegos de mesa", icon: "🎲" },
  { key: "comics_us", label: "Superhéroes", icon: "🦸" },
  { key: "arte",     label: "Arte / Ilustración", icon: "🎨" },
] as const;

export type InterestKey = typeof INTEREST_CATALOG[number]["key"];

export const URUGUAY_DEPARTMENTS = [
  "Artigas", "Canelones", "Cerro Largo", "Colonia", "Durazno",
  "Flores", "Florida", "Lavalleja", "Maldonado", "Montevideo",
  "Paysandú", "Río Negro", "Rivera", "Rocha", "Salto",
  "San José", "Soriano", "Tacuarembó", "Treinta y Tres",
] as const;

export const SOCIAL_LINKS: Record<string, (handle: string) => { href: string; icon: string; label: string }> = {
  instagram: (h) => ({ href: `https://instagram.com/${h.replace(/^@/, "")}`, icon: "📷", label: h }),
  tiktok:    (h) => ({ href: `https://tiktok.com/@${h.replace(/^@/, "")}`, icon: "🎵", label: h }),
  twitter:   (h) => ({ href: `https://x.com/${h.replace(/^@/, "")}`, icon: "✕", label: h }),
};

export const STAFF_ROLES: Record<string, { label: string; color: string }> = {
  ADMIN:            { label: "Administrador",     color: "#F59E0B" },
  FOTOGRAFO:        { label: "Fotógrafo",          color: "#00E5FF" },
  ARTIST:           { label: "Artista",           color: "#00E5FF" },
  COMMERCIAL_STAND: { label: "Stand Comercial",   color: "#FF2D9B" },
  STAFF_CM:         { label: "Community Manager", color: "#F59E0B" },
  STAFF_STANDS:     { label: "Staff de Stands",   color: "#10B981" },
  COORDINATOR:      { label: "Coordinador",       color: "#FF2D9B" },
};

export const VISITANTE_ROLE = { label: "Visitante", color: "#8B8B9E" };
