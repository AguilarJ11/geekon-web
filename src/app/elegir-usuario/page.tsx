"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Button from "@/components/ui/Button";

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

function ElegirUsuarioForm() {
  const { update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/";

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const normalized = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
  const valid = USERNAME_RE.test(normalized);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);
    setError("");

    const res = await fetch("/api/perfil/username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: normalized }),
    });

    if (res.ok) {
      await update();
      router.push(redirectTo);
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Ocurrió un error");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-navy">
      <div className="absolute inset-0 pointer-events-none grid-overlay opacity-60" aria-hidden="true" />
      <div className="absolute pointer-events-none top-[-120px] right-[10%] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(123,47,255,0.22) 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute pointer-events-none bottom-[-80px] left-[5%] w-[380px] h-[380px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)" }} aria-hidden="true" />

      <div
        className="relative z-10 w-full max-w-[460px] animate-scaleIn rounded-3xl p-10"
        style={{
          background: "rgba(10,7,38,0.72)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(123,47,255,0.2)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="text-center mb-8 animate-fadeInUp">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/geekon-logo.webp" alt="GeekOn!" className="h-16 w-auto mx-auto mb-2" />
          <h1 className="text-xl font-bold mt-4 mb-1">Elegí tu nombre de usuario</h1>
          <p className="text-content/55 text-sm">
            Es único y va a ser la dirección de tu perfil público. No hace falta que sea tu nombre real.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-content/65">Nombre de usuario</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-content/35 text-sm">@</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input-premium"
                style={{ paddingLeft: "1.75rem" }}
                placeholder="tu_usuario"
                autoFocus
                required
              />
            </div>
            <p className="text-xs text-content/35 mt-1.5">
              3 a 20 caracteres: minúsculas, números y guion bajo.
            </p>
          </div>

          {error && <p className="text-xs text-pink">{error}</p>}

          <Button type="submit" disabled={!valid || saving} size="lg" className="w-full justify-center">
            {saving ? "Guardando..." : "Continuar"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function ElegirUsuarioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center text-content/40">
        Cargando...
      </div>
    }>
      <ElegirUsuarioForm />
    </Suspense>
  );
}
