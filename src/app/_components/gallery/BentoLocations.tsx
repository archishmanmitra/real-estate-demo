"use client";

/*
 * Bento locations grid — 21st.dev bento pattern on the Akshar palette.
 * One hero cell (Mumbai) + supporting cells, each a SpotlightCard with
 * image zoom on hover and a staggered GSAP entrance.
 */

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, motionSafe } from "@/lib/gsap";
import { properties, siteImages } from "@/lib/data";
import { SpotlightCard } from "../fx/SpotlightCard";

const CELLS = [
  {
    big: true,
    title: "Mumbai",
    sub: "Andheri · Bandra · Lower Parel — 4 addresses",
    img: siteImages.hero,
    stat: "04",
  },
  {
    big: false,
    title: "Pune",
    sub: "Hinjawadi IT corridor",
    img: properties[5].image,
    stat: "01",
  },
  {
    big: false,
    title: "Konkan Coast",
    sub: "Alibaug villa estates",
    img: properties[2].image,
    stat: "01",
  },
] as const;

export function BentoLocations() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionSafe()) return;
      gsap.from(".bento-cell", {
        opacity: 0,
        y: 40,
        scale: 0.96,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 72%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      aria-label="Where Akshar builds"
      style={{
        backgroundColor: "#0C0C0E",
        padding: "clamp(3rem,8vh,6rem) clamp(1.5rem,5vw,5rem)",
      }}
    >
      <style>{`
        .bento-img { transition: transform 0.7s cubic-bezier(0.23, 1, 0.32, 1); }
        .bento-cell:hover .bento-img { transform: scale(1.06); }
        .bento-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .bento-grid {
            grid-template-columns: 1.7fr 1fr;
            grid-template-rows: repeat(2, 280px);
          }
          .bento-big { grid-row: span 2; }
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
            marginBottom: "2rem",
          }}
        >
          /Where we build
        </p>

        <div className="bento-grid">
          {CELLS.map((cell) => (
            <SpotlightCard
              key={cell.title}
              className={`bento-cell ${cell.big ? "bento-big" : ""}`}
              style={{ minHeight: cell.big ? "420px" : "220px" }}
            >
              <div style={{ position: "absolute", inset: 0 }}>
                <div className="bento-img" style={{ position: "absolute", inset: 0 }}>
                  <Image
                    src={cell.img}
                    alt={`${cell.title} — Akshar projects`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover", opacity: 0.55 }}
                  />
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(12,12,14,0.85) 0%, rgba(12,12,14,0.15) 60%)",
                  }}
                />
              </div>

              <div
                className="flex flex-col justify-end"
                style={{
                  position: "relative",
                  minHeight: cell.big ? "420px" : "220px",
                  padding: "1.5rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.14em",
                    color: "#D4873A",
                    textTransform: "uppercase",
                  }}
                >
                  /{cell.stat} addresses
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: cell.big
                      ? "clamp(2.2rem,4vw,3.4rem)"
                      : "clamp(1.6rem,2.5vw,2.2rem)",
                    fontWeight: 300,
                    color: "#FAFAF8",
                    margin: "0.3rem 0 0.2rem",
                    lineHeight: 1.05,
                  }}
                >
                  {cell.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 300,
                    fontSize: "0.8rem",
                    color: "rgba(200,184,154,0.75)",
                    margin: 0,
                  }}
                >
                  {cell.sub}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
