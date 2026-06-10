"use client";

/*
 * Custom cursor — amber dot + lagging difference-blend ring.
 * GSAP quickTo (no setState per frame). Ring swells over interactive elements.
 * Fine pointers only; respects prefers-reduced-motion; native cursor stays.
 */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "expo.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "expo.out" });

    let shown = false;
    const onMove = (e: MouseEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const interactive = (e.target as Element | null)?.closest?.(
        "a, button, [role='button'], [role='link'], input, select, textarea, [data-cursor]"
      );
      gsap.to(ring, {
        scale: interactive ? 2.4 : 1,
        opacity: interactive ? 0.9 : 1,
        duration: 0.35,
        ease: "expo.out",
      });
      gsap.to(dot, {
        scale: interactive ? 0.4 : 1,
        duration: 0.35,
        ease: "expo.out",
      });
    };

    const onLeave = () => {
      shown = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.25 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "#D4873A",
          pointerEvents: "none",
          zIndex: 400,
          opacity: 0,
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          border: "1px solid #F5F0E8",
          mixBlendMode: "difference",
          pointerEvents: "none",
          zIndex: 400,
          opacity: 0,
        }}
      />
    </>
  );
}
