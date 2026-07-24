"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

type Status = "NONE" | "PENDING_SENT" | "PENDING_RECEIVED" | "FRIENDS";

export default function FriendActionButton({
  targetUsername, initialStatus, initialFriendshipId,
}: {
  targetUsername: string;
  initialStatus: Status;
  initialFriendshipId: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [friendshipId, setFriendshipId] = useState(initialFriendshipId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendRequest() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/friends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: targetUsername }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setFriendshipId(data.id);
      setStatus(data.status === "ACCEPTED" ? "FRIENDS" : "PENDING_SENT");
    } else {
      setError(data.error ?? "No se pudo enviar la solicitud");
    }
    setLoading(false);
  }

  async function accept() {
    if (!friendshipId) return;
    setLoading(true);
    const res = await fetch(`/api/friends/${friendshipId}`, { method: "PATCH" });
    if (res.ok) setStatus("FRIENDS");
    setLoading(false);
  }

  async function removeOrCancelOrReject() {
    if (!friendshipId) return;
    setLoading(true);
    const res = await fetch(`/api/friends/${friendshipId}`, { method: "DELETE" });
    if (res.ok) { setStatus("NONE"); setFriendshipId(null); }
    setLoading(false);
  }

  if (status === "FRIENDS") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-cyan bg-cyan/10 border border-cyan/25">
          ✓ Amigos
        </span>
        <button onClick={removeOrCancelOrReject} disabled={loading}
          className="text-xs text-content/35 hover:text-pink transition-colors">
          Eliminar amistad
        </button>
      </div>
    );
  }

  if (status === "PENDING_SENT") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium px-3 py-1.5 rounded-full text-content/50 border border-white/12">
          Solicitud enviada
        </span>
        <button onClick={removeOrCancelOrReject} disabled={loading}
          className="text-xs text-content/35 hover:text-pink transition-colors">
          Cancelar
        </button>
      </div>
    );
  }

  if (status === "PENDING_RECEIVED") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-content/50">Te mandó una solicitud</span>
        <Button size="sm" onClick={accept} disabled={loading}>Aceptar</Button>
        <button onClick={removeOrCancelOrReject} disabled={loading}
          className="text-xs text-content/35 hover:text-pink transition-colors">
          Rechazar
        </button>
      </div>
    );
  }

  return (
    <div>
      <Button size="sm" onClick={sendRequest} disabled={loading}>
        {loading ? "Enviando..." : "+ Agregar amigo"}
      </Button>
      {error && <p className="text-xs text-pink mt-1.5">{error}</p>}
    </div>
  );
}
