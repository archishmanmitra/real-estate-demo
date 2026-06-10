"use client";

/*
 * Hero — depth-sandwich composition (andyhardy.co):
 *   layer 0  full-bleed photograph (farthest, lags most on scroll)
 *   layer 10 giant AKSHAR wordmark — rises from BEHIND the city on load
 *   layer 20 foreground skyline cutout IN FRONT of the type
 * Cursor parallax shifts the three layers at different rates; scroll
 * separates them vertically. Type visibly sits inside the scene.
 */

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, motionSafe } from "@/lib/gsap";
import { siteImages } from "@/lib/data";
import { RotatingBadge } from "../fx/RotatingBadge";
import { SkylineForeground } from "./SkylineForeground";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLHeadingElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const [grain, setGrain] = useState(false);

  // Mount the grain canvas only while the hero is actually on screen
  useEffect(() => {
    if (!motionSafe()) return;
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setGrain(entry.isIntersecting)
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ── Cursor parallax — background drifts least, foreground most ───────
  useEffect(() => {
    const hero = heroRef.current;
    const bg = bgRef.current;
    const word = wordRef.current;
    const fg = fgRef.current;
    if (!hero || !bg || !word || !fg) return;
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const bgX = gsap.quickTo(bg, "x", { duration: 1.2, ease: "power3.out" });
    const wordX = gsap.quickTo(word, "x", { duration: 0.9, ease: "power3.out" });
    const fgX = gsap.quickTo(fg, "x", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5; // -0.5 .. 0.5
      bgX(nx * -10);
      wordX(nx * -26);
      fgX(nx * -44);
    };
    hero.addEventListener("mousemove", onMove, { passive: true });
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);

  useGSAP(
    () => {
      if (!motionSafe()) return;

      const split = SplitText.create(taglineRef.current!, {
        type: "chars",
        mask: "chars",
      });

      // ── Page-load orchestra — transform/opacity only (no filter paints)
      const tl = gsap.timeline({
        defaults: { force3D: true },
        onComplete() {
          // release compositor layers once the entrance settles
          gsap.set([".hero-bg", ".akshar-wordmark", ".hero-foreground"], {
            willChange: "auto",
          });
        },
      });
      gsap.set([".hero-bg", ".akshar-wordmark", ".hero-foreground"], {
        willChange: "transform",
      });
      tl.from(".hero-bg-img", {
        scale: 1.1,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
      })
        // the wordmark RISES from behind the skyline — the cutout masks it
        .from(
          ".akshar-wordmark",
          { yPercent: 55, duration: 1.5, ease: "expo.out" },
          0.45
        )
        .from(
          ".hero-foreground",
          { yPercent: 18, duration: 1.2, ease: "expo.out" },
          0.3
        )
        .from(
          split.chars,
          { yPercent: 100, stagger: 0.03, duration: 0.8, ease: "power3.out" },
          1.2
        )
        .from(".hero-sub", { opacity: 0, y: 10, duration: 0.6 }, 1.45)
        .from(
          ".hero-labels span",
          { opacity: 0, x: 20, stagger: 0.1, duration: 0.5 },
          1.5
        );

      // ── Scroll depth separation (far lags, near leads) ───────────────
      gsap.to(".hero-bg", {
        yPercent: 26,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(".akshar-wordmark", {
        yPercent: 13,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      // foreground gets no offset — it leads naturally as the page scrolls

      return () => split.revert();
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      className="hero relative overflow-hidden"
      style={{ minHeight: "100dvh", backgroundColor: "#0C0C0E" }}
    >
      {/* ── Layer 0: full-bleed photograph (farthest) ─────────────────── */}
      <div
        ref={bgRef}
        className="hero-bg absolute"
        style={{ inset: "-4% -2%", zIndex: 0 }}
      >
        <div className="hero-bg-img absolute inset-0">
          <Image
            src={siteImages.hero}
            alt="Marine Drive, Mumbai — the Akshar skyline at dusk"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 28%" }}
          />
        </div>
        {/* readability vignette over the photo, still behind the type */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,12,14,0.5) 0%, rgba(12,12,14,0.12) 38%, rgba(12,12,14,0.45) 100%)",
          }}
        />
      </div>

      {/* ── Layer 10: the wordmark — BEHIND the city ──────────────────── */}
      <div
        ref={wordRef}
        className="akshar-wordmark absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        style={{ zIndex: 10, paddingBottom: "16vh" }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(5rem,17.5vw,19rem)",
            fontWeight: 300,
            letterSpacing: "0.06em",
            color: "#FAFAF8",
            textTransform: "uppercase",
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          AKSHAR
        </span>
      </div>

      {/* ── Layer 20: foreground skyline cutout — IN FRONT of the type ── */}
      <div
        ref={fgRef}
        className="hero-foreground absolute pointer-events-none"
        style={{
          left: "-3%",
          right: "-3%",
          bottom: "-2px",
          height: "54vh",
          zIndex: 20,
        }}
      >
        <SkylineForeground />
      </div>

      {/* ── Layer 25: WebGL film grain ────────────────────────────────── */}
      {grain && <HeroCanvas />}

      {/* ── Layer 30: meta content ────────────────────────────────────── */}

      <h1 className="sr-only">
        Akshar Realty — homes, plots, villas and projects across Mumbai, Pune
        and the Konkan coast
      </h1>

      <div
        className="absolute"
        style={{
          top: "5.5rem",
          left: "2rem",
          zIndex: 30,
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          color: "rgba(245,240,232,0.6)",
          textTransform: "uppercase",
        }}
      >
        @ 2026
      </div>

      <div
        className="hero-labels absolute flex flex-col items-end"
        style={{ top: "5.5rem", right: "2rem", zIndex: 30, gap: "0.4rem" }}
      >
        {["Agents//", "Properties//", "Enquiries//"].map((lbl) => (
          <span
            key={lbl}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "#C8B89A",
              textTransform: "uppercase",
            }}
          >
            {lbl}
          </span>
        ))}
      </div>

      {/* Bottom-right: tagline + sub-copy (over the dark silhouette) */}
      <div
        className="absolute"
        style={{
          bottom: "2.5rem",
          right: "2rem",
          zIndex: 30,
          textAlign: "right",
          maxWidth: "22rem",
        }}
      >
        <h2
          ref={taglineRef}
          className="hero-tagline"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem,2.5vw,1.9rem)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#FAFAF8",
            marginBottom: "0.8rem",
            lineHeight: 1.3,
          }}
        >
          Where legacy meets the skyline.
        </h2>
        <p
          className="hero-sub"
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.85rem",
            color: "rgba(250,250,248,0.58)",
            lineHeight: 1.7,
            maxWidth: "20rem",
            marginLeft: "auto",
          }}
        >
          A real estate partner who brings clarity to every transaction — from
          first site visit to final registration.
        </p>
      </div>

      {/* Bottom-left: rotating SVG badge + coordinates */}
      <div
        className="absolute hidden md:flex flex-col items-start"
        style={{ bottom: "2.5rem", left: "2rem", zIndex: 30, gap: "0.8rem" }}
      >
        <RotatingBadge size={104} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.16em",
            color: "rgba(200,184,154,0.45)",
            textTransform: "uppercase",
          }}
        >
          19.0760° N — 72.8777° E
        </span>
      </div>

      {/* Left edge: vertical social strip */}
      <div
        className="absolute flex flex-col"
        style={{
          left: "1.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 30,
          gap: "1.5rem",
        }}
      >
        {[
          { label: "IG", href: "#" },
          { label: "X", href: "#" },
          { label: "YT", href: "#" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.14em",
              color: "rgba(200,184,154,0.45)",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              textDecoration: "none",
              textOrientation: "mixed",
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        className="absolute hidden md:block"
        style={{
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          fontFamily: "var(--font-mono)",
          fontSize: "0.58rem",
          letterSpacing: "0.2em",
          color: "rgba(200,184,154,0.4)",
          textTransform: "uppercase",
        }}
      >
        Scroll ↓
      </div>
    </section>
  );
}
