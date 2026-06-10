"use client";

/*
 * Values — pinned horizontal scroll (GSAP). The section pins for 300vh while
 * four value panels travel sideways; each panel's giant word slides at its
 * own rate for internal parallax. Vertical stack on mobile / reduced motion.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motionSafe } from "@/lib/gsap";

const VALUES = [
  ["01", "Clarity", "Every paper, every clause, explained before you sign. No fine print theatre."],
  ["02", "Craft", "Stone that ages well. Floor plans that still make sense in twenty years."],
  ["03", "Permanence", "Akshar means indestructible. We build to be the last word at an address."],
  ["04", "Care", "From first site visit to final registration — one team, four business hours."],
] as const;

export function ValuesScroll() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionSafe()) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = ref.current?.querySelector<HTMLElement>(".values-track");
        if (!track) return;

        const scrollAmount = () => track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: () => -scrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: () => `+=${scrollAmount()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // internal parallax — each giant word drifts against its panel
        gsap.utils.toArray<HTMLElement>(".value-word").forEach((word) => {
          gsap.fromTo(
            word,
            { xPercent: 12 },
            {
              xPercent: -12,
              ease: "none",
              scrollTrigger: {
                trigger: ref.current,
                start: "top top",
                end: () => `+=${scrollAmount()}`,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });

      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      aria-label="What Akshar holds"
      style={{
        backgroundColor: "#131318",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="values-track flex flex-col md:flex-row"
        style={{ willChange: "transform" }}
      >
        {VALUES.map(([num, word, body]) => (
          <div
            key={num}
            className="value-panel flex flex-col justify-center md:h-screen md:w-screen md:flex-shrink-0"
            style={{
              padding: "clamp(4rem,10vh,6rem) clamp(1.5rem,6vw,7rem)",
              position: "relative",
            }}
          >
            {/* ambient amber bloom */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background:
                  "radial-gradient(600px circle at 30% 70%, rgba(212,135,58,0.07), transparent 70%)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                color: "#D4873A",
                textTransform: "uppercase",
              }}
            >
              /{num} — Value
            </span>
            <h3
              className="value-word"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem,12vw,11rem)",
                fontWeight: 300,
                color: "#F5F0E8",
                lineHeight: 1,
                margin: "1rem 0",
                whiteSpace: "nowrap",
              }}
            >
              {word}
              <em style={{ fontStyle: "italic", color: "#D4873A" }}>.</em>
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.95rem",
                color: "rgba(200,184,154,0.75)",
                lineHeight: 1.7,
                maxWidth: "26rem",
                margin: 0,
              }}
            >
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
