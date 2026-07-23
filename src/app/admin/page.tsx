"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import AdminTabs from "@/components/admin/AdminTabs";

interface Stats {
  users: number;
  admins: number;
  forms: number;
  publishedForms: number;
  pendingSubmissions: number;
}

function Card({ href, icon, title, description, stat }: {
  href: string; icon: string; title: string; description: string; stat?: string;
}) {
  return (
    <Link href={href}
      className="group rounded-2xl p-6 flex flex-col gap-3 transition-all hover:-translate-y-0.5"
      style={{ background: "#0A0726", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-start justify-between">
        <div className="text-3xl">{icon}</div>
        {stat && (
          <div className="text-right">
            <div className="text-2xl font-black text-content">{stat}</div>
          </div>
        )}
      </div>
      <div>
        <h2 className="font-semibold text-lg group-hover:text-violet transition-colors">{title}</h2>
        <p className="text-sm text-content/50 mt-1">{description}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.ok ? r.json() : null)
      .then(setStats);
  }, []);

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-12">
      <div className="max-w-4xl mx-auto">
        <Eyebrow color="violet">Admin</Eyebrow>
        <h1 className="text-4xl font-black mt-3 tracking-tight">Panel de administración</h1>
        <p className="text-content/55 mt-2 mb-2">Gestioná formularios, usuarios y todo lo demás desde acá.</p>

        <AdminTabs />

        {stats && stats.pendingSubmissions > 0 && (
          <div className="rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>
            ⏳ Hay {stats.pendingSubmissions} postulación{stats.pendingSubmissions === 1 ? "" : "es"} pendiente{stats.pendingSubmissions === 1 ? "" : "s"} de revisión.
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Card
            href="/admin/formularios"
            icon="📋"
            title="Formularios"
            description="Creá formularios de participación, editá sus campos y revisá postulaciones."
            stat={stats ? `${stats.publishedForms}/${stats.forms}` : undefined}
          />
          <Card
            href="/admin/usuarios"
            icon="👥"
            title="Usuarios"
            description="Gestioná los usuarios registrados, asigná o quitá el rol de administrador."
            stat={stats ? String(stats.users) : undefined}
          />
        </div>
      </div>
    </div>
  );
}
