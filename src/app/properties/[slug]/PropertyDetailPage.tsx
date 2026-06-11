"use client";

/*
 * Property detail — full-bleed parallax hero, SplitText title, count-up specs,
 * staggered amenities, scroll-scale gallery, and a "next property" handoff
 * that rides the curve transition.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { gsap, ScrollTrigger, SplitText, motionSafe } from "@/lib/gsap";
import { properties, siteImages } from "@/lib/data";
import { useTransitionRouter } from "../../_components/transition/PageTransition";
import { Crosshairs } from "../../_components/fx/Crosshairs";
import { Footer } from "../../_components/footer/Footer";

export default function PropertyDetailPage({ slug }: { slug: string }) {
  const prop = properties.find((p) => p.slug === slug);

  if (!prop) return <MissingProperty />;
  return <PropertyDetail slug={slug} />;
}

function PropertyDetail({ slug }: { slug: string }) {
  const idx = properties.findIndex((p) => p.slug === slug);
  const prop = properties[idx];
  const next = properties[(idx + 1) % properties.length];

  const mainRef = useRef<HTMLElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { navigate } = useTransitionRouter();

  // Background image parallax on the full-bleed photograph
  const { scrollYProgress } = useScroll({
    target: heroImgRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  useGSAP(
    () => {
      if (!motionSafe()) return;

      // Title chars
      const split = SplitText.create(".detail-title", { type: "chars", mask: "lines" });
      const tl = gsap.timeline({ delay: 0.35 });
      tl.from(split.chars, {
        yPercent: 100,
        stagger: 0.025,
        duration: 0.9,
        ease: "power3.out",
      })
        .from(".detail-eyebrow", { opacity: 0, y: 10, duration: 0.5 }, 0.4)
        .from(".detail-meta span", { opacity: 0, y: 12, stagger: 0.07, duration: 0.5 }, 0.7);

      // Hero image wipe
      gsap.from(".detail-hero-clip", {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.2,
        ease: "expo.inOut",
        delay: 0.5,
      });

      // Spec counters
      gsap.utils.toArray<HTMLElement>(".spec-value").forEach((el) => {
        const target = parseInt(el.dataset.target ?? "0", 10);
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 1.6,
          ease: "power3.out",
          onUpdate() {
            el.textContent = Math.round(obj.n).toLocaleString();
          },
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Amenities cascade
      gsap.from(".amenity-row", {
        opacity: 0,
        x: -24,
        filter: "blur(4px)",
        stagger: 0.09,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".amenity-list", start: "top 80%", once: true },
      });

      // Gallery frames scale-settle
      gsap.utils.toArray<HTMLElement>(".gal-frame").forEach((frame) => {
        gsap.from(frame, {
          clipPath: "inset(12% 8% 12% 8%)",
          duration: 1.1,
          ease: "expo.inOut",
          scrollTrigger: { trigger: frame, start: "top 78%", once: true },
        });
        const img = frame.querySelector(".gal-img");
        if (img)
          gsap.from(img, {
            scale: 1.25,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: { trigger: frame, start: "top 78%", once: true },
          });
      });

      // Next-property row
      gsap.from(".next-row", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".next-row", start: "top 88%", once: true },
      });

      return () => split.revert();
    },
    { scope: mainRef }
  );

  const specs = [
    { value: prop.beds, label: "Bedrooms" },
    { value: prop.baths, label: "Bathrooms" },
    { value: prop.sqft, label: "Square Feet" },
    { value: prop.amenities.length, label: "Signature Amenities" },
  ];

  const monoLabel: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.65rem",
    letterSpacing: "0.12em",
    color: "#C8B89A",
    textTransform: "uppercase",
  };

  return (
    <main ref={mainRef} style={{ backgroundColor: "#0C0C0E" }}>
      {/* ── Head ───────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          paddingTop: "clamp(9rem,18vh,12rem)",
          paddingLeft: "clamp(1.5rem,5vw,5rem)",
          paddingRight: "clamp(1.5rem,5vw,5rem)",
          paddingBottom: "clamp(2.5rem,6vh,4rem)",
        }}
      >
        <Crosshairs color="rgba(200,184,154,0.3)" />
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p className="detail-eyebrow" style={{ ...monoLabel, marginBottom: "1.25rem" }}>
            /{prop.id} — {prop.type} · {prop.location}
          </p>
          <h1
            className="detail-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem,9vw,8rem)",
              fontWeight: 300,
              color: "#FAFAF8",
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {prop.name}
          </h1>
          <div
            className="detail-meta flex flex-wrap"
            style={{ gap: "2.5rem", marginTop: "2rem" }}
          >
            <span style={{ ...monoLabel, color: "#D4873A" }}>{prop.price}</span>
            <span style={monoLabel}>{prop.beds} BHK</span>
            <span style={monoLabel}>{prop.sqft.toLocaleString()} sq ft</span>
            <span style={monoLabel}>Possession 2027</span>
          </div>
        </div>
      </section>

      {/* ── Full-bleed parallax photograph ────────────────────────────── */}
      <div
        className="detail-hero-clip"
        style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      >
        <div
          ref={heroImgRef}
          style={{ position: "relative", height: "82vh", overflow: "hidden" }}
        >
          <motion.div
            style={{
              y: reduce ? 0 : y,
              position: "absolute",
              top: "-10%",
              left: 0,
              right: 0,
              height: "120%",
            }}
          >
            <Image
              src={prop.image}
              alt={`${prop.name} — ${prop.location}`}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </motion.div>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(12,12,14,0.55) 0%, transparent 40%)",
            }}
          />
        </div>
      </div>

      {/* ── Spec counters ──────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(2.5rem,6vh,4rem) clamp(1.5rem,5vw,5rem)",
        }}
      >
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ maxWidth: "1400px", margin: "0 auto", gap: "2rem" }}
        >
          {specs.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.2rem,4.5vw,4rem)",
                  fontWeight: 300,
                  lineHeight: 1,
                  color: "#D4873A",
                }}
              >
                <span className="spec-value" data-target={s.value}>
                  {s.value.toLocaleString()}
                </span>
              </div>
              <span
                style={{
                  ...monoLabel,
                  fontSize: "0.6rem",
                  color: "rgba(200,184,154,0.55)",
                  display: "block",
                  marginTop: "0.5rem",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story + amenities ──────────────────────────────────────────── */}
      <section
        style={{ padding: "clamp(4rem,10vh,7rem) clamp(1.5rem,5vw,5rem)" }}
      >
        <div
          className="flex flex-col md:flex-row"
          style={{ maxWidth: "1400px", margin: "0 auto", gap: "clamp(2.5rem,6vw,6rem)" }}
        >
          <div style={{ flex: "1 1 55%" }}>
            <p style={{ ...monoLabel, marginBottom: "1.5rem" }}>(01) — The Address</p>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.5rem,2.8vw,2.2rem)",
                fontWeight: 300,
                color: "#F5F0E8",
                lineHeight: 1.45,
                margin: 0,
              }}
            >
              {prop.description}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "0.92rem",
                color: "#6B7280",
                lineHeight: 1.75,
                maxWidth: "32rem",
                marginTop: "1.75rem",
              }}
            >
              Every Akshar address carries the same brief — clarity in paperwork,
              honesty in materials, and a floor plan that still makes sense twenty
              years from now. Site visits run daily; registration support is
              included with every booking.
            </p>
          </div>

          <div className="amenity-list" style={{ flex: "1 1 45%" }}>
            <p style={{ ...monoLabel, marginBottom: "1.5rem" }}>(02) — Amenities</p>
            {prop.amenities.map((a, i) => (
              <div
                key={a}
                className="amenity-row flex items-baseline"
                style={{
                  gap: "1.25rem",
                  padding: "1.1rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span style={{ ...monoLabel, color: "#D4873A", width: "2.5rem" }}>
                  /{String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.3rem,2vw,1.7rem)",
                    fontWeight: 300,
                    color: "#FAFAF8",
                  }}
                >
                  {a}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery — clip + scale settle frames ───────────────────────── */}
      <section
        aria-label={`${prop.name} gallery`}
        style={{ padding: "0 clamp(1.5rem,5vw,5rem) clamp(4rem,10vh,7rem)" }}
      >
        <div
          className="flex flex-col md:flex-row"
          style={{ maxWidth: "1400px", margin: "0 auto", gap: "1.25rem" }}
        >
          {[prop.image, siteImages.parallax[idx % 3], prop.thumb].map((src, i) => (
            <div
              key={i}
              className="gal-frame"
              style={{
                position: "relative",
                flex: i === 0 ? "1.6 1 0" : "1 1 0",
                aspectRatio: i === 0 ? "4/3" : "3/4",
                overflow: "hidden",
                clipPath: "inset(0% 0% 0% 0%)",
              }}
            >
              <div className="gal-img" style={{ position: "absolute", inset: 0 }}>
                <Image
                  src={src}
                  alt={`${prop.name} — view ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Next property handoff ──────────────────────────────────────── */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(3.5rem,9vh,6rem) clamp(1.5rem,5vw,5rem)",
        }}
      >
        <button
          className="next-row"
          onClick={() => navigate(`/properties/${next.slug}`, next.name)}
          style={{
            all: "unset",
            cursor: "pointer",
            display: "block",
            width: "100%",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <span style={{ ...monoLabel, display: "block", marginBottom: "1rem" }}>
            Next — /{next.id}
          </span>
          <span
            className="flex items-baseline justify-between flex-wrap"
            style={{ gap: "1rem" }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.4rem,6vw,5rem)",
                fontWeight: 300,
                color: "#FAFAF8",
                lineHeight: 1.05,
              }}
            >
              {next.name}
              <em style={{ fontStyle: "italic", color: "#D4873A" }}> →</em>
            </span>
            <span style={{ ...monoLabel, color: "rgba(200,184,154,0.55)" }}>
              {next.location}
            </span>
          </span>
        </button>
      </section>

      <Footer />
    </main>
  );
}

function MissingProperty() {
  return (
    <main
      className="flex flex-col items-center justify-center text-center"
      style={{ minHeight: "100vh", backgroundColor: "#0C0C0E", padding: "2rem" }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem,5vw,4rem)",
          fontWeight: 300,
          color: "#FAFAF8",
        }}
      >
        This address doesn&apos;t exist yet.
      </h1>
      <Link
        href="/properties"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#D4873A",
          textDecoration: "none",
          marginTop: "2rem",
          border: "1px solid #D4873A",
          padding: "0.7rem 1.8rem",
        }}
      >
        → Back to Properties
      </Link>
    </main>
  );
}
