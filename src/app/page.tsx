import Stars from "@/components/Stars";
import Reveal from "@/components/Reveal";
import FormCard from "@/app/components/FormCard";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import StatsTicker from "@/components/StatsTicker";

/* ── Feature icons ──────────────────────────────────────── */

function IconTicket() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 8a2 2 0 012-2h13a2 2 0 012 2 2.5 2.5 0 010 4 2 2 0 01-2 2h-13a2 2 0 01-2-2 2.5 2.5 0 010-4z"/>
      <line x1="13" y1="6.5" x2="13" y2="13.5" strokeDasharray="2 2"/>
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8.5"/>
      <path d="M10 1.5C7.5 5 6 7.5 6 10s1.5 5 4 8.5M10 1.5C12.5 5 14 7.5 14 10s-1.5 5-4 8.5"/>
      <path d="M1.5 10h17M2 7h16M2 13h16"/>
    </svg>
  );
}

function IconSpark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 1.5v3M10 15.5v3M3.75 3.75l2.12 2.12M14.13 14.13l2.12 2.12M1.5 10h3M15.5 10h3M3.75 16.25l2.12-2.12M14.13 5.87l2.12-2.12"/>
      <circle cx="10" cy="10" r="3.5"/>
    </svg>
  );
}

/* ── Data ──────────────────────────────────────────────── */

import type { ReactElement } from "react";
type Feature = { Icon: () => ReactElement; color: string; title: string; desc: string };


const FEATURES: Feature[] = [
  {
    Icon: IconTicket,
    color: "#7B2FFF",
    title: "Entrada siempre libre",
    desc: "GeekOn! es y será siempre de acceso libre. Creemos que la cultura geek no tiene precio de entrada.",
  },
  {
    Icon: IconGlobe,
    color: "#00E5FF",
    title: "Comunidad los 365 días",
    desc: "No somos un evento puntual. Somos una comunidad activa en Uruguay durante todo el año.",
  },
  {
    Icon: IconSpark,
    color: "#FF2D9B",
    title: "Arte, juego y cultura",
    desc: "Artist Alley, cosplay, videojuegos en vivo, paneles y más. Siempre hay algo nuevo para descubrir.",
  },
];

const FORM_CARDS = [
  { icon: "🎨", title: "Artist Alley",          tag: "Arte",      color: "#7B2FFF", glow: "rgba(123,47,255,0.35)", desc: "Tenés arte, fanart o ilustraciones propias. Postulate para tu mesa.",      href: "/formularios/artista"   },
  { icon: "🛍️", title: "Stand Comercial",        tag: "Comercial", color: "#00E5FF", glow: "rgba(0,229,255,0.3)",   desc: "Tienda o emprendimiento. Mostrá tus productos al público geek.",         href: "/formularios/stand"     },
  { icon: "👘", title: "Concurso de Cosplay",    tag: "Escenario", color: "#FF2D9B", glow: "rgba(255,45,155,0.3)",  desc: "Inscribite y mostrá tu mejor cosplay en el escenario principal.",        href: "/formularios/cosplay"   },
  { icon: "💡", title: "Propuesta de Actividad", tag: "Actividad", color: "#F59E0B", glow: "rgba(245,158,11,0.3)",  desc: "¿Tenés idea para un panel, taller o actividad? Mandanos tu propuesta.",  href: "/formularios/actividad" },
];

