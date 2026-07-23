"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/",            label: "Inicio"      },
  { href: "/formularios", label: "Formularios" },
  { href: "/comunidad",   label: "Comunidad"   },
  { href: "/galeria",     label: "Galería"     },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
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
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[70px]",
        "flex items-center justify-between px-8 md:px-12",
        "backdrop-blur-xl transition-all duration-300",
        scrolled
          ? "bg-navy/[0.97] border-b border-violet/[0.22] shadow-[0_4px_32px_rgba(0,0,0,0.35)]"
          : "bg-navy/[0.82] border-b border-violet/10",
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-2xl font-black tracking-tight shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/50 rounded"
      >
        <span className="text-violet">GEEK</span>
        <span className="text-cyan">ON</span>
        <span className="text-pink">!</span>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-1 list-none">
        {NAV_LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn("nav-link", isActive(item.href) && "active")}
            >
              {item.label}
              {isActive(item.href) && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-[18px] h-0.5 rounded-full bg-gradient-to-r from-violet to-cyan"
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
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-label={`Menú de ${session.user?.name ?? "usuario"}`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-sm font-medium text-content",
                "border border-violet/[0.28] transition-all",
                "hover:border-violet/50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/50",
              )}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-gradient-to-br from-violet to-pink text-white">
                {session.user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden sm:block max-w-[100px] truncate">
                {session.user?.name?.split(" ")[0]}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none"
                aria-hidden="true"
                className="opacity-50 transition-transform duration-200"
                style={{ transform: menuOpen ? "rotate(180deg)" : "none" }}
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                <div
                  className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-2xl overflow-hidden shadow-2xl z-50 animate-scaleIn origin-top-right bg-surface border border-violet/25"
                >
                  <div className="px-4 py-3 border-b border-violet/[0.15]">
                    <p className="text-xs font-semibold text-content truncate">{session.user?.name}</p>
                    <p className="text-xs text-content/45 truncate mt-0.5">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/perfil"
                    className="flex items-center gap-2.5 px-4 py-3 text-sm text-content transition-colors hover:bg-violet/[0.12] focus-visible:outline-none focus-visible:bg-violet/[0.12]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M2.5 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    Mi perfil
                  </Link>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-pink transition-colors hover:bg-pink/[0.08] focus-visible:outline-none focus-visible:bg-pink/[0.08]"
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <path d="M5 2H2.5A1.5 1.5 0 001 3.5v8A1.5 1.5 0 002.5 13H5M10 10.5l3-3-3-3M5.5 7.5h7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Button href="/login" variant="secondary" className="hidden sm:inline-flex">
              Iniciar sesión
            </Button>
            <Button href="/register">
              Registrarse
            </Button>
          </>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] w-8 h-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/50 rounded"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileOpen}
        >
          <span className={cn("w-5 h-px bg-current transition-all duration-200", mobileOpen && "rotate-45 translate-y-[6px]")} />
          <span className={cn("w-5 h-px bg-current transition-all duration-200", mobileOpen ? "opacity-0" : "opacity-100")} />
          <span className={cn("w-5 h-px bg-current transition-all duration-200", mobileOpen && "-rotate-45 -translate-y-[6px]")} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-[70px] md:hidden bg-navy/[0.98] backdrop-blur-xl border-b border-violet/20">
          <ul className="px-6 py-4 space-y-1 list-none">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href) ? "text-content" : "text-content/45",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {!session && (
              <li className="pt-2 flex gap-2">
                <Button href="/login" variant="secondary" size="sm" className="flex-1 justify-center">
                  Iniciar sesión
                </Button>
                <Button href="/register" size="sm" className="flex-1 justify-center">
                  Registrarse
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
