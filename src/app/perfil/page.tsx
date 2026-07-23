import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Stars from "@/components/Stars";
import { BadgeCard, EmptyBadges, ActionCard, ACTIONS } from "./components";

const ROLES: Record<string, { label: string; color: string; glow: string }> = {
  USER:             { label: "Miembro",              color: "#7B2FFF", glow: "rgba(123,47,255,0.45)" },
  ARTIST:           { label: "Artista",               color: "#00E5FF", glow: "rgba(0,229,255,0.4)"   },
  COMMERCIAL_STAND: { label: "Stand Comercial",       color: "#FF2D9B", glow: "rgba(255,45,155,0.4)"  },
  STAFF_CM:         { label: "Community Manager",     color: "#F59E0B", glow: "rgba(245,158,11,0.4)"  },
  STAFF_STANDS:     { label: "Staff de Stands",       color: "#10B981", glow: "rgba(16,185,129,0.4)"  },
  COORDINATOR:      { label: "Coordinador",           color: "#FF2D9B", glow: "rgba(255,45,155,0.5)"  },
};

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      badges: { include: { badge: true }, orderBy: { awardedAt: "desc" } },
    },
  });

  if (!user) redirect("/login");

  const role = ROLES[user.role] ?? ROLES.USER;
  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const joinDate = new Date(user.createdAt).toLocaleDateString("es-UY", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <Stars />

      <div className="relative z-10 min-h-screen">

        {/* ── Banner ─────────────────────────────────────────── */}
        <div style={{
          height: "260px",
          background: "linear-gradient(135deg, #08052a 0%, #1a0844 45%, #0e0630 75%, #06031c 100%)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Grid overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />

          {/* Orbs ambientales */}
          <div style={{
            position: "absolute", top: "-80px", right: "18%",
            width: "360px", height: "360px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(123,47,255,0.28) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-60px", left: "8%",
            width: "280px", height: "280px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,45,155,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: "20px", left: "40%",
            width: "200px", height: "200px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ── Avatar (superpuesto al banner) ─────────────────── */}
        <div className="animate-scaleIn" style={{
          marginTop: "-64px",
          display: "flex", justifyContent: "center",
          position: "relative", zIndex: 20,
        }}>
          {/* Glow de fondo */}
          <div style={{
            position: "absolute",
            width: "148px", height: "148px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${role.glow} 0%, transparent 70%)`,
            animation: "glowPulse 3s ease-in-out infinite",
          }} />

          {/* Avatar */}
          <div style={{
            width: "128px", height: "128px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7B2FFF 0%, #FF2D9B 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.75rem", fontWeight: 900,
            letterSpacing: "-0.02em",
            border: "4px solid #05031A",
            boxShadow: `0 0 0 1px ${role.color}30, 0 8px 48px ${role.glow}`,
            position: "relative",
          }}>
            {initials}
          </div>
        </div>

        {/* ── Contenido central ──────────────────────────────── */}
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 1.25rem 5rem" }}>

          {/* Nombre e info */}
          <div className="animate-fadeInUp" style={{ textAlign: "center", paddingTop: "1.75rem", paddingBottom: "2.5rem" }}>
            <h1 style={{
              fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              marginBottom: "0.375rem",
            }}>
              {user.name ?? "Sin nombre"}
            </h1>
            <p style={{ color: "var(--dim)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              {user.email}
            </p>

            {/* Badge de rol */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 16px",
              borderRadius: "100px",
              fontSize: "0.7rem", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              background: `${role.color}12`,
              border: `1px solid ${role.color}35`,
              color: role.color,
              boxShadow: `0 0 18px ${role.glow}`,
            }}>
              <span style={{
                display: "inline-block",
                width: "6px", height: "6px",
                borderRadius: "50%",
                background: role.color,
                boxShadow: `0 0 8px ${role.color}`,
              }} />
              {role.label}
            </span>

            <p style={{ marginTop: "1.25rem", fontSize: "0.75rem", color: "rgba(234,230,255,0.3)" }}>
              Miembro desde {joinDate}
            </p>
          </div>

          {/* Separador */}
          <div className="gradient-divider animate-fadeIn delay-200" style={{ marginBottom: "2.5rem" }} />

          {/* ── Logros & Badges ──────────────────────────────── */}
          <section className="animate-fadeInUp delay-300" style={{ marginBottom: "2.5rem" }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Logros & Badges
              </h2>
              <p style={{ fontSize: "0.78rem", color: "rgba(234,230,255,0.35)", marginTop: "3px" }}>
                Participá en el evento para ganar tus primeros badges
              </p>
            </div>

            {user.badges.length === 0 ? (
              <EmptyBadges />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
                {user.badges.map(({ badge, awardedAt }: {
                  badge: { id: string; icon: string; name: string; edition: string | null };
                  awardedAt: Date;
                }) => (
                  <BadgeCard
                    key={badge.id}
                    icon={badge.icon}
                    name={badge.name}
                    edition={badge.edition}
                    awardedAt={awardedAt}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Separador */}
          <div className="gradient-divider animate-fadeIn delay-400" style={{ marginBottom: "2.5rem" }} />

          {/* ── Acciones rápidas ─────────────────────────────── */}
          <section className="animate-fadeInUp delay-500">
            <div style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Participar en GeekOn!
              </h2>
              <p style={{ fontSize: "0.78rem", color: "rgba(234,230,255,0.35)", marginTop: "3px" }}>
                Enviá tu postulación para la próxima edición
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
              {ACTIONS.map((a) => (
                <ActionCard key={a.href} {...a} />
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
