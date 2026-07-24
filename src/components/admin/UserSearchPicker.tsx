"use client";

import { useEffect, useRef, useState } from "react";

export interface UserResult {
  username: string;
  name: string | null;
  image: string | null;
  role: string;
}

// Buscador con dropdown para elegir un usuario existente (por nombre o
// @usuario) en vez de tener que escribir su email a mano. Reutiliza el mismo
// endpoint de búsqueda que el buscador público de /comunidad.
export default function UserSearchPicker({ onSelect, placeholder }: {
  onSelect: (user: UserResult) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    debounceRef.current = setTimeout(() => {
      fetch(`/api/usuarios/search?q=${encodeURIComponent(query.trim())}`)
        .then(r => r.ok ? r.json() : [])
        .then((d: UserResult[]) => { setResults(d); setOpen(true); });
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className="relative">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => { if (results.length) setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="input-premium text-sm py-2"
        placeholder={placeholder ?? "Buscá por nombre o @usuario..."}
        autoComplete="off"
      />
      {open && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 rounded-xl overflow-hidden max-h-64 overflow-y-auto"
          style={{ background: "#0A0726", border: "1px solid rgba(123,47,255,0.25)" }}>
          {results.length === 0 ? (
            <p className="px-3 py-2.5 text-xs text-content/35">Sin resultados</p>
          ) : (
            results.map(user => (
              <button
                key={user.username}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { onSelect(user); setQuery(""); setResults([]); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-violet/[0.12] transition-colors"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white"
                  style={{
                    background: user.image
                      ? `center/cover no-repeat url(${user.image})`
                      : "linear-gradient(135deg, #7B2FFF 0%, #FF2D9B 100%)",
                  }}>
                  {!user.image && (user.name?.[0]?.toUpperCase() ?? "U")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{user.name ?? "Sin nombre"}</div>
                  <div className="text-xs text-content/40 truncate">@{user.username}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
