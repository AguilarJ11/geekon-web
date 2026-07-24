import Stars from "@/components/Stars";
import Reveal from "@/components/Reveal";
import FormCardsCarousel from "@/app/components/FormCardsCarousel";
import HeroMascots from "@/app/components/HeroMascots";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import StatsTicker from "@/components/StatsTicker";
import { FORM_CATEGORIES } from "@/lib/form-categories";

/* ── Feature icons ──────────────────────────────────────── */

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

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="6.5" r="2.75"/>
      <path d="M1.75 17c0-2.9 2.35-5.25 5.25-5.25S12.25 14.1 12.25 17"/>
      <circle cx="14.5" cy="7.25" r="2.15"/>
      <path d="M13.25 11.9c2.35.35 4.05 2.35 4.05 4.85"/>
    </svg>
  );
}

/* ── Data ──────────────────────────────────────────────── */

import type { ReactElement } from "react";
type Feature = { Icon: () => ReactElement; color: string; title: string; desc: string };


const FEATURES: Feature[] = [
  {
    Icon: IconUsers,
    color: "#7B2FFF",
    title: "Un espacio para todos",
    desc: "GeekOn! es un espacio de encuentro para los distintos fandoms: anime, gaming, cómics, cine y mucho más.",
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
    title: "Actividades para todos",
    desc: "Torneos, cosplay, charlas y talleres, zona de gaming, TCG, rol, coleccionismo y muchas actividades más. Siempre hay algo nuevo para descubrir.",
  },
];

const CATEGORY_CARD_COPY: Record<string, { tag: string; desc: string }> = {
  STAND:         { tag: "Comercial", desc: "Tienda o emprendimiento. Mostrá tus productos al público geek." },
  ARTE:          { tag: "Arte",      desc: "Tenés arte, fanart o ilustraciones propias. Postulate para tu mesa." },
  CHARLA_TALLER: { tag: "Charlas",   desc: "Dictá una charla o taller para la comunidad geek." },
  COSPLAY:       { tag: "Escenario", desc: "Inscribite y mostrá tu mejor cosplay en el escenario principal." },
  TORNEO:        { tag: "Torneo",    desc: "Competí en los torneos y competencias del evento." },
  OTRO:          { tag: "Otras",     desc: "Otro tipo de actividades para sumar a la experiencia GeekOn!." },
};

function hexToRgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

const FORM_CARDS = FORM_CATEGORIES.map(cat => ({
  icon: cat.icon,
  title: cat.label,
  tag: CATEGORY_CARD_COPY[cat.key]?.tag ?? cat.label,
  color: cat.color,
  glow: hexToRgba(cat.color, 0.3),
  desc: CATEGORY_CARD_COPY[cat.key]?.desc ?? "",
  href: `/formularios?categoria=${cat.key}`,
}));

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

        {/* Mascotas — Gon y Eek flanqueando el hero, con parallax sutil al scrollear */}
        <HeroMascots />

        {/* Contenido */}
        <div className="relative z-10 px-8 max-w-4xl mx-auto">

          <h1
            className="font-black leading-[1.05] text-content animate-fadeInUp delay-100"
            style={{ fontSize: "clamp(2.25rem, 7vw, 6rem)", letterSpacing: "-0.05em", marginBottom: "1.75rem" }}
          >
            Una experiencia<br />
            <span className="text-violet" style={{ textShadow: "0 0 80px rgba(123,47,255,0.5)" }}>
              de otra dimensión.
            </span>
          </h1>

          <p
            className="text-content/55 mx-auto animate-fadeInUp delay-200"
            style={{ fontSize: "1.125rem", lineHeight: 1.75, maxWidth: "460px", marginBottom: "2.75rem" }}
          >
            El evento geek más grande de Uruguay. Comunidad activa y experiencias únicas todo el año.
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
          3RA EDICIÓN — sección tipográfica, sin mascot
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
          03
        </div>

        <div className="relative max-w-6xl mx-auto px-8">
          <Reveal>
            <Eyebrow color="violet" className="mb-8">Tercera Edición</Eyebrow>
          </Reveal>

          <Reveal delay={80}>
            <h2
              className="font-black mb-6 max-w-xl"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.045em", lineHeight: 1.04 }}
            >
              <span className="text-violet">GeekOn!</span>{" "}
              <span className="text-content">2027</span>
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
              <Button href="/formularios" size="lg">Participar</Button>
              <Button href="/galeria" variant="secondary" size="lg">Ver edición anterior</Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FORMULARIOS — header tipográfico
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-32">

        <div className="relative mb-16">
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

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mascots/eek-curioso.webp"
            alt=""
            aria-hidden="true"
            className="hidden lg:block absolute pointer-events-none select-none"
            style={{ right: "0px", top: "-30px", width: "190px", filter: "drop-shadow(0 12px 32px rgba(0,229,255,0.25))" }}
          />
        </div>

        <Reveal delay={220}>
          <FormCardsCarousel cards={FORM_CARDS} />
        </Reveal>
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
              La comunidad geek más grande de Uruguay.
            </p>
          </div>

          {[
            { title: "Participar", links: [
              { label: "Stand Comercial",    href: "/formularios?categoria=STAND"         },
              { label: "Artist Alley",       href: "/formularios?categoria=ARTE"          },
              { label: "Cosplay",             href: "/formularios?categoria=COSPLAY"       },
              { label: "Charlas / Talleres", href: "/formularios?categoria=CHARLA_TALLER" },
            ]},
            { title: "Comunidad", links: [
              { label: "Foro",         href: "/comunidad" },
              { label: "Galería",      href: "/galeria"   },
              { label: "Edición 2026", href: "/galeria"   },
            ]},
            { title: "GeekOn!", links: [
              { label: "Sobre nosotros", href: "#"                              },
              { label: "Instagram",      href: "https://instagram.com/geekon_uy" },
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
          <span className="text-sm text-content/20">Comunidad geek de Uruguay</span>
        </div>
      </footer>
    </>
  );
}
