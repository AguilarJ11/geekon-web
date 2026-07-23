import Link from "next/link";
import Stars from "@/components/Stars";

export default function HomePage() {
  return (
    <>
      <Stars />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-[70px]">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse at 15% 55%, rgba(123,47,255,0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 30%, rgba(0,229,255,0.1) 0%, transparent 45%),
            radial-gradient(ellipse at 60% 85%, rgba(255,45,155,0.1) 0%, transparent 40%)
          `
        }} />

        <div className="relative z-10 px-8 md:px-16 max-w-[600px]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.25)", color: "#00E5FF" }}>
            🚀 Comunidad Geek — Uruguay
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6">
            <span style={{ color: "#7B2FFF", textShadow: "0 0 30px rgba(123,47,255,0.5)" }}>La</span>{" "}
            <span style={{ color: "#00E5FF", textShadow: "0 0 30px rgba(0,229,255,0.4)" }}>aventura</span>
            <br />
            <span style={{ color: "var(--text)" }}>geek comienza</span>
            <br />
            <span style={{ color: "#FF2D9B", textShadow: "0 0 30px rgba(255,45,155,0.4)" }}>acá</span>
          </h1>

          <p className="text-lg mb-10" style={{ color: "var(--dim)", lineHeight: 1.7, maxWidth: 460 }}>
            Gon! y Eek! te dan la bienvenida. Participá del evento, conectate con la comunidad y viví la experiencia todo el año.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link href="/register"
              className="px-8 py-4 rounded-xl font-bold text-white text-base transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #7B2FFF, #A855F7)", boxShadow: "0 4px 20px rgba(123,47,255,0.4)" }}>
              Únite ahora
            </Link>
            <Link href="/galeria"
              className="px-8 py-4 rounded-xl font-bold text-base transition-all"
              style={{ border: "1px solid rgba(0,229,255,0.35)", color: "#00E5FF" }}>
              Ver Edición 2026
            </Link>
          </div>
        </div>

        {/* Mascotas */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mascots/gon.png" alt="Gon!"
          className="absolute bottom-0 right-0 select-none pointer-events-none"
          style={{ height: "80vh", maxHeight: 660, filter: "drop-shadow(-20px 0 50px rgba(123,47,255,0.3))", animation: "floatGon 4s ease-in-out infinite" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mascots/eek.png" alt="Eek!"
          className="absolute select-none pointer-events-none"
          style={{ height: "20vh", maxHeight: 165, right: "33%", bottom: "54vh", filter: "drop-shadow(0 0 18px rgba(0,229,255,0.35))", animation: "floatEek 3.5s ease-in-out infinite", animationDelay: "0.6s" }} />

        {/* Silueta ciudad */}
        <svg className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-[2]"
          style={{ height: 170, opacity: 0.48 }}
          viewBox="0 0 1440 170" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#7B2FFF" d="M0,170 L0,130 L40,130 L40,95 L60,95 L60,70 L80,70 L80,52 L100,52 L100,70 L120,70 L120,42 L135,42 L135,22 L150,22 L150,42 L165,42 L165,70 L190,70 L190,90 L210,90 L210,65 L230,65 L230,47 L250,47 L250,65 L270,65 L270,88 L300,88 L300,52 L315,52 L315,32 L325,32 L325,16 L335,16 L335,32 L350,32 L350,52 L375,52 L375,75 L400,75 L400,52 L420,52 L420,35 L435,35 L435,52 L455,52 L455,75 L480,75 L480,52 L500,52 L500,32 L515,32 L515,18 L525,18 L525,32 L540,32 L540,52 L565,52 L565,72 L590,72 L590,50 L610,50 L610,32 L625,32 L625,50 L645,50 L645,72 L670,72 L670,90 L695,90 L695,65 L715,65 L715,45 L730,45 L730,28 L742,28 L742,45 L758,45 L758,65 L782,65 L782,85 L808,85 L808,60 L828,60 L828,40 L845,40 L845,60 L868,60 L868,82 L895,82 L895,58 L915,58 L915,38 L930,38 L930,58 L955,58 L955,80 L980,80 L980,52 L1000,52 L1000,35 L1015,35 L1015,20 L1025,20 L1025,35 L1040,35 L1040,52 L1065,52 L1065,75 L1090,75 L1090,52 L1110,52 L1110,32 L1125,32 L1125,52 L1150,52 L1150,75 L1175,75 L1175,52 L1195,52 L1195,32 L1210,32 L1210,16 L1222,16 L1222,32 L1238,32 L1238,52 L1262,52 L1262,75 L1288,75 L1288,95 L1315,95 L1315,115 L1340,115 L1340,135 L1380,135 L1380,155 L1440,155 L1440,170 Z"/>
        </svg>

        <style>{`
          @keyframes floatGon { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-18px) rotate(1deg)} }
          @keyframes floatEek { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-12px) rotate(-2deg)} }
        `}</style>
      </section>

      {/* STATS */}
      <div className="relative z-10 py-8 px-8"
        style={{ background: "rgba(10,7,38,0.9)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-5xl mx-auto flex justify-around flex-wrap gap-6 text-center">
          {[
            { num: "4.000+", label: "Seguidores" },
            { num: "35+",    label: "Artistas" },
            { num: "15+",    label: "Stands Comerciales" },
            { num: "2",      label: "Ediciones" },
            { num: "100%",   label: "Entrada libre" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black" style={{ background: "linear-gradient(135deg,#00E5FF,#7B2FFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.num}</div>
              <div className="text-xs uppercase tracking-wider mt-1" style={{ color: "var(--dim)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FORMULARIOS */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-20">
        <div className="flex items-center gap-5 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mascots/eek.png" alt="Eek!" className="h-20 select-none"
            style={{ filter: "drop-shadow(0 0 12px rgba(0,229,255,0.3))" }} />
          <div>
            <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "#00E5FF" }}>Eek! te guía</p>
            <h2 className="text-3xl font-black mb-1">Formularios de Participación</h2>
            <p style={{ color: "var(--dim)" }}>Elegí tu categoría para la próxima edición.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "🎨", title: "Artist Alley",           desc: "Tenés arte, fanart o ilustraciones propias. Postulate para tu mesa.", href: "/formularios/artista" },
            { icon: "🛍️", title: "Stand Comercial",        desc: "Tienda o emprendimiento. Mostrá tus productos al público geek.",      href: "/formularios/stand" },
            { icon: "👘", title: "Concurso de Cosplay",    desc: "Inscribite y mostrá tu mejor cosplay en el escenario principal.",      href: "/formularios/cosplay" },
            { icon: "💡", title: "Propuesta de Actividad", desc: "¿Tenés idea para un panel, taller o actividad? Mandanos tu propuesta.", href: "/formularios/actividad" },
          ].map((card) => (
            <Link key={card.href} href={card.href}
              className="group block rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
              style={{ background: "rgba(17,14,53,0.8)", border: "1px solid var(--border)", backdropFilter: "blur(6px)" }}>
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-base font-bold mb-2">{card.title}</h3>
              <p className="text-sm mb-5" style={{ color: "var(--dim)", lineHeight: 1.6 }}>{card.desc}</p>
              <span className="text-sm font-semibold" style={{ color: "#7B2FFF" }}>Completar formulario →</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-12 relative z-10" style={{ height: 1, background: "linear-gradient(90deg,transparent,var(--border),transparent)" }} />

      {/* COMUNIDAD */}
      <section className="relative z-10 max-w-6xl mx-auto px-8 py-20">
        <div className="flex items-center gap-5 mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mascots/gon.png" alt="Gon!" className="h-20 select-none"
            style={{ filter: "drop-shadow(0 0 12px rgba(255,45,155,0.3))", transform: "scaleX(-1)" }} />
          <div>
            <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: "#FF2D9B" }}>Gon! te invita</p>
            <h2 className="text-3xl font-black mb-1">Comunidad GeekOn!</h2>
            <p style={{ color: "var(--dim)" }}>Un lugar para quedarse. Activo todo el año.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: "💬", title: "Foro General",       desc: "Hablá de anime, videojuegos, cosplay y todo lo geek con la comunidad.", href: "/comunidad", btn: "Entrar al foro" },
            { icon: "📸", title: "Galería del Evento", desc: "Fotos, momentos y recuerdos de cada edición de GeekOn! por año.",        href: "/galeria",   btn: "Ver galería" },
          ].map((c) => (
            <div key={c.href} className="rounded-2xl p-8 hover:-translate-y-1 transition-all"
              style={{ background: "rgba(17,14,53,0.8)", border: "1px solid var(--border)", backdropFilter: "blur(6px)" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "linear-gradient(135deg,rgba(123,47,255,0.3),rgba(0,229,255,0.2))" }}>
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold">{c.title}</h3>
              </div>
              <p className="text-sm mb-6" style={{ color: "var(--dim)", lineHeight: 1.6 }}>{c.desc}</p>
              <Link href={c.href}
                className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:border-[#00E5FF]"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
                {c.btn}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mt-10" style={{ background: "rgba(5,3,26,0.95)", borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="text-lg font-black mb-3">
              <span style={{ color: "#7B2FFF" }}>GEEK</span><span style={{ color: "#00E5FF" }}>ON</span><span style={{ color: "#FF2D9B" }}>!</span>
            </div>
            <p className="text-sm" style={{ color: "var(--dim)", lineHeight: 1.7 }}>La comunidad geek más grande de Uruguay. Entrada siempre libre.</p>
          </div>
          {[
            { title: "Participar", links: ["Artist Alley","Stand Comercial","Cosplay","Actividades"] },
            { title: "Comunidad",  links: ["Foro","Galería","Edición 2026"] },
            { title: "GeekOn!",    links: ["Sobre nosotros","Instagram","Contacto"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--dim)" }}>{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}><a href="#" className="text-sm transition-colors hover:text-[#00E5FF]" style={{ color: "var(--dim)" }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto px-8 pb-8 flex justify-between items-center flex-wrap gap-4"
          style={{ borderTop: "1px solid var(--border)", paddingTop: 24 }}>
          <span className="text-sm" style={{ color: "var(--dim)" }}>© 2026 GeekOn! — Uruguay</span>
          <div className="flex items-end gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascots/eek.png" alt="Eek!" style={{ height: 52, filter: "drop-shadow(0 0 6px rgba(0,229,255,0.3))" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascots/gon.png" alt="Gon!" style={{ height: 52, filter: "drop-shadow(0 0 6px rgba(123,47,255,0.3))" }} />
          </div>
        </div>
      </footer>
    </>
  );
}
