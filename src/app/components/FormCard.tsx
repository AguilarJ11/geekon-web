"use client";

import Link from "next/link";
import { useState } from "react";
import Tag from "@/components/ui/Tag";

interface FormCardProps {
  icon:  string;
  title: string;
  desc:  string;
  href:  string;
  color: string;
  glow:  string;
  tag:   string;
}

const TAG_COLOR_MAP: Record<string, "violet" | "cyan" | "pink" | "amber"> = {
  "#7B2FFF": "violet",
  "#00E5FF": "cyan",
  "#FF2D9B": "pink",
  "#F59E0B": "amber",
};

export default function FormCard({ icon, title, desc, href, color, glow, tag }: FormCardProps) {
  const [hovered, setHovered] = useState(false);
  const tagColor = TAG_COLOR_MAP[color] ?? "violet";

  return (
    <Link
      href={href}
      className="group block h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(11,8,36,0.75)",
        border: `1px solid ${hovered ? color + "48" : "rgba(255,255,255,0.07)"}`,
        backdropFilter: "blur(12px)",
        boxShadow: hovered
          ? `0 16px 48px ${glow}, inset 0 1px 0 ${color}18`
          : "inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: "transform 0.3s, border-color 0.25s, box-shadow 0.25s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon + Tag row */}
      <div className="flex items-start justify-between mb-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: color + "14", boxShadow: hovered ? `0 0 20px ${glow}` : "none" }}
        >
          {icon}
        </div>
        <Tag color={tagColor}>{tag}</Tag>
      </div>

      <h3 className="text-base font-bold mb-2.5 leading-snug" style={{ letterSpacing: "-0.02em" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(234,230,255,0.55)", lineHeight: 1.65 }}>
        {desc}
      </p>

      <span
        className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
        style={{ color: hovered ? color : "rgba(234,230,255,0.3)" }}
      >
        Completar formulario
        <svg
          width="13" height="13" viewBox="0 0 13 13" fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          <path d="M2.5 6.5h8M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </Link>
  );
}
