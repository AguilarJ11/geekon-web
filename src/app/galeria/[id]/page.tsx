"use client";

import { useEffect, useRef, useState, use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";

interface Photo {
  id: string;
  url: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason: string | null;
}

interface Album {
  id: string;
  title: string;
  edition: string | null;
  description: string | null;
  status: "PENDING" | "APPROVED";
  photos: Photo[];
  uploadedBy: { id: string; username: string | null; name: string | null; role: string } | null;
}

function canManageGallery(role: string | undefined) {
  return role === "ADMIN" || role === "FOTOGRAFO";
}

function RejectPhotoModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(5,3,26,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: "#0A0726", border: "1px solid rgba(255,45,155,0.3)" }}
        onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-6">Rechazar foto</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-content/65">Motivo del rechazo</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)}
              className="input-premium resize-none" rows={3}
              placeholder="Ej: Foto borrosa, contenido repetido..." required autoFocus />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" size="md" className="flex-1 justify-center">
              Rechazar
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

export default function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [album, setAlbum] = useState<Album | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [deletingAlbum, setDeletingAlbum] = useState(false);
  const [rejectingPhotoId, setRejectingPhotoId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/gallery/albums/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setAlbum(d); else setNotFound(true); });
  }, [id]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const form = new FormData();
    Array.from(files).forEach(f => form.append("photos", f));
    const res = await fetch(`/api/gallery/albums/${id}/photos`, { method: "POST", body: form });
    if (res.ok) {
      const newPhotos: Photo[] = await res.json();
      setAlbum(a => a ? { ...a, photos: [...a.photos, ...newPhotos] } : a);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "No se pudieron subir las fotos");
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function deletePhoto(photoId: string) {
    if (!confirm("¿Eliminar esta foto?")) return;
    const res = await fetch(`/api/gallery/photos/${photoId}`, { method: "DELETE" });
    if (res.ok) {
      setAlbum(a => a ? { ...a, photos: a.photos.filter(p => p.id !== photoId) } : a);
    }
  }

  async function rejectPhoto(photoId: string, reason: string) {
    const res = await fetch(`/api/gallery/photos/${photoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED", reason }),
    });
    if (res.ok) {
      setAlbum(a => a ? { ...a, photos: a.photos.map(p => p.id === photoId ? { ...p, status: "REJECTED", rejectionReason: reason } : p) } : a);
    }
    setRejectingPhotoId(null);
  }

  async function approveAlbum() {
    setApproving(true);
    const res = await fetch(`/api/gallery/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" }),
    });
    if (res.ok) {
      setAlbum(a => a ? {
        ...a,
        status: "APPROVED",
        photos: a.photos.map(p => p.status === "PENDING" ? { ...p, status: "APPROVED" } : p),
      } : a);
    }
    setApproving(false);
  }

  async function deleteAlbum() {
    if (!confirm(`¿Eliminar el álbum "${album?.title}" y todas sus fotos?`)) return;
    setDeletingAlbum(true);
    const res = await fetch(`/api/gallery/albums/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/galeria");
    } else {
      setDeletingAlbum(false);
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-4">📷</div>
          <h1 className="text-2xl font-bold mb-2">Álbum no encontrado</h1>
          <Button href="/galeria">Volver a la galería</Button>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center text-content/40">
        Cargando...
      </div>
    );
  }

  const canManage = canManageGallery(role);

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-16">
      <div className="max-w-6xl mx-auto">
        <Link href="/galeria" className="text-xs text-content/40 hover:text-content/70 transition-colors">
          ← Volver a la galería
        </Link>

        <div className="flex items-start justify-between flex-wrap gap-4 mt-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Eyebrow color="cyan">{album.edition ?? "Galería"}</Eyebrow>
              {canManage && (
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  album.status === "APPROVED"
                    ? "text-cyan bg-cyan/10 border-cyan/25"
                    : "text-amber bg-amber/10 border-amber/25"
                }`}>
                  {album.status === "APPROVED" ? "Álbum aprobado" : "Álbum pendiente"}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-black tracking-tight">{album.title}</h1>
            {album.description && <p className="text-content/55 mt-2 max-w-lg">{album.description}</p>}
            {album.uploadedBy?.role === "FOTOGRAFO" && album.uploadedBy.username && (
              <div className="mt-3 text-sm">
                <span className="text-content/40">Autor: </span>
                <Link href={`/perfil/${album.uploadedBy.username}`} className="text-cyan/80 hover:text-cyan transition-colors font-medium">
                  {album.uploadedBy.name ?? "Fotógrafo"}
                </Link>
              </div>
            )}
          </div>

          {canManage && (
            <div className="shrink-0 text-right">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={e => handleUpload(e.target.files)}
                />
                <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} size="sm">
                  {uploading ? "Subiendo..." : "+ Subir fotos"}
                </Button>
                {role === "ADMIN" && album.status === "PENDING" && (
                  <Button onClick={approveAlbum} disabled={approving} size="sm">
                    {approving ? "Aprobando..." : "Aprobar álbum"}
                  </Button>
                )}
                <Button onClick={deleteAlbum} disabled={deletingAlbum} variant="secondary" size="sm">
                  Eliminar álbum
                </Button>
              </div>
              {role !== "ADMIN" && (
                <p className="text-xs text-content/35 mt-2 max-w-[220px]">
                  El álbum y sus fotos quedan pendientes hasta que un administrador los apruebe.
                </p>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-pink mb-6">{error}</p>}

        {album.photos.length === 0 ? (
          <div className="text-center py-20 text-content/35">
            <div className="text-5xl mb-4">📷</div>
            <p className="font-medium">Este álbum todavía no tiene fotos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {album.photos.map(photo => (
              <div key={photo.id} className="group relative rounded-xl overflow-hidden aspect-square"
                style={{ background: "#0A0726" }}>
                {photo.status === "REJECTED" ? (
                  // La imagen ya se borró de Cloudinary al rechazarla: no hay nada que mostrar.
                  <div className="w-full h-full flex items-center justify-center text-2xl opacity-25">🚫</div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                    style={{ opacity: photo.status === "APPROVED" ? 1 : 0.45 }}
                    onClick={() => setLightbox(photo.url)}
                  />
                )}

                {photo.status !== "APPROVED" && (
                  <span
                    className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    title={photo.status === "REJECTED" ? photo.rejectionReason ?? undefined : undefined}
                    style={photo.status === "PENDING"
                      ? { color: "#F59E0B", background: "rgba(245,158,11,0.18)", border: "1px solid rgba(245,158,11,0.4)" }
                      : { color: "#FF2D9B", background: "rgba(255,45,155,0.15)", border: "1px solid rgba(255,45,155,0.4)" }}>
                    {photo.status === "PENDING" ? "Pendiente" : "Rechazada"}
                  </span>
                )}

                {canManage && (
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(5,3,26,0.85)", border: "1px solid rgba(255,45,155,0.4)" }}
                    aria-label="Eliminar foto"
                  >
                    ✕
                  </button>
                )}

                {photo.status === "REJECTED" && photo.rejectionReason && (
                  <p className="absolute bottom-1 left-1 right-1 text-[10px] text-pink/80 leading-tight line-clamp-2 px-1">
                    {photo.rejectionReason}
                  </p>
                )}

                {role === "ADMIN" && photo.status === "PENDING" && (
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setRejectingPhotoId(photo.id)}
                      className="w-full text-[11px] font-bold py-1.5 rounded-lg"
                      style={{ background: "rgba(255,45,155,0.85)", color: "#05031A" }}
                    >
                      Rechazar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 cursor-zoom-out"
          style={{ background: "rgba(3,1,16,0.95)" }}
          onClick={() => setLightbox(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] rounded-lg object-contain" />
        </div>
      )}

      {rejectingPhotoId && (
        <RejectPhotoModal
          onClose={() => setRejectingPhotoId(null)}
          onConfirm={(reason) => rejectPhoto(rejectingPhotoId, reason)}
        />
      )}
    </div>
  );
}
