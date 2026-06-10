"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, motionSafe } from "@/lib/gsap";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (!motionSafe()) return;

      // Pull quote materialises on scroll
      gsap.from(".footer-quote", {
        opacity: 0,
        y: 20,
        filter: "blur(4px)",
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // Headline wrapper blurs in simultaneously with char reveal
      gsap.from(".cta-headline", {
        filter: "blur(8px)",
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 75%",
          once: true,
        },
      });

      // Char-level reveal within line overflow masks
      const split = SplitText.create(headlineRef.current!, {
        type: "chars",
        mask: "lines",
      });

      gsap.from(split.chars, {
        yPercent: 100,
        stagger: 0.02,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 75%",
          once: true,
        },
      });

      return () => split.revert();
    },
    { scope: footerRef }
  );

  return (
    <>
      <style>{`
        .cta-btn {
          display: block;
          width: fit-content;
          margin: 2rem auto 0;
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: #D4873A;
          border: 1px solid #D4873A;
          background: transparent;
          padding: 0.75rem 2.25rem;
          border-radius: 0;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.28s ease, color 0.28s ease;
        }
        .cta-btn:hover {
          background-color: #D4873A;
          color: #0C0C0E;
        }
      `}</style>

      <footer
        ref={footerRef}
        style={{
          backgroundColor: "#0C0C0E",
          paddingTop: "6rem",
          paddingBottom: "3rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
        }}
      >
        {/* ── Pull quote ───────────────────────────────────────────────── */}
        <p
          className="footer-quote"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.3rem",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#C8B89A",
            maxWidth: "32rem",
            margin: "0 auto 3rem",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          &ldquo;Finding the right home isn&apos;t a transaction. It&apos;s the
          beginning of the next chapter.&rdquo;
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              fontStyle: "normal",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(200,184,154,0.5)",
              marginTop: "0.8rem",
            }}
          >
            — Akshar Realty
          </span>
        </p>

        {/* ── CTA headline — SplitText chars reveal on scroll ─────────── */}
        <h2
          ref={headlineRef}
          className="cta-headline"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem,6vw,5rem)",
            fontWeight: 600,
            color: "#FAFAF8",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {/* Two display:block spans give SplitText clear line boundaries */}
          <span style={{ display: "block" }}>Let&apos;s find</span>
          <span style={{ display: "block" }}>your home.</span>
        </h2>

        {/* ── CTA button ───────────────────────────────────────────────── */}
        <a href="/contact" className="cta-btn">
          Schedule a Visit →
        </a>

        {/* ── Bottom bar ───────────────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: "4rem",
            paddingTop: "1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "rgba(200,184,154,0.5)",
              textTransform: "uppercase",
            }}
          >
            AKSHAR REALTY · Est. 2008 · Mumbai, India
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "rgba(200,184,154,0.5)",
              textTransform: "uppercase",
            }}
          >
            © 2026
          </span>
        </div>
      </footer>
    </>
  );
}
