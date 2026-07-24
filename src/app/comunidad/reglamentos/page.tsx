import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";

export const metadata = { title: "Reglamentos — GeekOn!" };

// Página provisoria: todavía no está definido cómo se van a organizar los
// reglamentos por categoría (cosplay, torneos, etc.). Por ahora sirve como
// destino único para los links "Ver reglamento" desde los formularios.
export default function ReglamentosPage() {
  return (
    <div className="min-h-screen pt-[70px] flex items-center justify-center relative overflow-hidden bg-navy">
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
            Reglamentos.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-content/55 mx-auto mb-10" style={{ fontSize: "1.0625rem", lineHeight: 1.75, maxWidth: 440 }}>
            Estamos terminando de redactar los reglamentos de cada categoría (cosplay, torneos, stands, etc.). Mientras tanto, cualquier duda escribinos por Instagram.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button href="/comunidad">Volver a comunidad</Button>
            <Button href="https://instagram.com/geekon_uy" variant="secondary">
              Escribinos
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
