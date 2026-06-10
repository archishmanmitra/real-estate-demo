"use client";

/*
 * Quote marquee — two infinite rows of client words drifting in opposite
 * directions on the GSAP ticker; rows ease to a crawl on hover.
 */

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

const QUOTES = [
  ["The paperwork was the surprise — there were no surprises.", "R. Mehta, Heights resident"],
  ["Three site visits, zero pressure. We signed on the fourth.", "S. & A. Kulkarni, Meadows"],
  ["Our villa was handed over two weeks early. Two weeks.", "D. Shah, Alibaug"],
  ["They walked my parents through registration line by line.", "P. Iyer, Greens"],
  ["Five years in, the stone lobby still silences guests.", "N. Fernandes, Residences"],
  ["Asked for a sea view. Got a sea view and a tax primer.", "K. Banerjee, Skyline"],
] as const;

function Row({ items, direction }: { items: typeof QUOTES; direction: 1 | -1 }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const speed = useRef(1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    const wrap = gsap.utils.wrap(-50, 0);
    const tick = (_t: number, dt: number) => {
      x += direction * 0.0022 * dt * speed.current;
      gsap.set(track, { xPercent: wrap(x) });
    };
    gsap.ticker.add(tick);

    const slow = () => gsap.to(speed, { current: 0.15, duration: 0.5 });
    const fast = () => gsap.to(speed, { current: 1, duration: 0.5 });
    track.addEventListener("mouseenter", slow);
    track.addEventListener("mouseleave", fast);
    return () => {
      gsap.ticker.remove(tick);
      track.removeEventListener("mouseenter", slow);
      track.removeEventListener("mouseleave", fast);
    };
  }, [direction]);

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        ref={trackRef}
        style={{ display: "flex", whiteSpace: "nowrap", willChange: "transform" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} style={{ display: "flex", flexShrink: 0 }}>
            {items.map(([quote, who]) => (
              <figure
                key={quote}
                style={{
                  margin: 0,
                  padding: "1.4rem 1.6rem",
                  marginRight: "1rem",
                  backgroundColor: "#131318",
                  border: "1px solid rgba(200,184,154,0.14)",
                  width: "26rem",
                  whiteSpace: "normal",
                  flexShrink: 0,
                }}
              >
                <blockquote
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.05rem",
                    fontWeight: 300,
                    fontStyle: "italic",
                    color: "#F5F0E8",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "#D4873A" }}>&ldquo;</span>
                  {quote}
                  <span style={{ color: "#D4873A" }}>&rdquo;</span>
                </blockquote>
                <figcaption
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#6B7280",
                    marginTop: "0.7rem",
                  }}
                >
                  — {who}
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuoteMarquee() {
  return (
    <section
      aria-label="What residents say"
      style={{
        backgroundColor: "#0C0C0E",
        padding: "clamp(3.5rem,9vh,6rem) 0",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "#C8B89A",
          textTransform: "uppercase",
          padding: "0 clamp(1.5rem,5vw,5rem)",
          marginBottom: "2rem",
        }}
      >
        /In their words
      </p>
      <div className="flex flex-col" style={{ gap: "1rem" }}>
        <Row items={QUOTES} direction={-1} />
        <Row items={QUOTES} direction={1} />
      </div>
    </section>
  );
}
