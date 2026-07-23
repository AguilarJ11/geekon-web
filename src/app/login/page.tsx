"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-navy">

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none grid-overlay opacity-60" />

      {/* Ambient orbs */}
      <div className="absolute pointer-events-none top-[-120px] right-[10%] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(123,47,255,0.22) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none bottom-[-80px] left-[5%] w-[380px] h-[380px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,45,155,0.15) 0%, transparent 70%)" }} />
      <div className="absolute pointer-events-none top-[30%] left-[20%] w-[260px] h-[260px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)" }} />

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
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="text-3xl font-black tracking-tight mb-2">
            <span className="text-violet">GEEK</span>
            <span className="text-cyan">ON</span>
            <span className="text-pink">!</span>
          </div>
          <p className="text-content/45 text-sm">Iniciá sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="animate-fadeIn rounded-xl px-4 py-3 text-sm font-medium text-pink bg-pink/[0.08] border border-pink/[0.28]">
              {error}
            </div>
          )}

          <div className="animate-fadeInUp delay-100">
            <label htmlFor="login-email" className="block text-sm font-medium mb-2 text-content/65">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-premium"
              placeholder="tu@email.com"
            />
          </div>

          <div className="animate-fadeInUp delay-200">
            <label htmlFor="login-password" className="block text-sm font-medium mb-2 text-content/65">
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-premium"
              placeholder="••••••••"
            />
          </div>

          <div className="animate-fadeInUp delay-300 pt-1">
            <Button type="submit" disabled={loading} size="lg" className="w-full justify-center">
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </div>

          <p className="text-center text-sm animate-fadeInUp delay-400 text-content/45">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="font-semibold text-violet transition-colors hover:text-cyan">
              Registrate acá
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
