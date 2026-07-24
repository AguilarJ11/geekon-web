"use client";

import { useState } from "react";
import Link from "next/link";

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

export function GalleryAlbumCard({
  id, title, edition, coverUrl, photoCount,
}: {
  id: string; title: string; edition: string | null; coverUrl: string | null; photoCount: number;
}) {
  return (
    <Link href={`/galeria/${id}`} style={{
      display: "block", position: "relative", aspectRatio: "4 / 3",
      borderRadius: "16px", overflow: "hidden",
      background: "rgba(0,229,255,0.06)",
      border: "1px solid rgba(0,229,255,0.18)",
      textDecoration: "none", color: "inherit",
    }}>
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverUrl} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", opacity: 0.3 }}>📷</div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,3,26,0.92) 0%, rgba(5,3,26,0.1) 55%, transparent 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px" }}>
        <p style={{ fontSize: "0.82rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</p>
        <p style={{ fontSize: "0.7rem", color: "rgba(234,230,255,0.5)", marginTop: "2px" }}>
          {edition && `${edition} · `}{photoCount} fotos
        </p>
      </div>
    </Link>
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

// Mismo look que las tarjetas de /inscripciones (y "Mis inscripciones" ·
// gestionás): fondo #0A0726, borde sutil, categoría en su propia línea. Solo
// cambia el contenido/acción de la derecha (acá es un link a la postulación
// entera, no un botón puntual), no la apariencia del contenedor.
export function ApplicationCard({
  id, title, edition, categoryIcon, categoryLabel, categoryColor, createdAt, status, isWinner,
}: {
  id: string; title: string; edition: string | null;
  categoryIcon: string; categoryLabel: string; categoryColor: string;
  createdAt: Date; status: SubmissionStatus; isWinner: boolean;
}) {
  return (
    <Link href={`/perfil/postulaciones/${id}`} style={{
      display: "flex", alignItems: "center", gap: "16px",
      padding: "20px", borderRadius: "12px",
      background: "#0A0726",
      border: "1px solid rgba(255,255,255,0.07)",
      textDecoration: "none", color: "inherit",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: "1rem", fontWeight: 600,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {title}
        </p>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "4px",
          fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
          padding: "2px 8px", borderRadius: "9999px",
          border: `1px solid ${categoryColor}40`,
          color: categoryColor, background: `${categoryColor}18`,
          marginTop: "6px", marginBottom: "4px",
        }}>
          <span aria-hidden="true">{categoryIcon}</span> {categoryLabel}
        </span>
        <div style={{ fontSize: "0.75rem", color: "rgba(234,230,255,0.4)", display: "flex", gap: "12px", marginTop: "4px" }}>
          {edition && <span>{edition}</span>}
          <span>Enviada el {new Date(createdAt).toLocaleDateString("es-UY", { day: "2-digit", month: "short", year: "numeric" })}</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
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
        <span style={{ color: "rgba(234,230,255,0.3)", fontSize: "0.9rem" }} aria-hidden="true">›</span>
      </div>
    </Link>
  );
}

interface PublicUser {
  id: string;
  // Nulo solo en teoría (el gate de onboarding obliga a elegir username antes
  // de poder usar el resto del sitio, así que para cuando existe una amistad
  // ambos ya tienen uno) — lo tipamos igual para calzar con el modelo de Prisma.
  username: string | null;
  name: string | null;
  image: string | null;
}

function Avatar({ user, size = 40 }: { user: PublicUser; size?: number }) {
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, color: "#fff",
      background: user.image ? `center/cover no-repeat url(${user.image})` : "linear-gradient(135deg, #7B2FFF 0%, #FF2D9B 100%)",
    }}>
      {!user.image && initials}
    </div>
  );
}

export function FriendCard({ user }: { user: PublicUser }) {
  if (!user.username) return null;
  return (
    <Link href={`/perfil/${user.username}`} style={{
      display: "flex", alignItems: "center", gap: "10px",
      padding: "10px 12px", borderRadius: "14px",
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
      textDecoration: "none", color: "inherit",
      transition: "border-color 0.2s, background 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(123,47,255,0.35)";
      e.currentTarget.style.background = "rgba(123,47,255,0.04)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
    }}>
      <Avatar user={user} />
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: "0.82rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {user.name ?? "Sin nombre"}
        </p>
        <p style={{ fontSize: "0.72rem", color: "rgba(234,230,255,0.4)" }}>@{user.username}</p>
      </div>
    </Link>
  );
}

