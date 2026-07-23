import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";

export const metadata = { title: "Comunidad — GeekOn!" };

export default function ComunidadPage() {
  return (
    <div className="min-h-screen pt-[70px] flex items-center justify-center relative overflow-hidden bg-navy">

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(123,47,255,0.15) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none grid-overlay opacity-20" aria-hidden="true" />

      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto">
        <Reveal>
          <Eyebrow color="violet" className="mb-8">Comunidad</Eyebrow>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="font-black text-content mb-6"
            style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", letterSpacing: "-0.04em", lineHeight: 1.06 }}
          >
            El foro está<br />en construcción.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-content/55 mx-auto mb-10" style={{ fontSize: "1.0625rem", lineHeight: 1.75, maxWidth: 440 }}>
            Estamos armando el espacio donde la comunidad geek de Uruguay se junta a hablar de todo. Seguinos en Instagram para enterarte cuando esté disponible.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button href="/">Volver al inicio</Button>
            <Button href="https://instagram.com/geekonuy" variant="secondary">
              Seguinos en Instagram
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
