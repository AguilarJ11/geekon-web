import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";
import UserSearch from "./UserSearch";

export const metadata = { title: "Comunidad — GeekOn!" };

function InfoCard({
  icon, title, description, action,
}: {
  icon: string; title: string; description: string; action: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-6 sm:p-8 text-left h-full flex flex-col"
      style={{ background: "rgba(11,8,36,0.65)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
    >
      <div className="text-2xl mb-3" aria-hidden="true">{icon}</div>
      <h2 className="font-bold mb-1" style={{ fontSize: "1.0625rem" }}>{title}</h2>
      <p className="text-content/45 text-sm mb-4 flex-1">{description}</p>
      {action}
    </div>
  );
}

export default function ComunidadPage() {
  return (
    <div className="min-h-screen pt-[70px] relative overflow-hidden bg-navy pb-20">

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(123,47,255,0.15) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none grid-overlay opacity-20" aria-hidden="true" />

      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto pt-16">
        <Reveal>
          <Eyebrow color="violet" className="mb-8">Comunidad</Eyebrow>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="font-black text-content mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", letterSpacing: "-0.04em", lineHeight: 1.06 }}
          >
            El espacio de<br />la comunidad geek.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-content/55 mx-auto mb-10" style={{ fontSize: "1.0625rem", lineHeight: 1.75, maxWidth: 440 }}>
            Todavía estamos armando esta sección. Mientras tanto, esto es lo que ya tenés disponible.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="flex gap-3 justify-center flex-wrap mb-12">
            <Button href="/">Volver al inicio</Button>
            <Button href="https://instagram.com/geekon_uy" variant="secondary">
              Seguinos en Instagram
            </Button>
          </div>
        </Reveal>
      </div>

      <div className="relative z-10 px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Reveal delay={280}>
            <UserSearch />
          </Reveal>

          <Reveal delay={340}>
            <InfoCard
              icon="📋"
              title="Reglamentos"
              description="Las reglas de cada categoría (cosplay, torneos, stands, etc.). Todavía estamos armando esta sección."
              action={
                <Button href="/comunidad/reglamentos" variant="secondary" size="sm">
                  Ver reglamentos
                </Button>
              }
            />
          </Reveal>

          <Reveal delay={400}>
            <InfoCard
              icon="💬"
              title="Foros"
              description="El espacio para hablar de todo con la comunidad geek de Uruguay. Todavía en construcción."
              action={
                <Button variant="secondary" size="sm" disabled>
                  Próximamente
                </Button>
              }
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
