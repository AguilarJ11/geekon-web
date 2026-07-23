"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }
    if (password.length < 8)  { setError("La contraseña debe tener al menos 8 caracteres"); return; }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    let data: { error?: string } = {};
    try { data = await res.json(); } catch { data = { error: "Error inesperado del servidor" }; }
    setLoading(false);

    if (!res.ok) { setError(data.error || "Ocurrió un error"); return; }
    router.push("/login?registered=1");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden bg-navy">

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none grid-overlay opacity-60" />

      {/* Ambient orbs */}
      <div className="absolute pointer-events-none top-[-100px] right-[8%] w-[480px] h-[480px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none bottom-[-100px] left-[8%] w-[400px] h-[400px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(123,47,255,0.2) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none top-[40%] right-[25%] w-[240px] h-[240px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,45,155,0.1) 0%, transparent 70%)" }} />

      {/* Card */}
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
        {/* Logo */}
        <div className="text-center mb-7 animate-fadeInUp">
          <div className="text-3xl font-black tracking-tight mb-2">
            <span className="text-violet">GEEK</span>
            <span className="text-cyan">ON</span>
            <span className="text-pink">!</span>
          </div>
          <p className="text-content/45 text-sm">Creá tu cuenta y unite a la comunidad</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="animate-fadeIn rounded-xl px-4 py-3 text-sm font-medium text-pink bg-pink/[0.08] border border-pink/[0.28]">
              {error}
            </div>
          )}

          <div className="animate-fadeInUp delay-100">
            <label htmlFor="reg-name" className="block text-sm font-medium mb-1.5 text-content/65">Nombre</label>
            <input id="reg-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-premium" placeholder="Tu nombre" />
          </div>

          <div className="animate-fadeInUp delay-200">
            <label htmlFor="reg-email" className="block text-sm font-medium mb-1.5 text-content/65">Email</label>
            <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-premium" placeholder="tu@email.com" />
          </div>

          <div className="animate-fadeInUp delay-300">
            <label htmlFor="reg-password" className="block text-sm font-medium mb-1.5 text-content/65">Contraseña</label>
            <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-premium" placeholder="Mínimo 8 caracteres" />
          </div>

          <div className="animate-fadeInUp delay-400">
            <label htmlFor="reg-confirm" className="block text-sm font-medium mb-1.5 text-content/65">Confirmá tu contraseña</label>
            <input id="reg-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="input-premium" placeholder="••••••••" />
          </div>

          <div className="animate-fadeInUp delay-500 pt-1">
            <Button type="submit" disabled={loading} size="lg" className="w-full justify-center">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </div>

          <p className="text-center text-sm animate-fadeInUp delay-600 text-content/45">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="font-semibold text-cyan transition-colors hover:text-violet">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
