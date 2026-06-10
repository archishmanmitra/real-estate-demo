"use client";

/*
 * Feature section — full-bleed background image parallax after
 * blog.olivierlarose.com/tutorials/background-image-parallax (motion useScroll +
 * useTransform; image is 120% tall and drifts as the section crosses the viewport),
 * plus the Akshar amenity-card pop-in orchestra (GSAP).
 */

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { gsap, motionSafe } from "@/lib/gsap";
import { siteImages } from "@/lib/data";

const AMENITIES = [
  {
    id: "climate",
    title: "Climate Control",
    desc: "Daikin VRF systems across every unit",
    position: { top: "32%", left: "6%" },
  },
  {
    id: "lighting",
    title: "Smart Lighting",
    desc: "Circadian rhythm-adjusted LED throughout",
    position: { top: "28%", right: "10%" },
  },
  {
    id: "air",
    title: "Air Quality",
    desc: "HEPA filtration built into the structure",
    position: { top: "60%", right: "8%" },
  },
] as const;

export function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // ── Background image parallax (scrubbed by scroll) ──────────────────
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // ── Amenity cards pop in ─────────────────────────────────────────────
  useGSAP(
    () => {
      if (!motionSafe()) return;
      gsap.from(".amenity-card", {
        scale: 0.85,
        opacity: 0,
        y: 20,
        filter: "blur(10px)",
        stagger: 0.15,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="feature-section relative overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Parallax background — 120% tall, drifts -10% → 10% */}
      <motion.div
        className="absolute"
        style={{
          y: reduce ? 0 : y,
          top: "-10%",
          left: 0,
          right: 0,
          height: "120%",
          zIndex: 0,
          backgroundColor: "#292524",
        }}
      >
        <Image
          src={siteImages.feature}
          alt="Inside an Akshar residence — light-filled living space"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </motion.div>

      {/* Gradient — dark ink rising from bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to top, rgba(12,12,14,0.82) 0%, rgba(12,12,14,0.22) 45%, transparent 100%)",
        }}
      />

      {/* Top section labels */}
      <div
        className="absolute left-0 right-0 flex justify-between"
        style={{ top: "2rem", padding: "0 2rem", zIndex: 10 }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "rgba(200,184,154,0.7)",
            textTransform: "uppercase",
          }}
        >
          /Our Spaces
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "rgba(200,184,154,0.7)",
            textTransform: "uppercase",
          }}
        >
          Crafted for how you live
        </span>
      </div>

      {/* Floating amenity cards — pop in on scroll */}
      {AMENITIES.map((card) => (
        <div
          key={card.id}
          className="amenity-card absolute"
          style={{
            ...card.position,
            zIndex: 10,
            width: "190px",
            backgroundColor: "rgba(250,250,248,0.9)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
            padding: "1rem",
            borderRadius: 0,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#0C0C0E",
              marginBottom: "0.3rem",
              letterSpacing: "-0.01em",
            }}
          >
            {card.title}
          </div>
          <div
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 300,
              fontSize: "0.72rem",
              color: "#6B7280",
              lineHeight: 1.55,
            }}
          >
            {card.desc}
          </div>
        </div>
      ))}
    </section>
  );
}
