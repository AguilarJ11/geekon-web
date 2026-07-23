"use client";

export function BadgeCard({
  icon, name, edition, awardedAt,
}: {
  icon: string; name: string; edition: string | null; awardedAt: Date;
}) {
  return (
    <div
      className="badge-card"
      style={{
        background: "rgba(123,47,255,0.07)",
        border: "1px solid rgba(123,47,255,0.18)",
        borderRadius: "16px",
        padding: "20px 14px",
        textAlign: "center",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 0 32px rgba(123,47,255,0.3)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      <div style={{ fontSize: "2.25rem", marginBottom: "10px" }}>{icon}</div>
      <p style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: "4px" }}>{name}</p>
      {edition && (
        <p style={{ fontSize: "0.68rem", color: "rgba(0,229,255,0.7)", letterSpacing: "0.05em", marginBottom: "6px" }}>
          {edition}
        </p>
      )}
      <p style={{ fontSize: "0.68rem", color: "rgba(234,230,255,0.3)" }}>
        {new Date(awardedAt).toLocaleDateString("es-UY")}
      </p>
    </div>
  );
}

export function EmptyBadges() {
  return (
    <div style={{
      background: "rgba(123,47,255,0.04)",
      border: "1px dashed rgba(123,47,255,0.2)",
      borderRadius: "20px",
      padding: "3rem 2rem",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "3rem", marginBottom: "14px", opacity: 0.5 }}>🏆</div>
      <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "6px" }}>
        Todavía no tenés ningún badge
      </p>
      <p style={{ fontSize: "0.8rem", color: "rgba(234,230,255,0.35)" }}>
        Participá en los concursos del evento para ganar tus primeros logros
      </p>
    </div>
  );
}

export const ACTIONS = [
  { icon: "🎨", label: "Artista",          sub: "Postulá tu obra",          href: "/formularios/artista",   color: "#00E5FF" },
  { icon: "🛍️", label: "Stand Comercial",  sub: "Reservá tu espacio",       href: "/formularios/stand",     color: "#FF2D9B" },
  { icon: "👘", label: "Concurso Cosplay", sub: "Inscribite al certamen",   href: "/formularios/cosplay",   color: "#7B2FFF" },
  { icon: "💡", label: "Actividad",        sub: "Proponé algo genial",      href: "/formularios/actividad", color: "#F59E0B" },
];

export function ActionCard({ icon, label, sub, href, color }: typeof ACTIONS[0]) {
  return (
    <a
      href={href}
      style={{
        display: "flex", alignItems: "center", gap: "14px",
        padding: "16px 18px",
        background: `${color}08`,
        border: `1px solid ${color}22`,
        borderRadius: "16px",
        textDecoration: "none", color: "inherit",
        transition: "transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = "translateY(-2px)";
        el.style.background = `${color}14`;
        el.style.boxShadow = `0 0 22px ${color}28`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.transform = "translateY(0)";
        el.style.background = `${color}08`;
        el.style.boxShadow = "none";
      }}
    >
      <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>{icon}</span>
      <div>
        <p style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: "2px" }}>{label}</p>
        <p style={{ fontSize: "0.72rem", color: "rgba(234,230,255,0.4)" }}>{sub}</p>
      </div>
    </a>
  );
}
