"use client";

/*
 * Mumbai skyline — a single SVG path (towers, a dome, the Sea Link cables)
 * that draws itself via strokeDashoffset, scrubbed by scroll. An amber sun
 * rises behind it on the same timeline.
 */

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motionSafe } from "@/lib/gsap";

const SKYLINE =
  "M0 170 H60 V120 H78 V170 H110 V95 H128 V170 H160 V135 H200 V170 " +
  "H230 V70 H244 V60 H258 V70 H272 V170 H310 V140 H348 V170 " +
  "H380 Q400 100 420 170 H470 V110 H486 V90 H502 V110 H518 V170 " +
  "H560 V150 H600 V170 " +
  "H640 Q700 40 760 170 " + // sea-link pylon curve
  "H800 V125 H818 V170 H850 V85 H866 V75 H882 V85 H898 V170 " +
  "H940 V145 H980 V170 H1020 V100 H1040 V170 " +
  "H1080 Q1100 130 1120 170 H1170 V115 H1190 V170 " +
  "H1240 V90 H1254 V78 H1268 V90 H1282 V170 H1330 V140 H1370 V170 H1440";

export function SkylineDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const sunRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();

      if (!motionSafe()) {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
        return;
      }

      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          end: "bottom 35%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo(
        sunRef.current,
        { attr: { cy: 200 }, opacity: 0 },
        {
          attr: { cy: 95 },
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: "bottom 35%",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        backgroundColor: "#0C0C0E",
        padding: "clamp(2rem,6vh,4rem) clamp(1.5rem,5vw,5rem) 0",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(200,184,154,0.45)",
          }}
        >
          /19.0760° N — 72.8777° E
        </span>
        <svg
          viewBox="0 0 1440 180"
          width="100%"
          preserveAspectRatio="none"
          style={{ display: "block", height: "clamp(90px,16vw,180px)" }}
        >
          {/* rising sun */}
          <circle ref={sunRef} cx="700" cy="200" r="26" fill="#D4873A" opacity="0" />
          {/* skyline draws on scroll */}
          <path
            ref={pathRef}
            d={SKYLINE}
            fill="none"
            stroke="rgba(200,184,154,0.75)"
            strokeWidth="1.2"
          />
          {/* ground line */}
          <line
            x1="0"
            y1="170.5"
            x2="1440"
            y2="170.5"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
