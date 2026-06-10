"use client";

/*
 * Mouse scale image gallery — after
 * blog.olivierlarose.com/tutorials/mouse-scale-image-gallery.
 * Pairs of projects share a row; their widths ease between 66.66% and 33.33%
 * based on cursor X, smoothed with a requestAnimationFrame lerp.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { properties, type Property } from "@/lib/data";
import { useTransitionRouter } from "../transition/PageTransition";

export function DoubleGallery() {
  return (
    <section
      aria-label="Property gallery"
      style={{
        backgroundColor: "#0C0C0E",
        padding: "clamp(3rem,8vh,6rem) clamp(1.5rem,5vw,5rem) clamp(4rem,10vh,8rem)",
      }}
    >
      <div
        className="flex flex-col"
        style={{ maxWidth: "1400px", margin: "0 auto", gap: "clamp(2rem,5vh,4rem)" }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "#C8B89A",
            textTransform: "uppercase",
          }}
        >
          /The Collection
        </p>

        <Double pair={[properties[0], properties[1]]} />
        <Double pair={[properties[2], properties[3]]} reversed />
        <Double pair={[properties[4], properties[5]]} />
      </div>
    </section>
  );
}

function Double({ pair, reversed = false }: { pair: [Property, Property]; reversed?: boolean }) {
  const firstImage = useRef<HTMLDivElement>(null);
  const secondImage = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const xPercent = useRef(reversed ? 100 : 0);
  const currentXPercent = useRef(reversed ? 100 : 0);

  useEffect(() => {
    const id = rafId.current;
    return () => {
      if (id !== null) window.cancelAnimationFrame(id);
    };
  }, []);

  const animate = () => {
    // Lerp toward the cursor position for an eased feel
    const delta = xPercent.current - currentXPercent.current;
    currentXPercent.current += delta * 0.15;

    const firstPercent = 66.66 - currentXPercent.current * 0.33;
    const secondPercent = 33.33 + currentXPercent.current * 0.33;
    if (firstImage.current) firstImage.current.style.width = `${firstPercent}%`;
    if (secondImage.current) secondImage.current.style.width = `${secondPercent}%`;

    if (Math.round(xPercent.current) === Math.round(currentXPercent.current)) {
      if (rafId.current !== null) window.cancelAnimationFrame(rafId.current);
      rafId.current = null;
    } else {
      rafId.current = window.requestAnimationFrame(animate);
    }
  };

  const manageMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    xPercent.current = (e.clientX / window.innerWidth) * 100;
    if (rafId.current === null) {
      rafId.current = window.requestAnimationFrame(animate);
    }
  };

  return (
    <div onMouseMove={manageMouseMove} className="flex" style={{ gap: "1rem" }}>
      <Panel ref={firstImage} prop={pair[0]} width={reversed ? "33.33%" : "66.66%"} />
      <Panel ref={secondImage} prop={pair[1]} width={reversed ? "66.66%" : "33.33%"} />
    </div>
  );
}

function Panel({
  ref,
  prop,
  width,
}: {
  ref: React.Ref<HTMLDivElement>;
  prop: Property;
  width: string;
}) {
  const { navigate } = useTransitionRouter();
  return (
    <div
      ref={ref}
      style={{ width, cursor: "pointer" }}
      role="link"
      tabIndex={0}
      aria-label={`View ${prop.name}`}
      onClick={() => navigate(`/properties/${prop.slug}`, prop.name)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/properties/${prop.slug}`, prop.name);
        }
      }}
    >
      {/* Padding-bottom trick keeps a 3:2 ratio while width animates */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "66.66%",
          overflow: "hidden",
          backgroundColor: "#1a1a1d",
        }}
      >
        <Image
          src={prop.image}
          alt={`${prop.name} — ${prop.location}`}
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div style={{ paddingTop: "0.8rem" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            fontWeight: 300,
            color: "#FAFAF8",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {prop.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.78rem",
            color: "#6B7280",
            margin: "0.25rem 0 0",
          }}
        >
          {prop.description}
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#D4873A",
            margin: "0.5rem 0 0",
          }}
        >
          {prop.location} · {prop.price}
        </p>
      </div>
    </div>
  );
}
