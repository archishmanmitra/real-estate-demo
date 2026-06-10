"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, motionSafe } from "@/lib/gsap";
import { properties, discoveryCopy } from "@/lib/data";
import { Crosshairs } from "../fx/Crosshairs";

const FILTERS = ["All", "Apartments", "Villas", "Plots"] as const;
type Filter = (typeof FILTERS)[number];

const CARD_CONFIG = [
  { top: "4%",  right: "4%",  rotate: -4 },
  { top: "14%", right: "22%", rotate:  3 },
  { top: "36%", right: "6%",  rotate: -1 },
  { top: "52%", right: "24%", rotate:  5 },
] as const;

export function DiscoverySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        ".property-card",
        sectionRef.current
      );

      // Card rotations are layout state — always apply, motion pref irrelevant
      cards.forEach((card) => {
        gsap.set(card, { rotation: Number(card.dataset.rotate ?? 0) });
      });

      if (!motionSafe()) return;

      // ── Headline words — SplitText mask reveal ────────────────────────
      const wordEls = gsap.utils.toArray<HTMLElement>(
        ".discovery-word",
        sectionRef.current
      );
      const allWords: Element[] = [];
      const splits: SplitText[] = [];

      wordEls.forEach((el) => {
        // Each .discovery-word contains exactly one word.
        // type:'words' + mask:'lines' wraps it in an overflow:hidden container
        // so yPercent:100 creates a clean rise-from-below reveal.
        const split = SplitText.create(el, { type: "words", mask: "lines" });
        splits.push(split);
        allWords.push(...split.words);
      });

      gsap.from(allWords, {
        yPercent: 100,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      // Blur tween on parent .discovery-word containers — words are inside overflow:hidden
      // line masks so blur on the parents materialises cleanly without clipping
      gsap.from(wordEls, {
        filter: "blur(8px)",
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      // ── Cards scatter in from right ───────────────────────────────────
      // Rotation already applied via gsap.set above; this animates x + opacity + blur
      gsap.from(cards, {
        x: 240,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.1,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      // ── Left column meta entrance ─────────────────────────────────────
      gsap.from(".discovery-meta", {
        opacity: 0,
        y: 16,
        stagger: 0.1,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
        },
      });

      return () => splits.forEach((s) => s.revert());
    },
    { scope: sectionRef }
  );

  const visibleProps = properties.slice(0, 4);

  return (
    <section
      ref={sectionRef}
      className="discovery-section relative w-full"
      style={{
        backgroundColor: "#F5F0E8",
        paddingTop: "clamp(5rem,10vh,8rem)",
        paddingBottom: "clamp(5rem,10vh,8rem)",
        paddingLeft: "clamp(1.5rem,5vw,5rem)",
        paddingRight: "clamp(1.5rem,5vw,5rem)",
      }}
    >
      <Crosshairs color="rgba(12,12,14,0.25)" label="(02) — Discovery" />
      <div
        className="mx-auto flex gap-8"
        style={{ maxWidth: "1400px", alignItems: "flex-start" }}
      >
        {/* ══ LEFT COLUMN — 40% ══════════════════════════════════════════ */}
        <div style={{ width: "40%", flexShrink: 0 }}>

          {/* Eyebrow */}
          <p
            className="discovery-meta"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "#C8B89A",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            {discoveryCopy.eyebrow}
          </p>

          {/* Filter pills */}
          <div
            className="discovery-meta"
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "2.25rem",
            }}
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  padding: "0.3rem 0.75rem",
                  borderRadius: 0,
                  border:
                    f === activeFilter
                      ? "1px solid #D4873A"
                      : "1px solid rgba(200,184,154,0.45)",
                  color: f === activeFilter ? "#D4873A" : "#6B7280",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "border-color 0.2s ease, color 0.2s ease",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Stacked headline — each word its own block, SplitText masks applied in GSAP */}
          <div style={{ marginBottom: "1.75rem" }}>
            {discoveryCopy.headline.map((word) => (
              <div
                key={word}
                className="discovery-word"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem,5vw,4rem)",
                  fontWeight: 600,
                  color: "#0C0C0E",
                  lineHeight: 1.05,
                  display: "block",
                }}
              >
                {word}
              </div>
            ))}
          </div>

          {/* Body copy */}
          <p
            className="discovery-meta"
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.9rem",
              color: "#6B7280",
              lineHeight: 1.72,
              maxWidth: "22rem",
              marginBottom: "1.75rem",
            }}
          >
            {discoveryCopy.body}
          </p>

          {/* Search bar */}
          <input
            type="text"
            className="discovery-meta"
            placeholder={discoveryCopy.searchPlaceholder}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              fontWeight: 300,
              color: "#0C0C0E",
              width: "100%",
              padding: "0.7rem 1rem",
              border: "1px solid #C8B89A",
              borderRadius: 0,
              background: "transparent",
              outline: "none",
              transition: "box-shadow 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = "0 0 0 2px #D4873A";
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* ══ RIGHT COLUMN — 60% ═════════════════════════════════════════ */}
        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: "600px",
            overflow: "hidden",
          }}
        >
          {visibleProps.map((prop, i) => {
            const cfg = CARD_CONFIG[i];
            return (
              <div
                key={prop.id}
                className="property-card absolute"
                data-rotate={cfg.rotate}
                style={{
                  top: cfg.top,
                  right: cfg.right,
                  width: "240px",
                  height: "320px",
                  backgroundColor: "#FAFAF8",
                  overflow: "hidden",
                  boxShadow: "0 8px 40px rgba(12,12,14,0.15)",
                  // transform/rotation owned by GSAP via gsap.set
                }}
              >
                {/* Image — top 60% */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "60%",
                    backgroundColor: "#C8B89A", // fallback until image loads
                  }}
                >
                  <Image
                    src={prop.image}
                    alt={`${prop.name} — ${prop.location}`}
                    fill
                    sizes="240px"
                    style={{ objectFit: "cover" }}
                  />
                </div>

                {/* Meta — bottom 40% */}
                <div
                  style={{
                    padding: "0.875rem 1rem",
                    height: "40%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#0C0C0E",
                        marginBottom: "0.2rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {prop.price}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 300,
                        fontSize: "0.72rem",
                        color: "#6B7280",
                        lineHeight: 1.4,
                      }}
                    >
                      {prop.location}
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      color: "#D4873A",
                      textTransform: "uppercase",
                    }}
                  >
                    {prop.type}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
