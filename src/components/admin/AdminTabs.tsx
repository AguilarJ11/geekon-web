"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin",            label: "Panel"       },
  { href: "/admin/formularios", label: "Formularios" },
  { href: "/admin/usuarios",    label: "Usuarios"    },
];

export default function AdminTabs() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="flex items-center gap-1 mb-8 border-b border-white/[0.07]">
      {TABS.map(tab => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
            isActive(tab.href)
              ? "border-violet text-content"
              : "border-transparent text-content/45 hover:text-content/75",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
