"use client";

/*
 * Manifesto — vorszk-style statement section. Words brighten from steel to
 * ivory as you scroll (GSAP scrub), italic amber emphasis words in Cormorant.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motionSafe } from "@/lib/gsap";

type Word = { text: string; em?: boolean };

const LINES: Word[][] = [
  [{ text: "We" }, { text: "don't" }, { text: "sell" }, { text: "square" }, { text: "feet." }],
  [{ text: "We" }, { text: "build" }, { text: "permanence.", em: true }],
];

const BODY =
  "Akshar means indestructible. Every plot we source, every tower we raise, every registration we walk a family through — it is built to be the last word.";

export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionSafe()) return;

      gsap.fromTo(
        ".mword",
        { opacity: 0.16, filter: "blur(2px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            end: "center 42%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );

      gsap.from(".manifesto-body", {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 50%", once: true },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "#0C0C0E",
        padding: "clamp(6rem,14vh,10rem) clamp(1.5rem,5vw,5rem)",
        position: "relative",
      }}
    >
      <style>{`
        @media (max-width: 639px) {
          .manifesto-body { margin-left: 0 !important; margin-right: 0 !important; max-width: 100% !important; }
        }
      `}</style>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "#C8B89A",
            textTransform: "uppercase",
            marginBottom: "2.5rem",
          }}
        >
          (01) — Manifesto
        </p>

        <h2 style={{ margin: 0 }}>
          {LINES.map((line, li) => (
            <span
              key={li}
              style={{ display: "block", lineHeight: 1.08 }}
            >
              {line.map((w, wi) => (
                <span
                  key={wi}
                  className="mword"
                  style={{
                    display: "inline-block",
                    marginRight: "0.28em",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.6rem,7vw,6rem)",
                    fontWeight: w.em ? 300 : 600,
                    fontStyle: w.em ? "italic" : "normal",
                    color: w.em ? "#D4873A" : "#FAFAF8",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {w.text}
                </span>
              ))}
            </span>
          ))}
        </h2>

        <p
          className="manifesto-body"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.95rem",
            color: "#6B7280",
            lineHeight: 1.75,
            maxWidth: "30rem",
            marginTop: "2.75rem",
            marginLeft: "auto",
            marginRight: 0,
          }}
        >
          {BODY}
        </p>
      </div>
    </section>
  );
}
