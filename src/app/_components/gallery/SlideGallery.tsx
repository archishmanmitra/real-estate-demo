"use client";

/*
 * Image slide project gallery — after
 * blog.olivierlarose.com/tutorials/image-slide-project-gallery.
 * Each row splits the property name in two; on hover, an image container
 * animates width: 0 → auto between the halves (motion variants).
 */

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { properties, type Property } from "@/lib/data";
import { useTransitionRouter } from "../transition/PageTransition";

const anim: Variants = {
  initial: { width: 0 },
  open: {
    width: "auto",
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },
  closed: { width: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } },
};

export function SlideGallery() {
  return (
    <section
      aria-label="Project gallery"
      style={{
        backgroundColor: "#0C0C0E",
        padding: "clamp(3rem,8vh,6rem) clamp(1.5rem,5vw,5rem)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "#C8B89A",
            textTransform: "uppercase",
            marginBottom: "2.5rem",
          }}
        >
          /Featured Work
        </p>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {properties.map((prop) => (
            <Row key={prop.id} prop={prop} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ prop }: { prop: Property }) {
  const [isActive, setIsActive] = useState(false);
  const reduce = useReducedMotion();
  const { navigate } = useTransitionRouter();
  const [first, ...rest] = prop.name.split(" ");
  const second = rest.join(" ");

  return (
    <div
      onMouseEnter={() => !reduce && setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onClick={() => navigate(`/properties/${prop.slug}`, prop.name)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/properties/${prop.slug}`, prop.name);
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`View ${prop.name}`}
      className="slide-row flex items-center justify-center flex-wrap md:flex-nowrap"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0.6rem 0",
        cursor: "pointer",
        gap: "0.4em",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 5rem)",
          fontWeight: 300,
          color: isActive ? "#D4873A" : "#FAFAF8",
          margin: 0,
          lineHeight: 1.15,
          transition: "color 0.3s ease",
        }}
      >
        {first}
      </p>

      <motion.div
        variants={reduce ? undefined : anim}
        initial="initial"
        animate={isActive || reduce ? "open" : "closed"}
        className="hidden md:flex justify-center"
        style={{ overflow: "hidden", flexShrink: 1 }}
        aria-hidden="true"
      >
        <span
          style={{
            position: "relative",
            display: "block",
            width: "clamp(6rem,11vw,10rem)",
            aspectRatio: "10/6.5",
          }}
        >
          <Image
            src={prop.thumb}
            alt=""
            fill
            sizes="160px"
            style={{ objectFit: "cover" }}
          />
        </span>
      </motion.div>

      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 5rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: isActive ? "#D4873A" : "#FAFAF8",
          margin: 0,
          lineHeight: 1.15,
          transition: "color 0.3s ease",
        }}
      >
        {second || prop.location.split(",")[0]}
      </p>
    </div>
  );
}
