"use client";

/**
 * Text parallax marquee — after blog.olivierlarose.com/tutorials/text-parallax.
 * Three oversized text strips slide horizontally at different speeds/directions,
 * scrubbed by page scroll, with small inline photographs between phrases.
 */

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { siteImages } from "@/lib/data";

export function TextParallax() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={container}
      aria-hidden="true"
      style={{
        backgroundColor: "#0C0C0E",
        overflow: "hidden",
        padding: "clamp(3rem,8vh,6rem) 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <Slide text="Homes worth returning to" src={siteImages.parallax[0]} direction={1} left="-45%" progress={scrollYProgress} />
      <Slide text="Mumbai · Pune · Konkan" src={siteImages.parallax[1]} direction={-1} left="-30%" progress={scrollYProgress} />
      <Slide text="Permanence written in stone" src={siteImages.parallax[2]} direction={1} left="-60%" progress={scrollYProgress} />
    </div>
  );
}

function Slide({
  text,
  src,
  direction,
  left,
  progress,
}: {
  text: string;
  src: string;
  direction: 1 | -1;
  left: string;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const x = useTransform(progress, [0, 1], [180 * direction, -180 * direction]);

  return (
    <motion.div
      style={{
        x: reduce ? 0 : x,
        left,
        position: "relative",
        display: "flex",
        whiteSpace: "nowrap",
      }}
    >
      <Phrase text={text} src={src} />
      <Phrase text={text} src={src} />
      <Phrase text={text} src={src} />
    </motion.div>
  );
}

function Phrase({ text, src }: { text: string; src: string }) {
  return (
    <div
      className="flex items-center"
      style={{ gap: "clamp(1rem,2.5vw,2rem)", paddingRight: "clamp(1rem,2.5vw,2rem)" }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3.5rem,7.5vw,7rem)",
          fontWeight: 300,
          color: "#F5F0E8",
          margin: 0,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </p>
      <span
        style={{
          position: "relative",
          display: "inline-block",
          width: "clamp(5rem,9vw,8.5rem)",
          aspectRatio: "4/2.4",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <Image src={src} alt="" fill sizes="140px" style={{ objectFit: "cover" }} />
      </span>
    </div>
  );
}
