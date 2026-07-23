"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { INTEREST_CATALOG, URUGUAY_DEPARTMENTS } from "@/lib/profile-catalog";

interface Initial {
  name: string;
  bio: string;
  image: string | null;
  banner: string | null;
  city: string;
  instagram: string;
  discord: string;
  tiktok: string;
  twitter: string;
  interests: string[];
}

export default function EditProfileForm({ initial }: { initial: Initial }) {
  const router = useRouter();

  const [name, setName] = useState(initial.name);
  const [bio, setBio] = useState(initial.bio);
  const [city, setCity] = useState(initial.city);
  const [instagram, setInstagram] = useState(initial.instagram);
  const [discord, setDiscord] = useState(initial.discord);
  const [tiktok, setTiktok] = useState(initial.tiktok);
  const [twitter, setTwitter] = useState(initial.twitter);
  const [interests, setInterests] = useState<string[]>(initial.interests);
  const [avatarPreview, setAvatarPreview] = useState(initial.image);
  const [bannerPreview, setBannerPreview] = useState(initial.banner);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleInterest(key: string) {
    setInterests((prev) =>
      prev.includes(key)
        ? prev.filter((k) => k !== key)
        : prev.length >= 8 ? prev : [...prev, key]
    );
  }

  const avatarFile = useRef<File | null>(null);
  const bannerFile = useRef<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  function pickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    avatarFile.current = file;
    setAvatarPreview(URL.createObjectURL(file));
  }

  function pickBanner(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    bannerFile.current = file;
    setBannerPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData();
    form.set("name", name);
    form.set("bio", bio);
    form.set("city", city);
    form.set("instagram", instagram);
    form.set("discord", discord);
    form.set("tiktok", tiktok);
    form.set("twitter", twitter);
    form.set("interestsTouched", "1");
    interests.forEach((i) => form.append("interests", i));
    if (avatarFile.current) form.set("avatar", avatarFile.current);
    if (bannerFile.current) form.set("banner", bannerFile.current);

    const res = await fetch("/api/perfil", { method: "PATCH", body: form });
    let data: { error?: string } = {};
    try { data = await res.json(); } catch { data = { error: "Error inesperado del servidor" }; }
    setLoading(false);

    if (!res.ok) { setError(data.error || "Ocurrió un error"); return; }
    router.push("/perfil");
    router.refresh();
  }

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <div className="relative z-10 min-h-screen">

        {/* ── Banner ─────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            height: "260px",
            background: bannerPreview
              ? `center/cover no-repeat url(${bannerPreview})`
              : "linear-gradient(135deg, #08052a 0%, #1a0844 45%, #0e0630 75%, #06031c 100%)",
          }}
        >
          {!bannerPreview && (
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }} />
          )}
          <div className="absolute inset-0" style={{ background: "rgba(5,3,26,0.35)" }} />

          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="absolute bottom-4 right-4 rounded-xl px-4 py-2 text-sm font-semibold text-content/85 bg-navy/70 border border-white/15 backdrop-blur-md hover:bg-navy/90 hover:border-white/25 transition-colors"
          >
            Cambiar banner
          </button>
          <input ref={bannerInputRef} type="file" accept="image/*" hidden onChange={pickBanner} />
        </div>

        {/* ── Avatar ─────────────────────────────────────────── */}
        <div className="animate-scaleIn" style={{
          marginTop: "-64px",
          display: "flex", justifyContent: "center",
          position: "relative", zIndex: 20,
        }}>
          <div className="relative">
            <div style={{
              width: "128px", height: "128px",
              borderRadius: "50%",
              background: avatarPreview ? `center/cover no-repeat url(${avatarPreview})` : "linear-gradient(135deg, #7B2FFF 0%, #FF2D9B 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.75rem", fontWeight: 900,
              border: "4px solid #05031A",
              boxShadow: "0 8px 48px rgba(123,47,255,0.4)",
            }}>
              {!avatarPreview && initials}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Cambiar avatar"
              className="absolute bottom-0 right-0 w-9 h-9 rounded-full flex items-center justify-center bg-violet text-white border-2 border-navy hover:brightness-110 transition-all"
            >
              ✎
            </button>
            <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={pickAvatar} />
          </div>
        </div>

        {/* ── Formulario ─────────────────────────────────────── */}
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: "1.75rem 1.25rem 5rem" }}>
          <h1 className="text-center font-black text-2xl mb-8 animate-fadeInUp">Editar perfil</h1>

          <form onSubmit={handleSubmit} className="space-y-5 animate-fadeInUp delay-100">
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm font-medium text-pink bg-pink/[0.08] border border-pink/[0.28]">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium mb-2 text-content/65">Nombre</label>
              <input
                id="edit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={60}
                className="input-premium"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="edit-bio" className="block text-sm font-medium mb-2 text-content/65">
                Bio <span className="text-content/35 font-normal">({bio.length}/280)</span>
              </label>
              <textarea
                id="edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 280))}
                rows={4}
                className="input-premium resize-none"
                placeholder="Contanos algo sobre vos..."
              />
            </div>

            <div>
              <label htmlFor="edit-city" className="block text-sm font-medium mb-2 text-content/65">Ciudad / Departamento</label>
              <select
                id="edit-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input-premium"
              >
                <option value="">Sin especificar</option>
                {URUGUAY_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="block text-sm font-medium mb-2 text-content/65">Redes sociales</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg shrink-0" aria-hidden="true">📷</span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    maxLength={80}
                    className="input-premium"
                    placeholder="Instagram"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg shrink-0" aria-hidden="true">🎮</span>
                  <input
                    type="text"
                    value={discord}
                    onChange={(e) => setDiscord(e.target.value)}
                    maxLength={80}
                    className="input-premium"
                    placeholder="Discord"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg shrink-0" aria-hidden="true">🎵</span>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    maxLength={80}
                    className="input-premium"
                    placeholder="TikTok"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg shrink-0" aria-hidden="true">✕</span>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    maxLength={80}
                    className="input-premium"
                    placeholder="X / Twitter"
                  />
                </div>
              </div>
            </div>

            <div>
              <p className="block text-sm font-medium mb-2 text-content/65">
                Intereses / fandoms <span className="text-content/35 font-normal">({interests.length}/8)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_CATALOG.map((tag) => {
                  const active = interests.includes(tag.key);
                  return (
                    <button
                      key={tag.key}
                      type="button"
                      onClick={() => toggleInterest(tag.key)}
                      className={
                        active
                          ? "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium border transition-colors bg-violet/20 border-violet/50 text-content"
                          : "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium border transition-colors bg-white/[0.02] border-white/12 text-content/55 hover:border-white/25 hover:text-content"
                      }
                    >
                      <span aria-hidden="true">{tag.icon}</span>
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} size="lg" className="flex-1 justify-center">
                {loading ? "Guardando..." : "Guardar cambios"}
              </Button>
              <Button href="/perfil" variant="secondary" size="lg">
                Cancelar
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-content/40 mt-6 animate-fadeInUp delay-200">
            ¿Volver a tu <Link href="/perfil" className="text-violet hover:text-cyan transition-colors">perfil</Link>?
          </p>
        </div>
      </div>
    </>
  );
}