/* ── Page ──────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Stars />

      {/* ══════════════════════════════════════════════════
          HERO — centrado, tipografía protagonista
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-[70px]">

        {/* Un solo glow, centrado */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: "radial-gradient(ellipse 80% 55% at 50% 38%, rgba(123,47,255,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Grid overlay sutil */}
        <div className="absolute inset-0 pointer-events-none grid-overlay opacity-20" aria-hidden="true" />

        {/* Contenido */}
        <div className="relative z-10 px-8 max-w-4xl mx-auto">

          <Eyebrow color="violet" className="mb-8 animate-fadeIn">
            Comunidad Geek · Uruguay · 2026
          </Eyebrow>

          <h1
            className="font-black leading-[1.05] text-content animate-fadeInUp delay-100"
            style={{ fontSize: "clamp(2.25rem, 9vw, 7.5rem)", letterSpacing: "-0.05em", marginBottom: "1.75rem" }}
          >
            La aventura geek{" "}
            <span className="text-violet" style={{ textShadow: "0 0 80px rgba(123,47,255,0.5)" }}>
              comienza acá.
            </span>
          </h1>

          <p
            className="text-content/55 mx-auto animate-fadeInUp delay-200"
            style={{ fontSize: "1.125rem", lineHeight: 1.75, maxWidth: "460px", marginBottom: "2.75rem" }}
          >
            El evento geek más grande de Uruguay. Entrada libre, comunidad activa y experiencias únicas todo el año.
          </p>

          <div className="flex gap-3 justify-center flex-wrap animate-fadeInUp delay-300">
            <Button href="/register" size="lg">
              Únite ahora
            </Button>
            <Button href="/galeria" variant="secondary" size="lg">
              Ver Edición 2026
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-35"
          aria-hidden="true"
        >
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(234,230,255,0.5)" }}>
            scroll
          </span>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none" style={{ animation: "bounceDown 1.8s ease-in-out infinite" }}>
            <rect x="1" y="1" width="14" height="20" rx="7" stroke="rgba(234,230,255,0.3)" strokeWidth="1.2"/>
            <rect x="6.5" y="4" width="3" height="5" rx="1.5" fill="rgba(234,230,255,0.4)"/>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS — cinta animada
      ══════════════════════════════════════════════════ */}
      <StatsTicker />

      {/* ══════════════════════════════════════════════════
          FEATURES — iconos SVG, tarjetas limpias
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-32">

        <div className="text-center max-w-xl mx-auto mb-20">
          <Reveal className="mb-4">
            <Eyebrow color="violet">Lo que nos define</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="font-black mb-5 text-content"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", lineHeight: 1.08 }}
            >
              Más que un evento.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-content/45" style={{ fontSize: "1.0625rem", lineHeight: 1.75 }}>
              Una comunidad construida por y para los geeks de Uruguay.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div
                className="rounded-2xl p-8 h-full"
                style={{
                  background: "rgba(11,8,36,0.65)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="mb-6 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: f.color + "15", color: f.color }}
                >
                  <f.Icon />
                </div>
                <h3 className="font-bold mb-3" style={{ fontSize: "1.0625rem", letterSpacing: "-0.02em" }}>
                  {f.title}
                </h3>
                <p className="text-content/55 text-sm" style={{ lineHeight: 1.75 }}>
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          2DA EDICIÓN — sección tipográfica, sin mascot
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden py-32 bg-surface/25">

        {/* Glow sutil a la derecha */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 85% 50%, rgba(123,47,255,0.11) 0%, transparent 65%)",
          }}
        />

        {/* "02" background */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none"
          aria-hidden="true"
          style={{
            fontSize: "clamp(160px, 36vw, 320px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.06em",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(123,47,255,0.09)",
          }}
        >
          02
        </div>

        <div className="relative max-w-6xl mx-auto px-8">
          <Reveal>
            <Eyebrow color="violet" className="mb-8">Segunda Edición</Eyebrow>
          </Reveal>

          <Reveal delay={80}>
            <h2
              className="font-black mb-6 max-w-xl"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.045em", lineHeight: 1.04 }}
            >
              <span className="text-violet">GeekOn!</span>{" "}
              <span className="text-content">2026</span>
              <br />
              <span className="text-content">ya está aquí.</span>
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="text-content/45 mb-10 max-w-md" style={{ fontSize: "1.0625rem", lineHeight: 1.75 }}>
              Más artistas, más stands, más cosplay y más experiencias para vivir junto a la comunidad.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="flex gap-3 flex-wrap">
              <Button href="/formularios/artista" size="lg">Participar</Button>
              <Button href="/galeria" variant="secondary" size="lg">Ver edición anterior</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FORMULARIOS — header tipográfico
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-32">

        <div className="mb-16">
          <Reveal className="mb-4">
            <Eyebrow color="cyan">Participá</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="font-black mb-4 text-content"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", lineHeight: 1.08 }}
            >
              Formularios de<br />participación
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-content/45 max-w-sm" style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              Elegí tu categoría y completá el formulario para la próxima edición.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FORM_CARDS.map((card, i) => (
            <Reveal key={card.href} delay={i * 60}>
              <FormCard {...card} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          COMUNIDAD — minimal
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-32 border-t border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Foro General",       desc: "Hablá de anime, videojuegos, cosplay y todo lo geek con la comunidad.",  href: "/comunidad", btn: "Entrar al foro", color: "#7B2FFF" },
            { title: "Galería del Evento", desc: "Fotos, momentos y recuerdos de cada edición de GeekOn! por año.",        href: "/galeria",   btn: "Ver galería",    color: "#00E5FF" },
          ].map((c, i) => (
            <Reveal key={c.href} delay={i * 100}>
              <div
                className="rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(11,8,36,0.6)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <h3 className="font-bold mb-3" style={{ fontSize: "1.0625rem", letterSpacing: "-0.02em" }}>
                  {c.title}
                </h3>
                <p className="text-sm text-content/55 mb-6" style={{ lineHeight: 1.75 }}>
                  {c.desc}
                </p>
                <a
                  href={c.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all hover:gap-2.5"
                  style={{ color: c.color }}
                >
                  {c.btn}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path d="M2.5 6.5h8M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer style={{ background: "rgba(3,1,16,0.98)", borderTop: "1px solid rgba(123,47,255,0.08)" }}>
        <div className="max-w-6xl mx-auto px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/geekon-logo.webp" alt="GeekOn!" className="h-9 w-auto mb-3" />
            <p className="text-sm leading-relaxed text-content/30">
              La comunidad geek más grande de Uruguay. Entrada siempre libre.
            </p>
          </div>

          {[
            { title: "Participar", links: [
              { label: "Artist Alley",    href: "/formularios/artista"   },
              { label: "Stand Comercial", href: "/formularios/stand"     },
              { label: "Cosplay",         href: "/formularios/cosplay"   },
              { label: "Actividades",     href: "/formularios/actividad" },
            ]},
            { title: "Comunidad", links: [
              { label: "Foro",         href: "/comunidad" },
              { label: "Galería",      href: "/galeria"   },
              { label: "Edición 2026", href: "/galeria"   },
            ]},
            { title: "GeekOn!", links: [
              { label: "Sobre nosotros", href: "#"                              },
              { label: "Instagram",      href: "https://instagram.com/geekonuy" },
              { label: "Contacto",       href: "#"                              },
            ]},
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-content/25">
                {col.title}
              </h4>
              <ul className="space-y-2.5 list-none">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-content/55 transition-colors hover:text-content"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="max-w-6xl mx-auto px-8 pb-8 flex justify-between items-center flex-wrap gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "1.5rem" }}
        >
          <span className="text-sm text-content/25">© 2026 GeekOn! — Uruguay</span>
          <span className="text-sm text-content/20">Entrada libre siempre</span>
        </div>
      </footer>
    </>
  );
}
