"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";

interface Album {
  id: string;
  title: string;
  edition: string | null;
  description: string | null;
  coverUrl: string | null;
  status: "PENDING" | "APPROVED";
  createdAt: string;
  photosCount: number;
  pendingCount: number;
  uploadedBy: { id: string; name: string | null; role: string } | null;
}

function canManageGallery(role: string | undefined) {
  return role === "ADMIN" || role === "FOTOGRAFO";
}

function CreateAlbumModal({ onClose, onCreated }: { onClose: () => void; onCreated: (id: string) => void }) {
  const [title, setTitle] = useState("");
  const [edition, setEdition] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/gallery/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, edition, description }),
    });
    if (res.ok) {
      const album = await res.json();
      onCreated(album.id);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Ocurrió un error");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(5,3,26,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: "#0A0726", border: "1px solid rgba(0,229,255,0.25)" }}
        onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-2">Nuevo álbum</h2>
        <p className="text-xs text-content/40 mb-6">Después de crearlo vas a poder subirle las fotos.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-content/65">Título</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="input-premium" placeholder="Ej: Cosplay 2027" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-content/65">Edición</label>
            <input value={edition} onChange={e => setEdition(e.target.value)}
              className="input-premium" placeholder="Ej: 2027" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-content/65">Descripción</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              className="input-premium resize-none" rows={3} placeholder="Opcional" />
          </div>
          {error && <p className="text-xs text-pink">{error}</p>}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} size="md" className="flex-1 justify-center">
              {saving ? "Creando..." : "Crear y subir fotos"}
            </Button>
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GaleriaPage() {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const router = useRouter();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetch("/api/gallery/albums")
      .then(r => r.ok ? r.json() : [])
      .then(d => { setAlbums(d); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen pt-[94px] pb-16 relative overflow-hidden bg-navy">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,229,255,0.1) 0%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none grid-overlay opacity-20" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Reveal>
            <Eyebrow color="cyan" className="mb-8 justify-center">Galería</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1
              className="font-black text-content mb-6"
              style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", letterSpacing: "-0.04em", lineHeight: 1.06 }}
            >
              Reviví las<br />ediciones pasadas.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-content/55 mx-auto" style={{ fontSize: "1.0625rem", lineHeight: 1.75, maxWidth: 440 }}>
              Fotos, momentos y recuerdos de cada edición de GeekOn!.
            </p>
          </Reveal>
          {canManageGallery(role) && (
            <Reveal delay={220}>
              <div className="mt-8">
                <Button onClick={() => setShowCreate(true)}>+ Nuevo álbum</Button>
              </div>
            </Reveal>
          )}
        </div>

        {loading ? (
          <div className="text-center text-content/40 text-sm py-20">Cargando...</div>
        ) : albums.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-content/55 mb-6">
              Todavía no hay álbumes publicados. Mientras tanto, podés ver el contenido en nuestro Instagram.
            </p>
            <Button href="https://instagram.com/geekon_uy" variant="secondary">
              Ver en Instagram
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {albums.map((album, i) => (
              <Reveal key={album.id} delay={i * 60}>
                <Link
                  href={`/galeria/${album.id}`}
                  className="group block rounded-2xl overflow-hidden relative aspect-[4/3]"
                  style={{ background: "#0A0726", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {album.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={album.coverUrl} alt={album.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-30">📷</div>
                  )}
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(5,3,26,0.92) 0%, rgba(5,3,26,0.15) 55%, transparent 100%)" }} />
                  {canManageGallery(role) && (album.status === "PENDING" || album.pendingCount > 0) && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                      style={{ color: "#F59E0B", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)" }}>
                      {album.status === "PENDING"
                        ? "Álbum pendiente"
                        : `${album.pendingCount} foto${album.pendingCount > 1 ? "s" : ""} pendiente${album.pendingCount > 1 ? "s" : ""}`}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-content truncate">{album.title}</div>
                      <div className="text-xs text-content/50 flex gap-2 mt-0.5">
                        {album.edition && <span>{album.edition}</span>}
                        {album.edition && <span>·</span>}
                        <span>{album.photosCount} fotos</span>
                      </div>
                    </div>
                    {album.uploadedBy?.role === "FOTOGRAFO" && (
                      <span className="text-xs text-cyan/80 shrink-0 truncate max-w-[45%]">
                        {album.uploadedBy.name}
                      </span>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateAlbumModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => router.push(`/galeria/${id}`)}
        />
      )}
    </div>
  );
}
