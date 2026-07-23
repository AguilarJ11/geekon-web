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

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05031A] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2">
            <span className="text-[#7B2FFF]">GEEK</span>
            <span className="text-[#00E5FF]">ON</span>
            <span className="text-[#FF2D9B]">!</span>
          </h1>
          <p className="text-[rgba(234,230,255,0.5)] text-sm">Iniciá sesión en tu cuenta</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#0A0726] border border-[rgba(123,47,255,0.3)] rounded-2xl p-8 space-y-5"
        >
          {error && (
            <div className="bg-[rgba(255,45,155,0.1)] border border-[rgba(255,45,155,0.3)] text-[#FF2D9B] text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[rgba(234,230,255,0.7)] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#05031A] border border-[rgba(123,47,255,0.3)] rounded-lg px-4 py-3 text-white placeholder-[rgba(234,230,255,0.3)] focus:outline-none focus:border-[#7B2FFF] transition-colors"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgba(234,230,255,0.7)] mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#05031A] border border-[rgba(123,47,255,0.3)] rounded-lg px-4 py-3 text-white placeholder-[rgba(234,230,255,0.3)] focus:outline-none focus:border-[#7B2FFF] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#7B2FFF] to-[#A855F7] text-white font-bold py-3 rounded-lg transition-all hover:shadow-[0_4px_20px_rgba(123,47,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <p className="text-center text-sm text-[rgba(234,230,255,0.5)]">
            ¿No tenés cuenta?{" "}
            <Link href="/register" className="text-[#00E5FF] hover:underline font-medium">
              Registrate acá
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
