import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Color = "violet" | "cyan" | "pink";

const COLORS: Record<Color, string> = {
  violet: "bg-violet/10 border-violet/25 text-violet",
  cyan:   "bg-cyan/10 border-cyan/20 text-cyan",
  pink:   "bg-pink/10 border-pink/25 text-pink",
};

const DOTS: Record<Color, string> = {
  violet: "bg-violet",
  cyan:   "bg-cyan",
  pink:   "bg-pink",
};

interface EyebrowProps {
  color?: Color;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}

export default function Eyebrow({
  color   = "violet",
  pulse   = true,
  children,
  className,
}: EyebrowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full",
        "text-[11px] font-bold tracking-widest uppercase border",
        COLORS[color],
        className,
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          DOTS[color],
          pulse && "animate-pulse",
        )}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
