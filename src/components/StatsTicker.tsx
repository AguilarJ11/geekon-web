// Server Component — CSS-only marquee, no client JS needed

const ITEMS = [
  { value: "4.000+", label: "Seguidores"    },
  { value: "35+",    label: "Artistas"      },
  { value: "15+",    label: "Stands"        },
  { value: "2",      label: "Ediciones"     },
];

export default function StatsTicker() {
  return (
    <div
      className="overflow-hidden border-y border-violet/10 bg-surface/40 py-6 select-none group"
      aria-label="Estadísticas de GeekOn!"
    >
      <div
        className="flex w-max group-hover:[animation-play-state:paused]"
        style={{ animation: "ticker 32s linear infinite" }}
      >
        {/* Duplicated for seamless loop */}
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <div key={i} className="inline-flex items-center">
            <div className="px-10 text-center">
              <div className="text-2xl font-black text-violet tabular-nums leading-none">
                {item.value}
              </div>
              <div className="text-[10px] uppercase tracking-widest font-semibold text-content/35 mt-1.5">
                {item.label}
              </div>
            </div>
            <span className="text-violet/20 text-xl font-thin" aria-hidden="true">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
