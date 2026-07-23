"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";

interface Field {
  id: string;
  type: string;
  label: string;
  placeholder: string | null;
  required: boolean;
  order: number;
  options: string | null;
}

interface StandOption {
  id: string;
  label: string;
  metraje: string;
  precio: number;
}

interface Form {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  fields: Field[];
  standOptions: StandOption[];
}

const PRICE_FORMAT = new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 });

function StandOptionCard({ option, selected, onSelect }: {
  option: StandOption; selected: boolean; onSelect: () => void;
}) {
  return (
    <label
      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors"
      style={{
        background: selected ? "rgba(123,47,255,0.12)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${selected ? "rgba(123,47,255,0.5)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <div className="flex items-center gap-3">
        <input type="radio" name="standOption" checked={selected} onChange={onSelect}
          className="accent-violet" required />
        <div>
          <div className="text-sm font-semibold">{option.label}</div>
          <div className="text-xs text-content/45">{option.metraje}</div>
        </div>
      </div>
      <div className="text-sm font-bold text-violet shrink-0">{PRICE_FORMAT.format(option.precio)}</div>
    </label>
  );
}

function FormField({ field, value, onChange }: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const options: string[] = field.options ? JSON.parse(field.options) : [];
  const base = "input-premium";

  switch (field.type) {
    case "TEXTAREA":
      return (
        <textarea
          value={value} onChange={e => onChange(e.target.value)}
          className={`${base} resize-none`} rows={4}
          placeholder={field.placeholder ?? undefined}
          required={field.required}
        />
      );
    case "SELECT":
      return (
        <select value={value} onChange={e => onChange(e.target.value)}
          className={base} required={field.required}
          style={{ background: "rgba(5,3,26,0.55)", color: value ? "#EAE6FF" : "rgba(234,230,255,0.25)" }}>
          <option value="">{field.placeholder ?? "Seleccioná una opción"}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      );
    case "RADIO":
      return (
        <div className="space-y-2">
          {options.map(o => (
            <label key={o} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name={field.id} value={o} checked={value === o}
                onChange={() => onChange(o)} className="accent-violet" required={field.required} />
              <span className="text-sm text-content/80">{o}</span>
            </label>
          ))}
        </div>
      );
    case "CHECKBOX":
      return (
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={value === "true"}
            onChange={e => onChange(e.target.checked ? "true" : "")}
            className="accent-violet" required={field.required} />
          <span className="text-sm text-content/80">{field.placeholder ?? field.label}</span>
        </label>
      );
    case "DATE":
      return (
        <input type="date" value={value} onChange={e => onChange(e.target.value)}
          className={base} required={field.required}
          style={{ colorScheme: "dark" }} />
      );
    default:
      return (
        <input
          type={field.type === "EMAIL" ? "email" : field.type === "PHONE" ? "tel" : field.type === "NUMBER" ? "number" : "text"}
          value={value} onChange={e => onChange(e.target.value)}
          className={base}
          placeholder={field.placeholder ?? undefined}
          required={field.required}
        />
      );
  }
}

export default function PublicFormPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState<Form | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [standOptionId, setStandOptionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=/formularios/${slug}&reason=auth-required`);
      return;
    }
    if (status === "authenticated") {
      fetch(`/api/forms/${slug}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d) setForm(d); else setNotFound(true); });
    }
  }, [status, slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await fetch(`/api/forms/${slug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, standOptionId }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al enviar. Intentá de nuevo.");
    }
    setSubmitting(false);
  }

  if (status === "loading" || (!form && !notFound)) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center text-content/40">
        Cargando...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center text-center px-4">
        <div>
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Formulario no encontrado</h1>
          <p className="text-content/50 mb-6">Este formulario no existe o no está disponible.</p>
          <Button href="/">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)" }} />
        </div>
        <div className="relative z-10">
          <div className="text-6xl mb-6">✅</div>
          <Eyebrow color="cyan" className="justify-center mb-4">Enviado</Eyebrow>
          <h1 className="text-3xl font-black mb-3">{form!.title}</h1>
          <p className="text-content/55 mb-8 max-w-sm mx-auto">
            Recibimos tu formulario. Te vamos a contactar a <strong>{session?.user?.email}</strong> cuando lo revisemos.
          </p>
          <Button href="/">Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const sortedFields = [...(form?.fields ?? [])].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-navy px-4 py-16 relative overflow-hidden">
      <div className="absolute pointer-events-none top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]" aria-hidden="true">
        <div className="w-full h-full rounded-full"
          style={{ background: "radial-gradient(circle, rgba(123,47,255,0.15) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        <div className="mb-8">
          <Eyebrow color="violet" className="mb-4">Formulario</Eyebrow>
          <h1 className="text-3xl font-black tracking-tight mb-2">{form!.title}</h1>
          {form!.description && (
            <p className="text-content/55">{form!.description}</p>
          )}
          <div className="mt-3 text-sm text-content/40">
            Respondiendo como <span className="text-content/70 font-medium">{session?.user?.email}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}
          className="rounded-2xl p-8 space-y-6"
          style={{ background: "rgba(10,7,38,0.75)", border: "1px solid rgba(123,47,255,0.18)", backdropFilter: "blur(20px)" }}>

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm font-medium text-pink bg-pink/[0.08] border border-pink/[0.28]">
              {error}
            </div>
          )}

          {form!.standOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2 text-content/75">
                Tipo de stand
                <span className="text-pink ml-1">*</span>
              </label>
              <div className="space-y-2">
                {form!.standOptions.map(option => (
                  <StandOptionCard
                    key={option.id}
                    option={option}
                    selected={standOptionId === option.id}
                    onSelect={() => setStandOptionId(option.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {sortedFields.map(field => (
            <div key={field.id}>
              <label className="block text-sm font-medium mb-2 text-content/75">
                {field.label}
                {field.required && <span className="text-pink ml-1">*</span>}
              </label>
              <FormField
                field={field}
                value={values[field.id] ?? ""}
                onChange={v => setValues(prev => ({ ...prev, [field.id]: v }))}
              />
            </div>
          ))}

          <Button type="submit" disabled={submitting} size="lg" className="w-full justify-center mt-2">
            {submitting ? "Enviando..." : "Enviar formulario"}
          </Button>
        </form>
      </div>
    </div>
  );
}
