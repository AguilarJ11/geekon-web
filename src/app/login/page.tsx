"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "var(--navy)" }}>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none grid-overlay" style={{ opacity: 0.6 }} />

      {/* Orbs */}
      <div className="absolute pointer-events-none" style={{ top: "-120px", right: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(123,47,255,0.22) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none" style={{ bottom: "-80px", left: "5%", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,45,155,0.15) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none" style={{ top: "30%", left: "20%", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)" }} />

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
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="text-3xl font-black tracking-tight mb-2">
            <span style={{ color: "#7B2FFF" }}>GEEK</span>
            <span style={{ color: "#00E5FF" }}>ON</span>
            <span style={{ color: "#FF2D9B" }}>!</span>
          </div>
          <p style={{ color: "var(--dim)", fontSize: "0.875rem" }}>
            Iniciá sesión en tu cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              className="animate-fadeIn rounded-xl px-4 py-3 text-sm font-medium"
              style={{ background: "rgba(255,45,155,0.08)", border: "1px solid rgba(255,45,155,0.28)", color: "#FF2D9B" }}
            >
              {error}
            </div>
          )}

          <div className="animate-fadeInUp delay-100">
            <label className="block text-sm font-medium mb-2" style={{ color: "rgba(234,230,255,0.65)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-premium"
              placeholder="tu@email.com"
            />
          </div>

          <div className="animate-fadeInUp delay-200">
            <label className="block text-sm font-medium mb-2" style={{ color: "rgba(234,230,255,0.65)" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-premium"
              placeholder="••••••••"
            />
          </div>

          <div className="animate-fadeInUp delay-300 pt-1">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </div>

          <p className="text-center text-sm animate-fadeInUp delay-400" style={{ color: "var(--dim)" }}>
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="font-semibold transition-colors hover:text-[#00E5FF]" style={{ color: "#7B2FFF" }}>
              Registrate acá
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
