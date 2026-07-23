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

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    let data: { error?: string } = {};
    try {
      data = await res.json();
    } catch {
      data = { error: "Error inesperado del servidor" };
    }

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Ocurrió un error");
      return;
    }

    router.push("/login?registered=1");
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
          <p className="text-[rgba(234,230,255,0.5)] text-sm">Creá tu cuenta y unite a la comunidad</p>
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
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#05031A] border border-[rgba(123,47,255,0.3)] rounded-lg px-4 py-3 text-white placeholder-[rgba(234,230,255,0.3)] focus:outline-none focus:border-[#7B2FFF] transition-colors"
              placeholder="Tu nombre"
            />
          </div>

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
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgba(234,230,255,0.7)] mb-2">
              Confirmá tu contraseña
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
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
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p className="text-center text-sm text-[rgba(234,230,255,0.5)]">
            ¿Ya tenés cuenta?{" "}
            <Link href="/login" className="text-[#00E5FF] hover:underline font-medium">
              Iniciá sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
