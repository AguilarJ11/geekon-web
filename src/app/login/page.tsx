"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.98v2.33A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.97 10.71a5.4 5.4 0 0 1 0-3.42V4.96H.98a9 9 0 0 0 0 8.08l2.99-2.33Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.96l2.99 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const reason       = searchParams.get("reason");
  const redirectTo   = searchParams.get("redirect") ?? "/";

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
      router.push(redirectTo);
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-navy">

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none grid-overlay opacity-60" aria-hidden="true" />

      {/* Ambient orbs */}
      <div className="absolute pointer-events-none top-[-120px] right-[10%] w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(123,47,255,0.22) 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute pointer-events-none bottom-[-80px] left-[5%] w-[380px] h-[380px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,45,155,0.15) 0%, transparent 70%)" }} aria-hidden="true" />
      <div className="absolute pointer-events-none top-[30%] left-[20%] w-[260px] h-[260px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)" }} aria-hidden="true" />

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
          <p className="text-content/55 text-sm">
            {reason === "auth-required"
              ? "Iniciá sesión para continuar"
              : "Iniciá sesión en tu cuenta"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Redirect notice */}
          {reason === "auth-required" && (
            <div className="animate-fadeIn rounded-xl px-4 py-3 text-sm font-medium text-violet bg-violet/10 border border-violet/25">
              Necesitás estar logueado para acceder a esa página.
            </div>
          )}

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
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>

          <div className="animate-fadeInUp delay-300 pt-1">
            <Button type="submit" disabled={loading} size="lg" className="w-full justify-center">
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </div>

          <div className="flex items-center gap-3 animate-fadeInUp delay-400 py-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-content/40">o continuá con</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="animate-fadeInUp delay-500">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full justify-center gap-3"
              onClick={() => signIn("google", { callbackUrl: redirectTo })}
            >
              <GoogleIcon />
              Continuar con Google
            </Button>
          </div>

          <p className="text-center text-sm animate-fadeInUp delay-600 text-content/55">
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
