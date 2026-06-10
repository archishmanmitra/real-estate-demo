"use client";

/*
 * Giant outline-type marquee — stroke-only Cormorant, infinite loop on the
 * GSAP ticker, speed and direction react to scroll velocity (vorszk-style).
 */

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const PHRASE = "Buy — Build — Belong — Akshar — ";

export function OutlineMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let velocityBoost = 0;
    let direction = -1;
    const wrap = gsap.utils.wrap(-50, 0);

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        direction = v < 0 ? 1 : -1;
        velocityBoost = Math.min(Math.abs(v) / 3000, 4);
      },
    });

    const tick = (_t: number, dt: number) => {
      // dt is ms; base drift + scroll-velocity boost
      x += direction * (0.0035 + velocityBoost * 0.004) * dt;
      velocityBoost *= 0.94; // decay
      gsap.set(track, { xPercent: wrap(x) });
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        backgroundColor: "#0C0C0E",
        overflow: "hidden",
        padding: "clamp(2.5rem,7vh,5rem) 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        ref={trackRef}
        style={{ display: "flex", whiteSpace: "nowrap", willChange: "transform" }}
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4.5rem,11vw,11rem)",
              fontWeight: 300,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "transparent",
              WebkitTextStroke: "1px rgba(245,240,232,0.4)",
              paddingRight: "0.5em",
              flexShrink: 0,
            }}
          >
            {PHRASE}
            <em
              style={{
                fontStyle: "italic",
                color: "#D4873A",
                WebkitTextStroke: "0px",
              }}
            >
              Est. 2008&nbsp;—&nbsp;
            </em>
          </span>
        ))}
      </div>
    </div>
  );
}
