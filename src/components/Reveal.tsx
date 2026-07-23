"use client";

import { useEffect, useRef, ReactNode, CSSProperties } from "react";

type Direction = "up" | "left" | "right" | "none";

const INIT: Record<Direction, CSSProperties> = {
  up:    { opacity: 0, transform: "translateY(48px)"  },
  left:  { opacity: 0, transform: "translateX(-48px)" },
  right: { opacity: 0, transform: "translateX(48px)"  },
  none:  { opacity: 0, transform: "none"              },
};

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
}

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  style,
  threshold = 0.12,
}: RevealProps) {
  const ref  = useRef<HTMLDivElement>(null);
  const init = INIT[direction];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity   = "1";
          el.style.transform = "translate(0,0)";
          observer.unobserve(el);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...init,
        transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
