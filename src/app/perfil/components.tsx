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

export function ActionCard({
  icon, label, sub, href, color,
}: {
  icon: string; label: string; sub: string; href: string; color: string;
}) {
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

type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
};

const STATUS_STYLE: Record<SubmissionStatus, { color: string; background: string; borderColor: string }> = {
  PENDING:  { color: "#F59E0B", background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)" },
  APPROVED: { color: "#10B981", background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.3)" },
  REJECTED: { color: "#FF2D9B", background: "rgba(255,45,155,0.1)", borderColor: "rgba(255,45,155,0.3)" },
};

export function ApplicationCard({
  title, edition, createdAt, status, isWinner,
}: {
  title: string; edition: string | null; createdAt: Date; status: SubmissionStatus; isWinner: boolean;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "12px", padding: "14px 18px",
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "14px",
    }}>
      <div>
        <p style={{ fontSize: "0.85rem", fontWeight: 700 }}>
          {title}{edition && <span style={{ color: "rgba(234,230,255,0.4)", fontWeight: 500 }}> · {edition}</span>}
        </p>
        <p style={{ fontSize: "0.7rem", color: "rgba(234,230,255,0.35)", marginTop: "2px" }}>
          Enviada el {new Date(createdAt).toLocaleDateString("es-UY", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {isWinner && (
          <span style={{
            padding: "4px 12px", borderRadius: "100px",
            fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap",
            border: "1px solid rgba(245,158,11,0.35)",
            color: "#F59E0B", background: "rgba(245,158,11,0.12)",
          }}>
            🏆 Ganador
          </span>
        )}
        <span
          style={{
            padding: "4px 12px", borderRadius: "100px",
            fontSize: "0.72rem", fontWeight: 700, whiteSpace: "nowrap",
            border: "1px solid",
            ...STATUS_STYLE[status],
          }}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>
    </div>
  );
}
