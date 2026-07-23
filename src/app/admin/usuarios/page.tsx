"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import AdminTabs from "@/components/admin/AdminTabs";

interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  _count: { ownedForms: number; submissions: number; badges: number };
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const selfId = (session?.user as { id?: string } | undefined)?.id;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("USER");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (search: string) => {
    setLoading(true);
    const res = await fetch(`/api/admin/users${search ? `?q=${encodeURIComponent(search)}` : ""}`);
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(""); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
  }, [q, load]);

  function openEdit(user: AdminUser) {
    setEditing(user);
    setEditName(user.name ?? "");
    setEditRole(user.role);
    setError("");
  }

  async function saveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    const res = await fetch(`/api/admin/users/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, role: editRole }),
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(list => list.map(u => u.id === editing.id ? updated : u));
      setEditing(null);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Ocurrió un error");
    }
    setSaving(false);
  }

  async function deleteUser(user: AdminUser) {
    if (!confirm(`¿Eliminás la cuenta de ${user.name ?? user.email}? Se borran sus postulaciones e insignias.`)) return;
    setBusyId(user.id);
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers(list => list.filter(u => u.id !== user.id));
    } else {
      const d = await res.json().catch(() => ({}));
      alert(d.error ?? "No se pudo eliminar el usuario.");
    }
    setBusyId(null);
  }

  return (
    <div className="min-h-screen bg-navy px-6 pt-[94px] pb-12">
      <div className="max-w-4xl mx-auto">
        <Eyebrow color="violet">Admin</Eyebrow>
        <h1 className="text-4xl font-black mt-3 tracking-tight">Usuarios</h1>
        <p className="text-content/55 mt-2 mb-2">Gestioná las cuentas registradas y sus roles.</p>

        <AdminTabs />

        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          className="input-premium mb-6"
          placeholder="Buscar por nombre o email..."
        />

        {loading ? (
          <div className="text-content/40 text-sm">Cargando...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-content/35">
            <div className="text-5xl mb-4">👥</div>
            <p className="font-medium">No se encontraron usuarios.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="rounded-xl p-5 flex items-center gap-4"
                style={{ background: "#0A0726", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                  style={{
                    background: user.image
                      ? `center/cover no-repeat url(${user.image})`
                      : "linear-gradient(135deg, #7B2FFF 0%, #FF2D9B 100%)",
                  }}>
                  {!user.image && (user.name?.[0]?.toUpperCase() ?? "U")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <span className="font-semibold truncate">{user.name ?? "Sin nombre"}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      user.role === "ADMIN"
                        ? "text-amber bg-amber/10 border-amber/25"
                        : "text-content/40 bg-white/5 border-white/10"
                    }`}>
                      {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                    </span>
                    {user.id === selfId && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border text-cyan bg-cyan/10 border-cyan/20">
                        Vos
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-content/40 truncate">{user.email}</div>
                  <div className="text-xs text-content/40 flex gap-3 mt-1">
                    <span>{user._count.ownedForms} formularios</span>
                    <span>·</span>
                    <span>{user._count.submissions} postulaciones</span>
                    <span>·</span>
                    <span>{user._count.badges} insignias</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(user)}>
                    Editar
                  </Button>
                  <button
                    onClick={() => deleteUser(user)}
                    disabled={user.id === selfId || busyId === user.id}
                    className="text-xs text-pink/60 hover:text-pink transition-colors px-2 py-1 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(5,3,26,0.85)", backdropFilter: "blur(12px)" }}
          onClick={() => setEditing(null)}>
          <div className="w-full max-w-sm rounded-2xl p-8"
            style={{ background: "#0A0726", border: "1px solid rgba(123,47,255,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-6">Editar usuario</h2>
            <form onSubmit={saveUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-content/65">Nombre</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="input-premium" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-content/65">Rol</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value)}
                  className="input-premium" disabled={editing.id === selfId}>
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                {editing.id === selfId && (
                  <p className="text-xs text-content/35 mt-1.5">No podés cambiar tu propio rol.</p>
                )}
              </div>
              <p className="text-xs text-content/35">{editing.email}</p>
              {error && <p className="text-xs text-pink">{error}</p>}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving} size="md" className="flex-1 justify-center">
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
                <Button variant="secondary" size="md" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
