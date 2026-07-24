"use client";

import { useRef, useState, useEffect } from "react";
import FormCard from "./FormCard";

interface CardData {
  icon: string;
  title: string;
  desc: string;
  href: string;
  color: string;
  glow: string;
  tag: string;
}

export default function FormCardsCarousel({ cards }: { cards: CardData[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateArrows() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  function scrollByCard(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 280) + 16;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "none" }}
      >
        {cards.map(card => (
          <div key={card.href} data-card className="snap-start shrink-0 w-[260px] sm:w-[280px]">
            <FormCard {...card} />
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scrollByCard(-1)}
          aria-label="Ver categorías anteriores"
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-105"
          style={{ background: "rgba(11,8,36,0.9)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scrollByCard(1)}
          aria-label="Ver más categorías"
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full items-center justify-center transition-all hover:scale-105"
          style={{ background: "rgba(11,8,36,0.9)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
