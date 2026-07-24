"use client";

import { useEffect, useRef } from "react";

const MAX_OFFSET = 80;
const SCROLL_FACTOR = 0.18;

export default function HeroMascots() {
  const gonRef = useRef<HTMLDivElement>(null);
  const eekRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Según el layout, lo que scrollea puede ser window, <html> o <body>
    // (acá body tiene overflow-y: auto) — se toma el máximo de los tres.
    function getScrollY() {
      return Math.max(
        window.scrollY || 0,
        document.documentElement.scrollTop || 0,
        document.body.scrollTop || 0,
      );
    }
    function onScroll() {
      const offset = Math.min(getScrollY() * SCROLL_FACTOR, MAX_OFFSET);
      const t = `translateY(${offset}px)`;
      if (gonRef.current) gonRef.current.style.transform = t;
      if (eekRef.current) eekRef.current.style.transform = t;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });
    document.body.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
      document.body.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={gonRef}
        className="hidden 2xl:block absolute pointer-events-none select-none"
        style={{ left: "80px", top: "130px", width: "280px", willChange: "transform" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascots/gon.webp"
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            filter: "drop-shadow(0 20px 60px rgba(123,47,255,0.35))",
            animation: "floatGon 6s ease-in-out infinite",
          }}
        />
      </div>
      <div
        ref={eekRef}
        className="hidden 2xl:block absolute pointer-events-none select-none"
        style={{ right: "90px", top: "110px", width: "220px", willChange: "transform" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/mascots/eek.webp"
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            filter: "drop-shadow(0 20px 60px rgba(0,229,255,0.3))",
            animation: "floatEek 5.5s ease-in-out infinite",
          }}
        />
      </div>
    </>
  );
}
