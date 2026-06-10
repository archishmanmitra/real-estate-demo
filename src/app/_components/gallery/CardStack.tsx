"use client";

/*
 * Sticky stacking cards — each featured property pins beneath the next as it
 * scales back and dims (cards-parallax / 21st.dev card-stack pattern).
 * position:sticky does the pinning; GSAP scrub handles scale + fade.
 */

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, motionSafe } from "@/lib/gsap";
import { properties } from "@/lib/data";
import { useTransitionRouter } from "../transition/PageTransition";

const FEATURED = [properties[0], properties[2], properties[4]];

export function CardStack() {
  const ref = useRef<HTMLElement>(null);
  const { navigate } = useTransitionRouter();

  useGSAP(
    () => {
      if (!motionSafe()) return;
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // last card never scales back
        gsap.to(card, {
          scale: 0.92 - (cards.length - 2 - i) * 0.02,
          opacity: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top 12%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      aria-label="Featured addresses"
      style={{
        backgroundColor: "#131318",
        padding: "clamp(3rem,8vh,6rem) clamp(1.5rem,5vw,5rem) clamp(4rem,10vh,7rem)",
      }}
    >
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
          /Featured — scroll to stack
        </p>

        {FEATURED.map((prop, i) => (
          <div
            key={prop.id}
            className="stack-card"
            role="link"
            tabIndex={0}
            aria-label={`View ${prop.name}`}
            onClick={() => navigate(`/properties/${prop.slug}`, prop.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/properties/${prop.slug}`, prop.name);
              }
            }}
            style={{
              position: "sticky",
              top: `calc(10vh + ${i * 2.4}rem)`,
              marginBottom: i === FEATURED.length - 1 ? 0 : "12vh",
              height: "64vh",
              overflow: "hidden",
              cursor: "pointer",
              backgroundColor: "#0C0C0E",
              border: "1px solid rgba(200,184,154,0.16)",
              transformOrigin: "center top",
            }}
          >
            <div style={{ position: "absolute", inset: 0 }}>
              <Image
                src={prop.image}
                alt={`${prop.name} — ${prop.location}`}
                fill
                sizes="100vw"
                style={{ objectFit: "cover", opacity: 0.7 }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(12,12,14,0.88) 0%, rgba(12,12,14,0.1) 55%)",
                }}
              />
            </div>

            <div
              className="flex flex-col justify-end"
              style={{ position: "relative", height: "100%", padding: "clamp(1.25rem,3vw,2.5rem)" }}
            >
              <div className="flex items-baseline justify-between flex-wrap" style={{ gap: "1rem" }}>
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.62rem",
                      letterSpacing: "0.14em",
                      color: "#D4873A",
                      textTransform: "uppercase",
                    }}
                  >
                    /{prop.id} — {prop.location}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem,5vw,4rem)",
                      fontWeight: 300,
                      color: "#FAFAF8",
                      margin: "0.3rem 0 0",
                      lineHeight: 1.02,
                    }}
                  >
                    {prop.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.4rem,2.5vw,2rem)",
                      fontWeight: 300,
                      color: "#D4873A",
                      lineHeight: 1,
                    }}
                  >
                    {prop.price}
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      letterSpacing: "0.12em",
                      color: "rgba(200,184,154,0.6)",
                      textTransform: "uppercase",
                    }}
                  >
                    {prop.beds} BHK · {prop.sqft.toLocaleString()} sq ft
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
