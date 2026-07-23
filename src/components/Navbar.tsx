"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/",            label: "Inicio"      },
  { href: "/formularios", label: "Formularios" },
  { href: "/comunidad",   label: "Comunidad"   },
  { href: "/galeria",     label: "Galería"     },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center justify-between px-8 md:px-12 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(5,3,26,0.97)" : "rgba(5,3,26,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(123,47,255,0.22)"
          : "1px solid rgba(123,47,255,0.12)",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.35)" : "none",
      }}
    >
      {/* Logo */}
      <Link href="/" className="text-2xl font-black tracking-tight shrink-0">
        <span style={{ color: "#7B2FFF" }}>GEEK</span>
        <span style={{ color: "#00E5FF" }}>ON</span>
        <span style={{ color: "#FF2D9B" }}>!</span>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-1 list-none">
        {NAV_LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`nav-link${isActive(item.href) ? " active" : ""}`}
            >
              {item.label}
              {isActive(item.href) && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 1,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "18px",
                    height: "2px",
                    borderRadius: "2px",
                    background: "linear-gradient(90deg,#7B2FFF,#00E5FF)",
                  }}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {session ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:border-[rgba(123,47,255,0.5)]"
              style={{ border: "1px solid rgba(123,47,255,0.28)", color: "var(--text)" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #7B2FFF, #FF2D9B)" }}
              >
                {session.user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:block max-w-[100px] truncate">
                {session.user?.name?.split(" ")[0]}
              </span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5, transition: "transform 0.2s", transform: menuOpen ? "rotate(180deg)" : "none" }}>
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl overflow-hidden shadow-2xl z-50 animate-scaleIn"
                  style={{ background: "#0A0726", border: "1px solid rgba(123,47,255,0.25)", transformOrigin: "top right" }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(123,47,255,0.15)" }}>
                    <p className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>{session.user?.name}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "var(--dim)" }}>{session.user?.email}</p>
                  </div>
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-[rgba(123,47,255,0.12)]"
                    onClick={() => setMenuOpen(false)}
                    style={{ color: "var(--text)" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                    Mi perfil
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-[rgba(255,45,155,0.08)]"
                    style={{ color: "#FF2D9B" }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M5 2H2.5A1.5 1.5 0 001 3.5v8A1.5 1.5 0 002.5 13H5M10 10.5l3-3-3-3M5.5 7.5h7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="hidden sm:block px-4 py-2 rounded-lg text-base font-semibold transition-all hover:border-[rgba(123,47,255,0.5)] hover:text-white"
              style={{ border: "1px solid rgba(123,47,255,0.25)", color: "rgba(234,230,255,0.6)" }}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-base font-bold transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(123,47,255,0.45)]"
              style={{ background: "linear-gradient(135deg, #7B2FFF, #A855F7)", color: "#fff" }}
            >
              Registrarse
            </Link>
          </>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] w-8 h-8 items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          <span className="w-5 h-px bg-current transition-all" style={{ transform: mobileOpen ? "rotate(45deg) translate(0,4px)" : "none" }} />
          <span className="w-5 h-px bg-current transition-all" style={{ opacity: mobileOpen ? 0 : 1 }} />
          <span className="w-5 h-px bg-current transition-all" style={{ transform: mobileOpen ? "rotate(-45deg) translate(0,-4px)" : "none" }} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="absolute left-0 right-0 top-[70px] md:hidden"
          style={{ background: "rgba(5,3,26,0.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(123,47,255,0.2)" }}
        >
          <ul className="px-6 py-4 space-y-1 list-none">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2.5 text-sm font-medium transition-colors"
                  style={{ color: isActive(item.href) ? "var(--text)" : "var(--dim)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
