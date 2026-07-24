"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { STAFF_ROLES } from "@/lib/profile-catalog";

interface UserResult {
  username: string;
  name: string | null;
  image: string | null;
  role: string;
}

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetch(`/api/usuarios/search?q=${encodeURIComponent(query.trim())}`)
        .then(r => r.ok ? r.json() : [])
        .then(d => { setResults(d); setSearched(true); setLoading(false); });
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div
      className="rounded-2xl p-6 sm:p-8 text-left h-full"
      style={{ background: "rgba(11,8,36,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
    >
      <div className="text-2xl mb-3" aria-hidden="true">🔍</div>
      <h2 className="font-bold mb-1" style={{ fontSize: "1.0625rem" }}>Buscar usuarios</h2>
      <p className="text-content/45 text-sm mb-4">Encontrá a alguien de la comunidad por su nombre o usuario.</p>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-content/35" aria-hidden="true">🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input-premium"
          style={{ paddingLeft: "2.5rem" }}
          placeholder="Buscá por nombre o @usuario..."
          autoComplete="off"
        />
      </div>

      {query.trim() && (
        <div className="mt-3 space-y-1.5">
          {loading ? (
            <p className="text-content/35 text-sm px-1 py-2">Buscando...</p>
          ) : results.length === 0 && searched ? (
            <p className="text-content/35 text-sm px-1 py-2">No encontramos a nadie con ese nombre.</p>
          ) : (
            results.map(user => {
              const role = STAFF_ROLES[user.role];
              const initials = user.name
                ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                : "?";
              return (
                <Link
                  key={user.username}
                  href={`/perfil/${user.username}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                    style={{
                      background: user.image
                        ? `center/cover no-repeat url(${user.image})`
                        : "linear-gradient(135deg, #7B2FFF 0%, #FF2D9B 100%)",
                    }}>
                    {!user.image && initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold truncate">{user.name ?? "Sin nombre"}</span>
                      {role && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0"
                          style={{ color: role.color, background: `${role.color}18` }}>
                          {role.label}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-content/40 truncate">@{user.username}</div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
