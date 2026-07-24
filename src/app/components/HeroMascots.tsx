"use client";

import { useEffect, useRef } from "react";

const SCROLL_FACTOR = 0.35;
const BOTTOM_BUFFER = 16;
const REACH_RATIO = 0.45; // no llegan hasta abajo del todo, se quedan a mitad de camino

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

    // Tope dinámico: la distancia hasta el borde inferior del hero (donde
    // el overflow-hidden las corta igual, pero así llegan justo hasta ahí
    // en vez de quedar a mitad de camino).
    function maxOffsetFor(el: HTMLDivElement | null) {
      if (!el) return 0;
      const section = el.closest("section");
      if (!section) return 0;
      const fullDistance = Math.max(0, section.clientHeight - el.offsetTop - el.offsetHeight - BOTTOM_BUFFER);
      return fullDistance * REACH_RATIO;
    }

    function onScroll() {
      const scrollOffset = getScrollY() * SCROLL_FACTOR;
      if (gonRef.current) {
        const offset = Math.min(scrollOffset, maxOffsetFor(gonRef.current));
        gonRef.current.style.transform = `translateY(${offset}px)`;
      }
      if (eekRef.current) {
        const offset = Math.min(scrollOffset, maxOffsetFor(eekRef.current));
        eekRef.current.style.transform = `translateY(${offset}px)`;
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true });
    document.body.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll);
      document.body.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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
