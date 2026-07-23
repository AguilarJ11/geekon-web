import Stars from "@/components/Stars";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import FormCard from "@/app/components/FormCard";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";

/* ── Data ──────────────────────────────────────────────── */

const STATS = [
  { raw: 4000, suffix: "+", label: "Seguidores"         },
  { raw: 35,   suffix: "+", label: "Artistas"           },
  { raw: 15,   suffix: "+", label: "Stands Comerciales" },
  { raw: 2,    suffix: "",  label: "Ediciones"          },
  { raw: 100,  suffix: "%", label: "Entrada libre"      },
];

const PILLARS = [
  {
    icon: "🎫",
    color: "#7B2FFF",
    glow: "rgba(123,47,255,0.25)",
    title: "Entrada siempre libre",
    desc: "GeekOn! es y será siempre de acceso libre. Creemos que la cultura geek no tiene precio de entrada.",
  },
  {
    icon: "🌐",
    color: "#00E5FF",
    glow: "rgba(0,229,255,0.2)",
    title: "Comunidad los 365 días",
    desc: "No somos un evento puntual. Somos una comunidad activa en Uruguay durante todo el año, en línea y fuera de línea.",
  },
  {
    icon: "🎨",
    color: "#FF2D9B",
    glow: "rgba(255,45,155,0.22)",
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

const COMMUNITY_CARDS = [
  { icon: "💬", title: "Foro General",       desc: "Hablá de anime, videojuegos, cosplay y todo lo geek con la comunidad.", href: "/comunidad", btn: "Entrar al foro",  color: "#7B2FFF" },
  { icon: "📸", title: "Galería del Evento", desc: "Fotos, momentos y recuerdos de cada edición de GeekOn! por año.",        href: "/galeria",   btn: "Ver galería",     color: "#00E5FF" },
];

/* ── Page ──────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <>
      <Stars />

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[70px]">

        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse at 14% 56%, rgba(123,47,255,0.24) 0%, transparent 52%),
            radial-gradient(ellipse at 78% 28%, rgba(0,229,255,0.11)  0%, transparent 48%),
            radial-gradient(ellipse at 62% 84%, rgba(255,45,155,0.13) 0%, transparent 44%)
          `,
        }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none grid-overlay opacity-30" />

        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 max-w-[700px]">

          {/* Eyebrow */}
          <Eyebrow color="cyan" className="mb-8 animate-fadeIn">
            Comunidad Geek · Uruguay
          </Eyebrow>

          {/* Headline — 2 colores máximo */}
          <h1
            className="font-black leading-[1.02] mb-7 animate-fadeInUp delay-100"
            style={{ fontSize: "clamp(3rem, 9.5vw, 6.75rem)", letterSpacing: "-0.045em" }}
          >
            <span className="text-violet" style={{ textShadow: "0 0 60px rgba(123,47,255,0.45)" }}>
              La aventura
            </span>
            <br />
            <span className="text-content">geek comienza acá.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-content/45 animate-fadeInUp delay-200"
            style={{ lineHeight: 1.75, maxWidth: 500, fontSize: "1.0625rem", marginBottom: "2.75rem" }}
          >
            Gon! y Eek! te dan la bienvenida. Participá del evento, conectate con la comunidad y viví la experiencia geek todo el año.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap animate-fadeInUp delay-300">
            <Button href="/register" size="lg">
              Únite ahora
            </Button>
            <Button
              href="/galeria"
              variant="secondary"
              size="lg"
              className="border-cyan/25 text-cyan hover:border-cyan/45 hover:bg-cyan/5"
            >
              Ver Edición 2026
            </Button>
          </div>
        </div>

        {/* Mascots */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascots/gon.png"
          alt="Gon!"
          className="absolute bottom-0 right-0 select-none pointer-events-none"
          style={{ height: "80vh", maxHeight: 680, filter: "drop-shadow(-24px 0 64px rgba(123,47,255,0.3))", animation: "floatGon 4s ease-in-out infinite" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascots/eek.png"
          alt="Eek!"
          className="absolute select-none pointer-events-none"
          style={{ height: "20vh", maxHeight: 168, right: "33%", bottom: "54vh", filter: "drop-shadow(0 0 22px rgba(0,229,255,0.4))", animation: "floatEek 3.5s ease-in-out infinite", animationDelay: "0.6s" }}
        />

        {/* City silhouette */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full pointer-events-none"
          style={{ height: 170, opacity: 0.4, zIndex: 2 }}
          viewBox="0 0 1440 170" preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="#7B2FFF" d="M0,170 L0,130 L40,130 L40,95 L60,95 L60,70 L80,70 L80,52 L100,52 L100,70 L120,70 L120,42 L135,42 L135,22 L150,22 L150,42 L165,42 L165,70 L190,70 L190,90 L210,90 L210,65 L230,65 L230,47 L250,47 L250,65 L270,65 L270,88 L300,88 L300,52 L315,52 L315,32 L325,32 L325,16 L335,16 L335,32 L350,32 L350,52 L375,52 L375,75 L400,75 L400,52 L420,52 L420,35 L435,35 L435,52 L455,52 L455,75 L480,75 L480,52 L500,52 L500,32 L515,32 L515,18 L525,18 L525,32 L540,32 L540,52 L565,52 L565,72 L590,72 L590,50 L610,50 L610,32 L625,32 L625,50 L645,50 L645,72 L670,72 L670,90 L695,90 L695,65 L715,65 L715,45 L730,45 L730,28 L742,28 L742,45 L758,45 L758,65 L782,65 L782,85 L808,85 L808,60 L828,60 L828,40 L845,40 L845,60 L868,60 L868,82 L895,82 L895,58 L915,58 L915,38 L930,38 L930,58 L955,58 L955,80 L980,80 L980,52 L1000,52 L1000,35 L1015,35 L1015,20 L1025,20 L1025,35 L1040,35 L1040,52 L1065,52 L1065,75 L1090,75 L1090,52 L1110,52 L1110,32 L1125,32 L1125,52 L1150,52 L1150,75 L1175,75 L1175,52 L1195,52 L1195,32 L1210,32 L1210,16 L1222,16 L1222,32 L1238,32 L1238,52 L1262,52 L1262,75 L1288,75 L1288,95 L1315,95 L1315,115 L1340,115 L1340,135 L1380,135 L1380,155 L1440,155 L1440,170 Z"/>
        </svg>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          aria-hidden="true"
          style={{ opacity: 0.45 }}
        >
          <span className="text-content/45" style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>scroll</span>
          <svg width="16" height="22" viewBox="0 0 16 22" fill="none" style={{ animation: "bounceDown 1.8s ease-in-out infinite" }}>
            <rect x="1" y="1" width="14" height="20" rx="7" stroke="rgba(234,230,255,0.35)" strokeWidth="1.2"/>
            <rect x="6.5" y="4" width="3" height="5" rx="1.5" fill="rgba(234,230,255,0.5)"/>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════ */}
      <div
        className="relative z-10"
        style={{ background: "rgba(7,4,26,0.94)", borderTop: "1px solid rgba(123,47,255,0.12)", borderBottom: "1px solid rgba(123,47,255,0.12)" }}
      >
        <div className="max-w-5xl mx-auto px-8 py-12 flex justify-around flex-wrap gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                className="text-4xl font-black"
                style={{ background: "linear-gradient(135deg,#00E5FF,#7B2FFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                <AnimatedCounter value={s.raw} suffix={s.suffix} />
              </div>
              <div className="text-xs uppercase tracking-widest mt-2 font-medium text-content/35">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          PILLARS — "Más que un evento"
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-28">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal className="mb-4">
            <Eyebrow color="violet">Lo que nos define</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2
              className="font-black mb-5 text-content"
              style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", letterSpacing: "-0.04em", lineHeight: 1.08 }}
            >
              Más que un evento.
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-content/45" style={{ fontSize: "1rem", lineHeight: 1.75 }}>
              GeekOn! es una comunidad construida por y para los geeks de Uruguay. Libre, activa y apasionada todo el año.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 100}>
              <div
                className="rounded-2xl p-8 h-full"
                style={{
                  background: "rgba(11,8,36,0.7)",
                  border: `1px solid ${p.color}20`,
                  backdropFilter: "blur(12px)",
                  boxShadow: `inset 0 1px 0 ${p.color}12`,
                }}
              >
                <div
                  className="text-3xl mb-6 w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: p.color + "16", boxShadow: `0 0 24px ${p.glow}` }}
                >
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ letterSpacing: "-0.02em" }}>{p.title}</h3>
                <p className="text-content/45 text-sm" style={{ lineHeight: 1.7 }}>{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="section-sep relative z-10" />

      {/* ══════════════════════════════════════════════════
          2DA EDICIÓN
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 overflow-hidden py-28">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 70% 50%, rgba(123,47,255,0.14) 0%, transparent 60%)",
        }} />

        {/* Giant "02" background number */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            right: "-1rem",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "clamp(180px, 38vw, 340px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.06em",
            color: "transparent",
            WebkitTextStroke: "2px rgba(123,47,255,0.12)",
          }}
          aria-hidden="true"
        >
          02
        </div>

        <div className="relative max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">

            {/* Texto */}
            <div>
              <Reveal>
                <Eyebrow color="violet" className="mb-8">Segunda Edición</Eyebrow>
              </Reveal>

              <Reveal delay={80}>
                <h2
                  className="font-black mb-5"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", letterSpacing: "-0.045em", lineHeight: 1.04 }}
                >
                  <span className="text-violet">GeekOn!</span>{" "}
                  <span className="text-content">2026</span>
                </h2>
              </Reveal>

              <Reveal delay={160}>
                <p className="text-content/45 mb-10" style={{ fontSize: "1.0625rem", lineHeight: 1.75, maxWidth: 480 }}>
                  El evento geek más esperado de Uruguay regresa con más artistas, más stands, más cosplay y más experiencias para vivir junto a la comunidad.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex gap-3 flex-wrap">
                  <Button href="/formularios/artista" size="lg">
                    Participar
                  </Button>
                  <Button href="/galeria" variant="secondary" size="lg">
                    Ver edición anterior
                  </Button>
                </div>
              </Reveal>
            </div>

            {/* Mascot */}
            <Reveal direction="right" className="hidden md:flex justify-end items-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mascots/gon.png"
                alt="Gon!"
                className="select-none pointer-events-none"
                style={{
                  height: "min(380px, 38vh)",
                  filter: "drop-shadow(-12px 0 48px rgba(123,47,255,0.4))",
                  animation: "floatGon 4s ease-in-out infinite",
                }}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <div className="section-sep relative z-10" />

      {/* ══════════════════════════════════════════════════
          FORMULARIOS
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-24">

        <Reveal className="text-center mb-14">
          <div className="flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mascots/eek.png"
              alt=""
              aria-hidden="true"
              className="h-20 mb-4 select-none"
              style={{ filter: "drop-shadow(0 0 16px rgba(0,229,255,0.35))" }}
            />
            <Eyebrow color="cyan" className="mb-4">Eek! te guía</Eyebrow>
            <h2 className="text-3xl font-black mb-2" style={{ letterSpacing: "-0.03em" }}>
              Formularios de Participación
            </h2>
            <p className="text-content/45 text-sm">Elegí tu categoría para la próxima edición.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FORM_CARDS.map((card, i) => (
            <Reveal key={card.href} delay={i * 60}>
              <FormCard {...card} />
            </Reveal>
          ))}
        </div>
      </section>

      <div className="section-sep relative z-10" />

      {/* ══════════════════════════════════════════════════
          COMUNIDAD
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-24">

        <Reveal className="text-center mb-14">
          <div className="flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mascots/gon.png"
              alt=""
              aria-hidden="true"
              className="h-20 mb-4 select-none"
              style={{ filter: "drop-shadow(0 0 16px rgba(255,45,155,0.35))", transform: "scaleX(-1)" }}
            />
            <Eyebrow color="pink" className="mb-4">Gon! te invita</Eyebrow>
            <h2 className="text-3xl font-black mb-2" style={{ letterSpacing: "-0.03em" }}>Comunidad GeekOn!</h2>
            <p className="text-content/45 text-sm">Un lugar para quedarse. Activo todo el año.</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMUNITY_CARDS.map((c, i) => (
            <Reveal key={c.href} delay={i * 100}>
              <div
                className="rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 h-full"
                style={{ background: "rgba(11,8,36,0.7)", border: "1px solid rgba(123,47,255,0.14)", backdropFilter: "blur(8px)" }}
              >
                <div className="flex items-center gap-3.5 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: c.color + "16", border: `1px solid ${c.color}22` }}
                    aria-hidden="true"
                  >
                    {c.icon}
                  </div>
                  <h3 className="text-lg font-bold">{c.title}</h3>
                </div>
                <p className="text-sm text-content/45 mb-6" style={{ lineHeight: 1.75 }}>{c.desc}</p>
                <a
                  href={c.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
                  style={{ border: `1px solid ${c.color}28`, color: c.color, background: c.color + "08" }}
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
      <footer className="relative z-10 mt-8" style={{ background: "rgba(3,1,16,0.98)", borderTop: "1px solid rgba(123,47,255,0.1)" }}>
        <div className="max-w-6xl mx-auto px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-black mb-3 tracking-tight">
              <span className="text-violet">GEEK</span>
              <span className="text-cyan">ON</span>
              <span className="text-pink">!</span>
            </div>
            <p className="text-sm leading-relaxed text-content/30">
              La comunidad geek más grande de Uruguay. Entrada siempre libre.
            </p>
          </div>

          {[
            { title: "Participar",  links: ["Artist Alley", "Stand Comercial", "Cosplay", "Actividades"] },
            { title: "Comunidad",   links: ["Foro", "Galería", "Edición 2026"] },
            { title: "GeekOn!",     links: ["Sobre nosotros", "Instagram", "Contacto"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-content/25">
                {col.title}
              </h4>
              <ul className="space-y-2.5 list-none">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-content/38 transition-colors hover:text-cyan">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="max-w-6xl mx-auto px-8 pb-8 flex justify-between items-center flex-wrap gap-4"
          style={{ borderTop: "1px solid rgba(123,47,255,0.08)", paddingTop: "1.5rem" }}
        >
          <span className="text-sm text-content/26">© 2026 GeekOn! — Uruguay</span>
          <div className="flex items-end gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascots/eek.png" alt="Eek!" style={{ height: 42, filter: "drop-shadow(0 0 6px rgba(0,229,255,0.25))" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascots/gon.png" alt="Gon!" style={{ height: 42, filter: "drop-shadow(0 0 6px rgba(123,47,255,0.25))" }} />
          </div>
        </div>
      </footer>
    </>
  );
}
