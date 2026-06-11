"use client";

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
    arrow: {
      path: "M4 18 C54 4 92 14 130 52",
      viewBox: "0 0 140 70",
      style: { top: "54%", left: "82%", width: "140px" },
      dot: { cx: 132, cy: 54 },
    },
  },
  {
    id: "lighting",
    title: "Smart Lighting",
    desc: "Circadian rhythm-adjusted LED throughout",
    position: { top: "28%", right: "10%" },
    arrow: {
      path: "M134 16 C82 6 46 20 12 58",
      viewBox: "0 0 140 70",
      style: { top: "58%", right: "84%", width: "140px" },
      dot: { cx: 10, cy: 60 },
    },
  },
  {
    id: "air",
    title: "Air Quality",
    desc: "HEPA filtration built into the structure",
    position: { top: "60%", right: "8%" },
    arrow: {
      path: "M130 54 C88 72 42 58 10 16",
      viewBox: "0 0 140 80",
      style: { bottom: "52%", right: "84%", width: "140px" },
      dot: { cx: 9, cy: 15 },
    },
  },
] as const;

export function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const pointerOpacity = useTransform(
    scrollYProgress,
    [0, 0.16, 0.78, 1],
    [0, 1, 1, 0]
  );
  const pointerY = useTransform(scrollYProgress, [0, 0.5, 1], [18, 0, -18]);

  useGSAP(
    () => {
      if (!motionSafe()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 68%",
          once: true,
          invalidateOnRefresh: true,
        },
      });

      tl.from(".amenity-card", {
        scale: 0.9,
        opacity: 0,
        y: 26,
        stagger: 0.14,
        duration: 0.95,
        ease: "power3.out",
      }).from(
        ".amenity-arrow path, .amenity-arrow circle",
        {
          opacity: 0,
          scale: 0.96,
          stagger: 0.035,
          duration: 0.7,
          ease: "power2.out",
        },
        "-=0.55"
      );

      gsap.to(".feature-pointer-mark", {
        y: 10,
        opacity: 0.36,
        repeat: -1,
        yoyo: true,
        duration: 1.15,
        ease: "sine.inOut",
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
          alt="Inside an Akshar residence, light-filled living space"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: [
            "radial-gradient(circle at 50% 42%, rgba(212,135,58,0.12), transparent 32%)",
            "linear-gradient(to top, rgba(12,12,14,0.86) 0%, rgba(12,12,14,0.28) 48%, transparent 100%)",
          ].join(", "),
        }}
      />

      <motion.div
        className="absolute left-1/2 pointer-events-none"
        style={{
          opacity: reduce ? 0 : pointerOpacity,
          y: reduce ? 0 : pointerY,
          bottom: "2rem",
          zIndex: 12,
          translateX: "-50%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            padding: "0.62rem 0.78rem",
            border: "1px solid rgba(245,240,232,0.2)",
            background:
              "linear-gradient(135deg, rgba(250,250,248,0.16), rgba(12,12,14,0.22))",
            boxShadow:
              "0 18px 50px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.18)",
            backdropFilter: "blur(16px) saturate(135%)",
            WebkitBackdropFilter: "blur(16px) saturate(135%)",
          }}
        >
          <span
            className="feature-pointer-mark"
            style={{
              width: "0.48rem",
              height: "0.48rem",
              borderRadius: "999px",
              backgroundColor: "#D4873A",
              boxShadow: "0 0 22px rgba(212,135,58,0.72)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              color: "rgba(245,240,232,0.78)",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Explore details
          </span>
        </div>
      </motion.div>

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

      {AMENITIES.map((card) => (
        <div
          key={card.id}
          className="amenity-card absolute"
          style={{
            ...card.position,
            zIndex: 10,
            width: "clamp(168px, 17vw, 218px)",
            background:
              "linear-gradient(145deg, rgba(250,250,248,0.82), rgba(245,240,232,0.48))",
            border: "1px solid rgba(245,240,232,0.42)",
            boxShadow:
              "0 24px 70px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.44)",
            backdropFilter: "blur(18px) saturate(138%)",
            WebkitBackdropFilter: "blur(18px) saturate(138%)",
            padding: "1rem",
            borderRadius: "6px",
          }}
        >
          <svg
            className="amenity-arrow absolute pointer-events-none"
            viewBox={card.arrow.viewBox}
            aria-hidden="true"
            style={{
              ...card.arrow.style,
              height: "80px",
              overflow: "visible",
              color: "rgba(245,240,232,0.78)",
              filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.35))",
            }}
          >
            <path
              d={card.arrow.path}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="4 7"
            />
            <path
              d={card.arrow.path}
              fill="none"
              stroke="rgba(212,135,58,0.76)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="1 15"
            />
            <circle cx={card.arrow.dot.cx} cy={card.arrow.dot.cy} r="3.5" fill="#D4873A" />
          </svg>

          <div
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#0C0C0E",
              marginBottom: "0.3rem",
              letterSpacing: 0,
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
