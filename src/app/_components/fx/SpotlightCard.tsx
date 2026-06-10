"use client";

/*
 * Spotlight card — 21st.dev-style mouse-tracked radial glow, kept on-palette
 * (amber on coal). CSS variables driven by gsap.quickSetter; no re-renders.
 */

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

export function SpotlightCard({
  children,
  className,
  style,
  glow = 0.13,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;

    const setX = gsap.quickSetter(el, "--mx", "px");
    const setY = gsap.quickSetter(el, "--my", "px");
    const setO = gsap.quickTo(el, "--glow", { duration: 0.4 });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setX(e.clientX - r.left);
      setY(e.clientY - r.top);
    };
    const onEnter = () => setO(glow);
    const onLeave = () => setO(0);

    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [glow]);

  return (
    <div
      ref={ref}
      className={className}
      style={
        {
          position: "relative",
          backgroundColor: "#131318",
          border: "1px solid rgba(200,184,154,0.14)",
          overflow: "hidden",
          "--mx": "50%",
          "--my": "50%",
          "--glow": 0,
          ...style,
        } as React.CSSProperties
      }
    >
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      {/* tracked amber glow — above content, never blocks it */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          opacity: "var(--glow)" as unknown as number,
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), rgba(212,135,58,0.55), transparent 65%)",
          mixBlendMode: "plus-lighter",
        }}
      />
    </div>
  );
}
