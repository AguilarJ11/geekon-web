"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import AdminTabs from "@/components/admin/AdminTabs";

interface Album {
  id: string;
  title: string;
  edition: string | null;
  status: "PENDING" | "APPROVED";
  coverUrl: string | null;
  photosCount: number;
  pendingCount: number;
  createdAt: string;
}

export default function AdminGaleriaPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery/albums")
      .then(r => r.ok ? r.json() : [])
      .then(d => { setAlbums(d); setLoading(false); });
  }, []);

  async function approveAlbum(id: string) {
    setApprovingId(id);
    const res = await fetch(`/api/gallery/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "APPROVED" }),
    });
    if (res.ok) {
      setAlbums(list => list.map(a => a.id === id ? { ...a, status: "APPROVED", photosCount: a.photosCount + a.pendingCount, pendingCount: 0 } : a));
    }
    setApprovingId(null);
  }

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-12">
      <div className="max-w-4xl mx-auto">
        <Eyebrow color="violet">Admin</Eyebrow>
        <h1 className="text-4xl font-black mt-3 tracking-tight">Galería</h1>
        <p className="text-content/55 mt-2 mb-2">
          Aprobá álbumes completos o entrá a cada uno para rechazar fotos puntuales.
        </p>

        <AdminTabs />

        {loading ? (
          <div className="text-content/40 text-sm">Cargando...</div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 text-content/35">
            <div className="text-5xl mb-4">📷</div>
            <p className="font-medium">Todavía no hay álbumes creados.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {albums.map(album => (
              <div key={album.id} className="rounded-xl p-5 flex items-center gap-4"
                style={{ background: "#0A0726", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-14 h-14 rounded-lg shrink-0 overflow-hidden flex items-center justify-center text-xl"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  {album.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={album.coverUrl} alt="" className="w-full h-full object-cover" />
                  ) : "📷"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <span className="font-semibold truncate">{album.title}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      album.status === "APPROVED"
                        ? "text-cyan bg-cyan/10 border-cyan/25"
                        : "text-amber bg-amber/10 border-amber/25"
                    }`}>
                      {album.status === "APPROVED" ? "Aprobado" : "Pendiente"}
                    </span>
                  </div>
                  <div className="text-xs text-content/40 flex gap-3">
                    {album.edition && <span>{album.edition}</span>}
                    <span>{album.photosCount} fotos aprobadas</span>
                    {album.pendingCount > 0 && <span className="text-amber">{album.pendingCount} pendientes</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/galeria/${album.id}`}>
                    <Button variant="secondary" size="sm">Revisar fotos</Button>
                  </Link>
                  {album.status === "PENDING" && (
                    <Button size="sm" onClick={() => approveAlbum(album.id)} disabled={approvingId === album.id}>
                      {approvingId === album.id ? "Aprobando..." : "Aprobar álbum"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
