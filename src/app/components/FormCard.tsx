"use client";

import Link from "next/link";
import { useState } from "react";

interface FormCardProps {
  icon: string;
  title: string;
  desc: string;
  href: string;
  color: string;
  glow: string;
  tag: string;
}

export default function FormCard({ icon, title, desc, href, color, glow, tag }: FormCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      className="group block rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2"
      style={{
        background: "rgba(13,10,42,0.75)",
        border: `1px solid ${hovered ? color + "48" : "rgba(123,47,255,0.14)"}`,
        backdropFilter: "blur(8px)",
        boxShadow: hovered ? `0 16px 48px ${glow}, inset 0 1px 0 ${color}18` : "none",
        transition: "transform 0.3s, border-color 0.25s, box-shadow 0.25s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4"
        style={{ background: color + "15", color, border: `1px solid ${color}30` }}
      >
        {tag}
      </span>

      <div
        className="text-3xl mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: color + "14" }}
      >
        {icon}
      </div>

      <h3 className="text-base font-bold mb-2">{title}</h3>
      <p className="text-sm mb-5" style={{ color: "var(--dim)", lineHeight: 1.65 }}>{desc}</p>

      <span className="text-sm font-semibold flex items-center gap-1.5" style={{ color }}>
        Completar formulario
        <svg
          width="13" height="13" viewBox="0 0 13 13" fill="none"
          style={{ transition: "transform 0.2s", transform: hovered ? "translateX(3px)" : "none" }}
        >
          <path d="M2.5 6.5h8M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </Link>
  );
}
