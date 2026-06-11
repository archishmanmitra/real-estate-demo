"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, motionSafe } from "@/lib/gsap";
import { properties, discoveryCopy } from "@/lib/data";
import { Crosshairs } from "../fx/Crosshairs";
import { useTransitionRouter } from "../transition/PageTransition";

const FILTERS = ["All", "Apartments", "Villas", "Plots"] as const;
type Filter = (typeof FILTERS)[number];

export function DiscoverySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const { navigate } = useTransitionRouter();

  // Rotation states for the interactive wheel
  const scrollRotRef = useRef(-30);
  const mouseRotRef = useRef(0);
  const wheelRotRef = useRef(0);
  const currentRotRef = useRef(-30);

  const matchesFilter = (prop: typeof properties[number]) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Apartments") return prop.type === "apartment";
    if (activeFilter === "Villas") return prop.type === "villa";
    if (activeFilter === "Plots") return prop.type === "plot";
    return true;
  };

  // ── Mouse & Wheel Interaction Handlers ─────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const ratio = y / rect.height;
    const targetMouseRot = (ratio - 0.5) * -18;

    gsap.to(mouseRotRef, {
      current: targetMouseRot,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(mouseRotRef, {
      current: 0,
      duration: 1.0,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(wheelRotRef, {
      current: 0,
      duration: 1.0,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    wheelRotRef.current += e.deltaY * 0.045;
    // Clamp the manual scroll wheel offset
    wheelRotRef.current = Math.max(-34, Math.min(34, wheelRotRef.current));

    // Smoothly decay wheel offset back to zero
    gsap.to(wheelRotRef, {
      current: 0,
      duration: 1.6,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        ".property-card",
        sectionRef.current
      );

      // ── ScrollTrigger for page scroll rotation ────────────────────────
      if (motionSafe()) {
        gsap.fromTo(
          scrollRotRef,
          { current: -34 },
          {
            current: 34,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.6,
            },
          }
        );
      }

      // ── High performance Ticker for Wheel Transforms ──────────────────
      const tick = () => {
        const target =
          scrollRotRef.current + mouseRotRef.current + wheelRotRef.current;
        currentRotRef.current += (target - currentRotRef.current) * 0.075;

        cards.forEach((card) => {
          const baseAngle = Number(card.dataset.baseangle ?? 0);
          const angle = baseAngle + currentRotRef.current;

          // Proximity to center of wheel (0 degrees)
          const distance = Math.abs(angle);
          const maxDistance = 72;
          const factor = Math.max(0, 1 - distance / maxDistance);

          const baseScale = 0.72 + factor * 0.3;
          const baseOpacity = 0.12 + factor * 0.88;
          const zIndex = Math.round(factor * 100);

          const filterProgress = parseFloat(
            card.style.getPropertyValue("--filter-progress") || "1"
          );

          const finalOpacity = baseOpacity * filterProgress;
          const finalScale = baseScale * (0.6 + 0.4 * filterProgress);

          gsap.set(card, {
            rotate: angle,
            opacity: finalOpacity,
            scale: finalScale,
            zIndex: zIndex,
            x: factor * -18,
            filter: `saturate(${0.72 + factor * 0.28}) contrast(${
              0.94 + factor * 0.06
            })`,
            pointerEvents: finalOpacity < 0.25 ? "none" : "auto",
          });
        });
      };

      gsap.ticker.add(tick);

      if (!motionSafe()) {
        return () => {
          gsap.ticker.remove(tick);
        };
      }

      // ── Headline words — SplitText mask reveal ────────────────────────
      const wordEls = gsap.utils.toArray<HTMLElement>(
        ".discovery-word",
        sectionRef.current
      );
      const allWords: Element[] = [];
      const splits: SplitText[] = [];

      wordEls.forEach((el) => {
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

      // ── Cards sweep-in entrance ───────────────────────────────────────
      gsap.from(cards, {
        x: 300,
        scale: 0.5,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
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

      return () => {
        splits.forEach((s) => s.revert());
        gsap.ticker.remove(tick);
      };
    },
    { scope: sectionRef }
  );

  // ── Hook 2: Animate filter transitions smoothly ────────────────────
  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(
        ".property-card",
        sectionRef.current
      );

      cards.forEach((card) => {
        const id = card.dataset.propid;
        const prop = properties.find((p) => p.id === id);
        const matches = prop ? matchesFilter(prop) : true;

        gsap.to(card, {
          "--filter-progress": matches ? 1 : 0,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    },
    { scope: sectionRef, dependencies: [activeFilter] }
  );

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
        className="mx-auto flex gap-10"
        style={{
          maxWidth: "1400px",
          alignItems: "flex-start",
          minHeight: "min(760px, 84vh)",
        }}
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
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
          style={{
            flex: 1,
            position: "relative",
            minHeight: "700px",
            height: "min(780px, 86vh)",
            overflow: "hidden",
            cursor: "grab",
            isolation: "isolate",
          }}
        >
          {/* Fallback message when no cards match */}
          {properties.filter(matchesFilter).length === 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  color: "#6B7280",
                  textTransform: "uppercase",
                }}
              >
                No properties in this category
              </p>
            </div>
          )}

          {properties.map((prop, i) => {
            const totalProps = properties.length;
            const baseAngle = (i - (totalProps - 1) / 2) * 17;

            return (
              <div
                key={prop.id}
                className="property-card absolute"
                data-propid={prop.id}
                data-baseangle={baseAngle}
                onClick={() => {
                  navigate(`/properties/${prop.slug}`, prop.name);
                }}
                style={{
                  right: "clamp(0.75rem, 3vw, 3.25rem)",
                  top: "calc(50% - clamp(200px, 19.5vw, 235px))",
                  width: "clamp(300px, 28vw, 360px)",
                  height: "clamp(400px, 39vw, 470px)",
                  backgroundColor: "#FAFAF8",
                  overflow: "hidden",
                  border: "1px solid rgba(12,12,14,0.1)",
                  boxShadow: "0 28px 70px rgba(12,12,14,0.18)",
                  transformOrigin: "clamp(390px, 44vw, 610px) 50%",
                  cursor: "pointer",
                  "--filter-progress": "1",
                  willChange: "transform, opacity, filter",
                } as React.CSSProperties}
              >
                <div
                  className="property-card-inner"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transformOrigin: "center center",
                  }}
                >
                  {/* Image — top 60% */}
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "72%",
                      padding: "0.55rem",
                      backgroundColor: "#F2E9DA",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#E7DAC7",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={prop.image}
                        alt={`${prop.name} — ${prop.location}`}
                        fill
                        sizes="(max-width: 900px) 300px, 360px"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                          transform: "scale(1.03)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Meta — bottom 40% */}
                  <div
                    style={{
                      padding: "1rem 1.1rem 1.1rem",
                      height: "28%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "1.05rem",
                          fontWeight: 500,
                          color: "#0C0C0E",
                          marginBottom: "0.18rem",
                          letterSpacing: 0,
                        }}
                      >
                        {prop.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                          fontSize: "0.76rem",
                          color: "#6B7280",
                          lineHeight: 1.4,
                        }}
                      >
                        {prop.location}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.64rem",
                          letterSpacing: "0.1em",
                          color: "#0C0C0E",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {prop.price}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.6rem",
                          letterSpacing: "0.12em",
                          color: "#D4873A",
                          textTransform: "uppercase",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {prop.type}
                      </span>
                    </div>
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
