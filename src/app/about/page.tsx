"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, motionSafe } from "@/lib/gsap";
import { siteImages } from "@/lib/data";
import { DistortedImage } from "../_components/distortion/DistortedImage";
import { TextParallax } from "../_components/marquee/TextParallax";
import { Crosshairs } from "../_components/fx/Crosshairs";
import { RotatingBadge } from "../_components/fx/RotatingBadge";
import { ValuesScroll } from "../_components/about/ValuesScroll";
import { QuoteMarquee } from "../_components/marquee/QuoteMarquee";
import { Footer } from "../_components/footer/Footer";

const TIMELINE = [
  ["2008", "Founded in Mumbai with a single plot brokerage and a typewriter."],
  ["2014", "First tower — Akshar Heights tops out over Andheri West."],
  ["2019", "Expansion to Pune and the Konkan coast. Villas enter the portfolio."],
  ["2026", "Twelve landmarks standing. 2,400 families home."],
] as const;

export default function AboutPage() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  useGSAP(
    () => {
      if (!motionSafe()) return;

      const split = SplitText.create(".about-title", { type: "chars", mask: "lines" });
      gsap.from(split.chars, {
        yPercent: 100,
        stagger: 0.02,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.from(".about-body", {
        opacity: 0,
        y: 16,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.8,
      });

      // Timeline rows cascade + year underline draw
      gsap.from(".tl-row", {
        opacity: 0,
        y: 28,
        filter: "blur(5px)",
        stagger: 0.14,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tl-list", start: "top 75%", once: true },
      });
      gsap.from(".tl-line", {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.14,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".tl-list", start: "top 75%", once: true },
      });

      const quoteSplit = SplitText.create(".about-quote", {
        type: "words",
        mask: "lines",
      });
      gsap.from(quoteSplit.words, {
        yPercent: 100,
        stagger: 0.03,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-quote", start: "top 78%", once: true },
      });

      return () => {
        split.revert();
        quoteSplit.revert();
      };
    },
    { scope: mainRef }
  );

  return (
    <main ref={mainRef} style={{ backgroundColor: "#0C0C0E" }}>
      {/* ── Head ──────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          paddingTop: "clamp(9rem,20vh,13rem)",
          paddingLeft: "clamp(1.5rem,5vw,5rem)",
          paddingRight: "clamp(1.5rem,5vw,5rem)",
          paddingBottom: "clamp(2rem,5vh,4rem)",
        }}
      >
        <Crosshairs color="rgba(200,184,154,0.3)" />
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p
            className="about-body"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "#C8B89A",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            /About — Est. 2008, Mumbai
          </p>
          <h1
            className="about-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem,8vw,7rem)",
              fontWeight: 300,
              color: "#FAFAF8",
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
              margin: 0,
              maxWidth: "18ch",
            }}
          >
            Permanence, written in stone.
          </h1>

          <div
            className="flex flex-col md:flex-row"
            style={{ gap: "2rem", marginTop: "3rem", maxWidth: "60rem" }}
          >
            <p
              className="about-body"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.95rem",
                color: "rgba(200,184,154,0.75)",
                lineHeight: 1.75,
                flex: 1,
                margin: 0,
              }}
            >
              Akshar means letter — indestructible — in Sanskrit. Since 2008 we
              have built with that word as a brief: addresses meant to outlast
              trends, paperwork handled with the same care as poured concrete.
            </p>
            <p
              className="about-body"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.95rem",
                color: "rgba(200,184,154,0.75)",
                lineHeight: 1.75,
                flex: 1,
                margin: 0,
              }}
            >
              Twelve landmark projects across Mumbai, Pune, and the Konkan coast.
              2,400 families housed. One promise — clarity at every step, from
              first site visit to final registration.
            </p>
          </div>
        </div>
      </section>

      {/* ── WebGL mouse image distortion ──────────────────────────────── */}
      <section
        aria-label="Akshar craftsmanship"
        style={{ padding: "clamp(2rem,5vh,4rem) clamp(1.5rem,5vw,5rem)" }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <DistortedImage
            src={siteImages.about}
            alt="An Akshar residence at dusk — warm light across a stone facade"
          />
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              color: "rgba(200,184,154,0.5)",
              textTransform: "uppercase",
              textAlign: "center",
              marginTop: "1.25rem",
            }}
          >
            /Move your cursor — the image bends, the standard doesn&apos;t
          </p>
        </div>
      </section>

      {/* ── Values — pinned horizontal scroll ─────────────────────────── */}
      <ValuesScroll />

      {/* ── Timeline ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem,10vh,8rem) clamp(1.5rem,5vw,5rem)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="tl-list flex flex-col md:flex-row md:items-start"
          style={{ maxWidth: "1400px", margin: "0 auto", gap: "clamp(2rem,5vw,5rem)" }}
        >
          <div style={{ flexShrink: 0 }} className="hidden md:block">
            <RotatingBadge size={96} />
          </div>
          <div style={{ flex: 1 }}>
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
              (02) — Eighteen years, four chapters
            </p>
            {TIMELINE.map(([year, text]) => (
              <div key={year} className="tl-row" style={{ position: "relative", padding: "1.6rem 0" }}>
                <div
                  className="flex flex-col md:flex-row md:items-baseline"
                  style={{ gap: "0.5rem 3rem" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(2rem,4vw,3.2rem)",
                      fontWeight: 300,
                      color: "#D4873A",
                      lineHeight: 1,
                      width: "8rem",
                      flexShrink: 0,
                    }}
                  >
                    {year}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 300,
                      fontSize: "1rem",
                      color: "rgba(200,184,154,0.8)",
                      lineHeight: 1.6,
                      maxWidth: "34rem",
                    }}
                  >
                    {text}
                  </span>
                </div>
                <span
                  className="tl-line"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "1px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pull quote ────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "clamp(4rem,10vh,8rem) clamp(1.5rem,5vw,5rem)",
        }}
      >
        <blockquote
          className="about-quote"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem,4vw,3.2rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#F5F0E8",
            maxWidth: "52rem",
            margin: "0 auto",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          &ldquo;Finding the right home isn&apos;t a transaction. It&apos;s the
          beginning of the next chapter.&rdquo;
        </blockquote>
      </section>

      <QuoteMarquee />
      <TextParallax />
      <Footer />
    </main>
  );
}
