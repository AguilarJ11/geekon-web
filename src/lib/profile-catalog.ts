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
