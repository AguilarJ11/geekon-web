import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Stars from "@/components/Stars";
import { BadgeCard, EmptyBadges, GalleryAlbumCard, FriendCard, EmptyFriends } from "../components";
import { INTEREST_CATALOG, SOCIAL_LINKS, STAFF_ROLES, VISITANTE_ROLE } from "@/lib/profile-catalog";
import FriendActionButton from "./FriendActionButton";

// Vista pública de un perfil (a diferencia de /perfil, que es la vista propia
// editable). Solo expone datos pensados para mostrarse a cualquier visitante:
// nada de email, postulaciones ni acciones de edición.
export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const session = await getServerSession(authOptions);
  const selfId = (session?.user as { id?: string } | undefined)?.id;
  const selfUsername = (session?.user as { username?: string | null } | undefined)?.username;
  if (selfUsername === username) redirect("/perfil");

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      badges: { include: { badge: true }, orderBy: { awardedAt: "desc" } },
    },
  });

  if (!user) notFound();

  const myGalleries = user.role === "FOTOGRAFO"
    ? await prisma.album.findMany({
        where: { uploadedById: user.id, status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, edition: true, coverUrl: true, _count: { select: { photos: { where: { status: "APPROVED" } } } } },
      })
    : [];

  const friendship = selfId
    ? await prisma.friendship.findFirst({
        where: {
          OR: [
            { requesterId: selfId, addresseeId: user.id },
            { requesterId: user.id, addresseeId: selfId },
          ],
        },
      })
    : null;

  const friendStatus = !friendship
    ? "NONE" as const
    : friendship.status === "ACCEPTED"
    ? "FRIENDS" as const
    : friendship.requesterId === selfId
    ? "PENDING_SENT" as const
    : "PENDING_RECEIVED" as const;

  const friends = user.showFriendsPublicly
    ? (await prisma.friendship.findMany({
        where: { status: "ACCEPTED", OR: [{ requesterId: user.id }, { addresseeId: user.id }] },
        include: {
          requester: { select: { id: true, username: true, name: true, image: true } },
          addressee: { select: { id: true, username: true, name: true, image: true } },
        },
      })).map((f) => (f.requesterId === user.id ? f.addressee : f.requester))
    : [];

  const primaryRole = STAFF_ROLES[user.role] ?? VISITANTE_ROLE;
  const glow = `${primaryRole.color}73`;

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
          {!user.banner && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }} />
          )}
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
        </div>

        {/* ── Avatar (superpuesto al banner) ─────────────────── */}
        <div className="animate-scaleIn" style={{
          marginTop: "-64px",
          display: "flex", justifyContent: "center",
          position: "relative", zIndex: 20,
        }}>
          <div style={{
            position: "absolute",
            width: "148px", height: "148px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
            animation: "glowPulse 3s ease-in-out infinite",
          }} />
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
            <p style={{ color: "var(--dim)", fontSize: "0.875rem", marginBottom: user.showEmail ? "0.25rem" : "1.25rem" }}>
              @{user.username}
            </p>
            {user.showEmail && (
              <p style={{ color: "var(--dim)", fontSize: "0.8rem", marginBottom: "1.25rem" }}>
                {user.email}
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "6px 16px",
                borderRadius: "100px",
                fontSize: "0.7rem", fontWeight: 700,
                letterSpacing: "0.08em", textTransform: "uppercase",
                background: `${primaryRole.color}12`,
                border: `1px solid ${primaryRole.color}35`,
                color: primaryRole.color,
                boxShadow: `0 0 18px ${primaryRole.color}73`,
              }}>
                <span style={{
                  display: "inline-block",
                  width: "6px", height: "6px",
                  borderRadius: "50%",
                  background: primaryRole.color,
                  boxShadow: `0 0 8px ${primaryRole.color}`,
                }} />
                {primaryRole.label}
              </span>
            </div>

            {selfId && (
              <div className="flex justify-center mt-4">
                <FriendActionButton
                  targetUsername={username}
                  initialStatus={friendStatus}
                  initialFriendshipId={friendship?.id ?? null}
                />
              </div>
            )}

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
          </div>

          {/* ── Mis galerías (solo rol FOTOGRAFO) ──────────────── */}
          {user.role === "FOTOGRAFO" && (
            <>
              <div className="gradient-divider animate-fadeIn delay-200" style={{ marginBottom: "2.5rem" }} />
              <section className="animate-fadeInUp delay-200" style={{ marginBottom: "2.5rem" }}>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h2 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Galerías
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "rgba(234,230,255,0.35)", marginTop: "3px" }}>
                    Álbumes compartidos por {user.name ?? "este fotógrafo"}
                  </p>
                </div>

                {myGalleries.length === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "2rem",
                    border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "16px",
                    color: "rgba(234,230,255,0.35)", fontSize: "0.85rem",
                  }}>
                    Todavía no tiene álbumes aprobados.
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

          {/* ── Logros & Badges ──────────────────────────────── */}
          <div className="gradient-divider animate-fadeIn delay-300" style={{ marginBottom: "2.5rem" }} />
          <section className="animate-fadeInUp delay-300">
            <div style={{ marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Logros & Badges
              </h2>
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

          {/* ── Amigos (solo si el usuario eligió mostrarla) ────── */}
          {user.showFriendsPublicly && (
            <>
              <div className="gradient-divider animate-fadeIn delay-400" style={{ marginBottom: "2.5rem", marginTop: "2.5rem" }} />
              <section className="animate-fadeInUp delay-400">
                <div style={{ marginBottom: "1.25rem" }}>
                  <h2 style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Amigos
                  </h2>
                  <p style={{ fontSize: "0.78rem", color: "rgba(234,230,255,0.35)", marginTop: "3px" }}>
                    {friends.length} amigo{friends.length === 1 ? "" : "s"}
                  </p>
                </div>

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
            </>
          )}

        </div>
      </div>
    </>
  );
}
