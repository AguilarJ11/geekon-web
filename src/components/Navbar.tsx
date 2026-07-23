"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-between px-8 md:px-12"
      style={{
        background: "rgba(5,3,26,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(123,47,255,0.25)",
      }}
    >
      <Link href="/" className="text-xl font-black tracking-tight">
        <span style={{ color: "#7B2FFF" }}>GEEK</span>
        <span style={{ color: "#00E5FF" }}>ON</span>
        <span style={{ color: "#FF2D9B" }}>!</span>
      </Link>

      <ul className="hidden md:flex items-center gap-1 list-none">
        {[
          { href: "/",            label: "Inicio" },
          { href: "/formularios", label: "Formularios" },
          { href: "/comunidad",   label: "Comunidad" },
          { href: "/galeria",     label: "Galería" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: "rgba(234,230,255,0.55)" }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {session ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ border: "1px solid rgba(123,47,255,0.3)", color: "var(--text)" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "linear-gradient(135deg, #7B2FFF, #A855F7)" }}
              >
                {session.user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:block">{session.user?.name?.split(" ")[0]}</span>
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-12 w-48 rounded-xl overflow-hidden shadow-xl z-50"
                style={{ background: "#0A0726", border: "1px solid rgba(123,47,255,0.3)" }}
              >
                <Link
                  href="/perfil"
                  className="block px-4 py-3 text-sm hover:bg-[rgba(123,47,255,0.15)] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi perfil
                </Link>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[rgba(255,45,155,0.1)] transition-colors"
                  style={{ color: "#FF2D9B" }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ border: "1px solid rgba(123,47,255,0.3)", color: "rgba(234,230,255,0.6)" }}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #7B2FFF, #A855F7)", color: "#fff" }}
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