export function EmptyFriends() {
  return (
    <div style={{
      background: "rgba(123,47,255,0.04)",
      border: "1px dashed rgba(123,47,255,0.2)",
      borderRadius: "20px",
      padding: "2rem",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "10px", opacity: 0.5 }}>🤝</div>
      <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Todavía no tenés amigos agregados</p>
      <p style={{ fontSize: "0.78rem", color: "rgba(234,230,255,0.35)", marginTop: "4px" }}>
        Entrá al perfil de alguien de la comunidad y mandale una solicitud
      </p>
    </div>
  );
}

interface PendingItem { friendshipId: string; user: PublicUser }

export function FriendRequestsPanel({ initialPendingReceived, initialPendingSent }: {
  initialPendingReceived: PendingItem[];
  initialPendingSent: PendingItem[];
}) {
  const [pendingReceived, setPendingReceived] = useState(initialPendingReceived);
  const [pendingSent, setPendingSent] = useState(initialPendingSent);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function accept(friendshipId: string) {
    setBusyId(friendshipId);
    const res = await fetch(`/api/friends/${friendshipId}`, { method: "PATCH" });
    if (res.ok) setPendingReceived((list) => list.filter((p) => p.friendshipId !== friendshipId));
    setBusyId(null);
  }

  async function reject(friendshipId: string) {
    setBusyId(friendshipId);
    const res = await fetch(`/api/friends/${friendshipId}`, { method: "DELETE" });
    if (res.ok) setPendingReceived((list) => list.filter((p) => p.friendshipId !== friendshipId));
    setBusyId(null);
  }

  async function cancel(friendshipId: string) {
    setBusyId(friendshipId);
    const res = await fetch(`/api/friends/${friendshipId}`, { method: "DELETE" });
    if (res.ok) setPendingSent((list) => list.filter((p) => p.friendshipId !== friendshipId));
    setBusyId(null);
  }

  if (pendingReceived.length === 0 && pendingSent.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {pendingReceived.map(({ friendshipId, user }) => (
        <div key={friendshipId} style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "14px",
          background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.2)",
        }}>
          <Avatar user={user} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700 }}>{user.name ?? "Sin nombre"}</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(234,230,255,0.4)" }}>@{user.username} te mandó una solicitud</p>
          </div>
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <button onClick={() => accept(friendshipId)} disabled={busyId === friendshipId}
              style={{
                fontSize: "0.72rem", fontWeight: 700, padding: "6px 12px", borderRadius: "100px",
                background: "#00E5FF", color: "#05031A", border: "none", cursor: "pointer",
              }}>
              Aceptar
            </button>
            <button onClick={() => reject(friendshipId)} disabled={busyId === friendshipId}
              style={{
                fontSize: "0.72rem", fontWeight: 700, padding: "6px 12px", borderRadius: "100px",
                background: "transparent", color: "rgba(234,230,255,0.5)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer",
              }}>
              Rechazar
            </button>
          </div>
        </div>
      ))}

      {pendingSent.map(({ friendshipId, user }) => (
        <div key={friendshipId} style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "10px 12px", borderRadius: "14px",
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <Avatar user={user} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "0.82rem", fontWeight: 700 }}>{user.name ?? "Sin nombre"}</p>
            <p style={{ fontSize: "0.72rem", color: "rgba(234,230,255,0.4)" }}>Solicitud enviada, esperando respuesta</p>
          </div>
          <button onClick={() => cancel(friendshipId)} disabled={busyId === friendshipId}
            style={{
              fontSize: "0.72rem", fontWeight: 600, padding: "6px 12px", borderRadius: "100px",
              background: "transparent", color: "rgba(234,230,255,0.4)", border: "1px solid rgba(255,255,255,0.12)", cursor: "pointer", flexShrink: 0,
            }}>
            Cancelar
          </button>
        </div>
      ))}
    </div>
  );
}
