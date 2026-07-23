import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Color = "violet" | "cyan" | "pink" | "amber";

const COLORS: Record<Color, string> = {
  violet: "bg-violet/10 text-violet border-violet/20",
  cyan:   "bg-cyan/10 text-cyan border-cyan/20",
  pink:   "bg-pink/10 text-pink border-pink/20",
  amber:  "bg-amber/10 text-amber border-amber/20",
};

interface TagProps {
  color?: Color;
  children: ReactNode;
  className?: string;
}

export default function Tag({ color = "violet", children, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        COLORS[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
