"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

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
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden" style={{ background: "var(--navy)" }}>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none grid-overlay" style={{ opacity: 0.6 }} />

      {/* Orbs */}
      <div className="absolute pointer-events-none" style={{ top: "-100px", right: "8%", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "-100px", left: "8%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(123,47,255,0.2) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none" style={{ top: "40%", right: "25%", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,45,155,0.1) 0%, transparent 70%)" }} />

      {/* Card */}
      <div
        className="relative z-10 w-full animate-scaleIn"
        style={{
          maxWidth: "460px",
          background: "rgba(10,7,38,0.72)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(123,47,255,0.2)",
          borderRadius: "24px",
          padding: "2.5rem",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-7 animate-fadeInUp">
          <div className="text-3xl font-black tracking-tight mb-2">
            <span style={{ color: "#7B2FFF" }}>GEEK</span>
            <span style={{ color: "#00E5FF" }}>ON</span>
            <span style={{ color: "#FF2D9B" }}>!</span>
          </div>
          <p style={{ color: "var(--dim)", fontSize: "0.875rem" }}>
            Creá tu cuenta y unite a la comunidad
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="animate-fadeIn rounded-xl px-4 py-3 text-sm font-medium"
              style={{ background: "rgba(255,45,155,0.08)", border: "1px solid rgba(255,45,155,0.28)", color: "#FF2D9B" }}
            >
              {error}
            </div>
          )}

          <div className="animate-fadeInUp delay-100">
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgba(234,230,255,0.65)" }}>Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-premium" placeholder="Tu nombre" />
          </div>

          <div className="animate-fadeInUp delay-200">
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgba(234,230,255,0.65)" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-premium" placeholder="tu@email.com" />
          </div>

          <div className="animate-fadeInUp delay-300">
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgba(234,230,255,0.65)" }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-premium" placeholder="Mínimo 8 caracteres" />
          </div>

          <div className="animate-fadeInUp delay-400">
            <label className="block text-sm font-medium mb-1.5" style={{ color: "rgba(234,230,255,0.65)" }}>Confirmá tu contraseña</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="input-premium" placeholder="••••••••" />
          </div>

          <div className="animate-fadeInUp delay-500 pt-1">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </div>

          <p className="text-center text-sm animate-fadeInUp delay-600" style={{ color: "var(--dim)" }}>
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="font-semibold transition-colors hover:text-[#7B2FFF]" style={{ color: "#00E5FF" }}>
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
