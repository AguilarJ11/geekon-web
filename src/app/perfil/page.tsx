import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Stars from "@/components/Stars";
import Button from "@/components/ui/Button";
import { BadgeCard, EmptyBadges, ActionCard, ApplicationCard, GalleryAlbumCard, FriendCard, EmptyFriends, FriendRequestsPanel } from "./components";
import { INTEREST_CATALOG, SOCIAL_LINKS, STAFF_ROLES, VISITANTE_ROLE } from "@/lib/profile-catalog";
import { categoryInfo } from "@/lib/form-categories";

const VISITANTE = VISITANTE_ROLE;

const XP_PER_LEVEL = 300;

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      badges: { include: { badge: true }, orderBy: { awardedAt: "desc" } },
      submissions: {
        include: { form: { select: { title: true, category: true, edition: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  const myGalleries = user.role === "FOTOGRAFO"
    ? await prisma.album.findMany({
        where: { uploadedById: user.id, status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, edition: true, coverUrl: true, _count: { select: { photos: { where: { status: "APPROVED" } } } } },
      })
    : [];

  const appliedFormIds = new Set(user.submissions.map((s) => s.formId));
  const openForms = await prisma.form.findMany({
    where: { isPublished: true, id: { notIn: [...appliedFormIds] } },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, description: true, slug: true, category: true },
  });

  const approvedSubmissions = user.submissions.filter((s) => s.status === "APPROVED");

  const PUBLIC_SELECT = { id: true, username: true, name: true, image: true } as const;
  const friendships = await prisma.friendship.findMany({
    where: { OR: [{ requesterId: user.id }, { addresseeId: user.id }] },
    include: { requester: { select: PUBLIC_SELECT }, addressee: { select: PUBLIC_SELECT } },
    orderBy: { createdAt: "desc" },
  });
  const friends = friendships
    .filter((f) => f.status === "ACCEPTED")
    .map((f) => (f.requesterId === user.id ? f.addressee : f.requester));
  const pendingReceived = friendships
    .filter((f) => f.status === "PENDING" && f.addresseeId === user.id)
    .map((f) => ({ friendshipId: f.id, user: f.requester }));
  const pendingSent = friendships
    .filter((f) => f.status === "PENDING" && f.requesterId === user.id)
    .map((f) => ({ friendshipId: f.id, user: f.addressee }));

  // Por ahora el único rol que se muestra es el asignado explícitamente
  // (staff/admin/fotógrafo, etc.) — crear o ser dueño de un formulario, o
  // participar en uno, ya no otorga roles ni badges automáticamente. Eso se
  // va a asignar a mano más adelante.
  const roles: { label: string; color: string }[] = [];
  if (STAFF_ROLES[user.role]) roles.push(STAFF_ROLES[user.role]);
  if (roles.length === 0) roles.push(VISITANTE);

  const primaryRole = roles[0];
  const glow = `${primaryRole.color}73`;

  const xp = approvedSubmissions.length * 100 + user.badges.length * 50;
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpProgress = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;

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
          background: user.banner
            ? `center/cover no-repeat url(${user.banner})`
            : "linear-gradient(135deg, #08052a 0%, #1a0844 45%, #0e0630 75%, #06031c 100%)",
          position: "relative",
          overflow: "hidden",
        }}>
          {user.banner && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(5,3,26,0.3)" }} />
          )}
          {/* Grid overlay */}
          {!user.banner && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          )}

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
            background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
            animation: "glowPulse 3s ease-in-out infinite",
          }} />

          {/* Avatar */}
          <div style={{
            width: "128px", height: "128px",
            borderRadius: "50%",
            background: user.image
              ? `center/cover no-repeat url(${user.image})`
              : "linear-gradient(135deg, #7B2FFF 0%, #FF2D9B 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.75rem", fontWeight: 900,
            letterSpacing: "-0.02em",
            border: "4px solid #05031A",
            boxShadow: `0 0 0 1px ${primaryRole.color}30, 0 8px 48px ${glow}`,
            position: "relative",
          }}>
            {!user.image && initials}
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
            <p style={{ color: "var(--dim)", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
              @{user.username}
            </p>
            <p style={{ color: "var(--dim)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              {user.email}
            </p>

            {/* Badges de rol (puede tener más de uno) */}
            <div style={{
              display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px",
            }}>
              {roles.map((r) => (
                <span key={r.label} style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "6px 16px",
                  borderRadius: "100px",
                  fontSize: "0.7rem", fontWeight: 700,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: `${r.color}12`,
                  border: `1px solid ${r.color}35`,
                  color: r.color,
                  boxShadow: `0 0 18px ${r.color}73`,
                }}>
                  <span style={{
                    display: "inline-block",
                    width: "6px", height: "6px",
                    borderRadius: "50%",
                    background: r.color,
                    boxShadow: `0 0 8px ${r.color}`,
                  }} />
                  {r.label}
                </span>
              ))}
            </div>

            {/* Nivel / XP */}
            <div style={{ maxWidth: "220px", margin: "0.85rem auto 0" }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: "0.68rem", color: "rgba(234,230,255,0.4)", marginBottom: "4px",
              }}>
                <span>Nivel {level}</span>
                <span>{xp} XP</span>
              </div>
              <div style={{
                height: "6px", borderRadius: "100px",
                background: "rgba(255,255,255,0.06)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${xpProgress}%`,
                  background: "linear-gradient(90deg, #7B2FFF, #00E5FF)",
                  borderRadius: "100px",
                }} />
              </div>
            </div>

            {user.bio && (
              <p style={{
                marginTop: "1.25rem", fontSize: "0.9rem", color: "rgba(234,230,255,0.65)",
                maxWidth: "480px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.5,
              }}>
                {user.bio}
              </p>
            )}

            {user.city && (
              <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "rgba(234,230,255,0.45)" }}>
                📍 {user.city}, Uruguay
              </p>
            )}

            {(user.instagram || user.discord || user.tiktok || user.twitter) && (
              <div style={{
                display: "flex", justifyContent: "center", flexWrap: "wrap",
                gap: "10px", marginTop: "1rem",
              }}>
                {(["instagram", "tiktok", "twitter"] as const).map((key) => {
                  const value = user[key];
                  if (!value) return null;
                  const social = SOCIAL_LINKS[key](value);
                  return (
                    <a
                      key={key}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "5px 12px", borderRadius: "100px",
                        fontSize: "0.75rem", color: "rgba(234,230,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.02)",
                        textDecoration: "none",
                      }}
                    >
                      <span aria-hidden="true">{social.icon}</span>{social.label}
                    </a>
                  );
                })}
                {user.discord && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "5px 12px", borderRadius: "100px",
                    fontSize: "0.75rem", color: "rgba(234,230,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.02)",
                  }}>
                    <span aria-hidden="true">🎮</span>{user.discord}
                  </span>
                )}
              </div>
            )}

            {user.interests.length > 0 && (
              <div style={{
                display: "flex", justifyContent: "center", flexWrap: "wrap",
                gap: "8px", marginTop: "1rem",
              }}>
                {user.interests.map((key: string) => {
                  const tag = INTEREST_CATALOG.find((t) => t.key === key);
                  if (!tag) return null;
                  return (
                    <span key={key} style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "5px 12px", borderRadius: "100px",
                      fontSize: "0.75rem", fontWeight: 600,
                      color: "#7B2FFF", background: "rgba(123,47,255,0.1)",
                      border: "1px solid rgba(123,47,255,0.25)",
                    }}>
                      {tag.label}
                    </span>
                  );
                })}
              </div>
            )}

            <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "rgba(234,230,255,0.3)" }}>
              Miembro desde {joinDate}
            </p>

            <div style={{ marginTop: "1.25rem" }}>
              <Button href="/perfil/editar" variant="secondary" size="sm">
                Editar perfil
              </Button>
            </div>
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

          {/* ── Amigos ──────────────────────────────────────────── */}
          <div className="gradient-divider animate-fadeIn delay-350" style={{ marginBottom: "2.5rem" }} />
          <section className="animate-fadeInUp delay-350" style={{ marginBottom: "2.5rem" }}>
            <div style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Amigos
              </h2>
              <p style={{ fontSize: "0.78rem", color: "rgba(234,230,255,0.35)", marginTop: "3px" }}>
                {friends.length} amigo{friends.length === 1 ? "" : "s"}
              </p>
            </div>

            {(pendingReceived.length > 0 || pendingSent.length > 0) && (
              <div style={{ marginBottom: "1rem" }}>
                <FriendRequestsPanel initialPendingReceived={pendingReceived} initialPendingSent={pendingSent} />
              </div>
            )}

            {friends.length === 0 ? (
              <EmptyFriends />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                {friends.map((friend) => (
                  <FriendCard key={friend.id} user={friend} />
                ))}
              </div>
            )}
          </section>

          {/* ── Mis galerías (solo rol FOTOGRAFO) ──────────────── */}
          {user.role === "FOTOGRAFO" && (
            <>
              <div className="gradient-divider animate-fadeIn delay-400" style={{ marginBottom: "2.5rem" }} />
              <section className="animate-fadeInUp delay-400" style={{ marginBottom: "2.5rem" }}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h2 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Mis galerías
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "rgba(234,230,255,0.35)", marginTop: "3px" }}>
                    Álbumes que compartiste y ya están aprobados
                  </p>
                </div>

                {myGalleries.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "2rem",
                    border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px",
                    color: "rgba(234,230,255,0.35)", fontSize: "0.85rem",
                  }}>
                    Todavía no tenés álbumes aprobados. Subilos desde la galería.
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
                    {myGalleries.map((album) => (
                      <GalleryAlbumCard
                        key={album.id}
                        id={album.id}
                        title={album.title}
                        edition={album.edition}
                        coverUrl={album.coverUrl}
                        photoCount={album._count.photos}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}

          {/* Separador */}
          <div className="gradient-divider animate-fadeIn delay-400" style={{ marginBottom: "2.5rem" }} />

          {/* ── Mis postulaciones ──────────────────────────────── */}
          {user.submissions.length > 0 && (
            <>
              <section className="animate-fadeInUp delay-500" style={{ marginBottom: "2.5rem" }}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h2 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Mis postulaciones
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "rgba(234,230,255,0.35)", marginTop: "3px" }}>
                    Estado de tus postulaciones enviadas
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {user.submissions.map((sub) => {
                    const cat = categoryInfo(sub.form.category);
                    return (
                      <ApplicationCard
                        key={sub.id}
                        id={sub.id}
                        title={sub.form.title}
                        edition={sub.form.edition}
                        categoryIcon={cat.icon}
                        categoryLabel={cat.label}
                        categoryColor={cat.color}
                        createdAt={sub.createdAt}
                        status={sub.status}
                        isWinner={sub.isWinner}
                      />
                    );
                  })}
                </div>
              </section>

              <div className="gradient-divider animate-fadeIn delay-500" style={{ marginBottom: "2.5rem" }} />
            </>
          )}

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

            {openForms.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "2rem",
                border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px",
                color: "rgba(234,230,255,0.35)", fontSize: "0.85rem",
              }}>
                Todavía no hay postulaciones abiertas. ¡Volvé pronto!
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                {openForms.map((form) => {
                  const cat = categoryInfo(form.category);
                  return (
                    <ActionCard
                      key={form.id}
                      icon={cat.icon}
                      label={form.title}
                      sub={form.description ?? "Postulate acá"}
                      href={`/inscripciones/${form.slug}`}
                      color={cat.color}
                    />
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>
    </>
  );
}
