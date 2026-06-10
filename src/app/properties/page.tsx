"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, motionSafe } from "@/lib/gsap";
import { SlideGallery } from "../_components/gallery/SlideGallery";
import { BentoLocations } from "../_components/gallery/BentoLocations";
import { CardStack } from "../_components/gallery/CardStack";
import { DoubleGallery } from "../_components/gallery/DoubleGallery";
import { OutlineMarquee } from "../_components/fx/OutlineMarquee";
import { Crosshairs } from "../_components/fx/Crosshairs";
import { Footer } from "../_components/footer/Footer";

export default function PropertiesPage() {
  const headRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  useGSAP(
    () => {
      if (!motionSafe()) return;
      const split = SplitText.create(".props-title", { type: "chars", mask: "lines" });
      const tl = gsap.timeline({ delay: 0.4 });
      tl.from(split.chars, {
        yPercent: 100,
        stagger: 0.025,
        duration: 0.9,
        ease: "power3.out",
      }).from(
        ".props-sub",
        { opacity: 0, y: 12, duration: 0.6, ease: "power3.out" },
        0.5
      );
      return () => split.revert();
    },
    { scope: headRef }
  );

  return (
    <main style={{ backgroundColor: "#0C0C0E" }}>
      {/* ── Page head ─────────────────────────────────────────────────── */}
      <section
        ref={headRef}
        style={{
          position: "relative",
          paddingTop: "clamp(9rem,20vh,13rem)",
          paddingLeft: "clamp(1.5rem,5vw,5rem)",
          paddingRight: "clamp(1.5rem,5vw,5rem)",
        }}
      >
        <Crosshairs color="rgba(200,184,154,0.3)" />
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p
            className="props-sub"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              color: "#C8B89A",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            /Properties — Six landmark addresses
          </p>
          <h1
            className="props-title"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem,8vw,7rem)",
              fontWeight: 300,
              color: "#FAFAF8",
              lineHeight: 1.02,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Addresses worth returning to.
          </h1>
        </div>
      </section>

      <SlideGallery />
      <BentoLocations />
      <CardStack />
      <DoubleGallery />
      <OutlineMarquee />
      <Footer />
    </main>
  );
}
