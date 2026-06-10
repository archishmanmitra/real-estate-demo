"use client";

/**
 * Full navigation panel — after blog.olivierlarose.com/tutorials/navigation-menu.
 * Drops below the header bar (height: 0 → auto), links reveal char-by-char,
 * non-hovered links blur, a preview image swaps per hovered link.
 */

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data";
import { useTransitionRouter } from "../transition/PageTransition";
import { height, blur, translate, imageOpacity } from "./anim";

type Selected = { isActive: boolean; index: number };

export function NavMenu({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Selected>({ isActive: false, index: 0 });
  const { navigate } = useTransitionRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const getChars = (word: string) =>
    word.split("").map((char, i) => (
      <motion.span
        key={char + i}
        custom={[i * 0.02 + 0.3, (word.length - i) * 0.01]}
        variants={reduce ? undefined : translate}
        initial="initial"
        animate="enter"
        exit="exit"
        style={{ display: "inline-block" }}
      >
        {char}
      </motion.span>
    ));

  const go = (href: string) => {
    onClose();
    navigate(href);
  };

  return (
    <motion.nav
      variants={height}
      initial="initial"
      animate="enter"
      exit="exit"
      aria-label="Site menu"
      style={{
        overflow: "hidden",
        backgroundColor: "#F5F0E8",
        borderBottom: "1px solid rgba(12,12,14,0.1)",
      }}
    >
      <div
        className="flex justify-between gap-12"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "3.5rem clamp(1.5rem,5vw,5rem) 2.5rem",
        }}
      >
        {/* ── Links ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col justify-between" style={{ minHeight: "340px" }}>
          <div className="flex flex-col" style={{ gap: "0.35rem" }}>
            {navLinks.map((link, index) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                onMouseOver={() => setSelected({ isActive: true, index })}
                onMouseLeave={() => setSelected({ isActive: false, index })}
                onFocus={() => setSelected({ isActive: true, index })}
                onBlur={() => setSelected({ isActive: false, index })}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  textAlign: "left",
                  overflow: "hidden",
                }}
              >
                <motion.p
                  variants={blur}
                  initial="initial"
                  animate={
                    selected.isActive && selected.index !== index ? "open" : "closed"
                  }
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.6rem,5.5vw,4.5rem)",
                    fontWeight: 300,
                    lineHeight: 1.06,
                    color: pathname === link.href ? "#D4873A" : "#0C0C0E",
                    letterSpacing: "0.01em",
                    margin: 0,
                  }}
                >
                  {getChars(link.title)}
                </motion.p>
              </button>
            ))}
          </div>

          {/* Footer meta rows */}
          <div
            className="flex flex-wrap"
            style={{ gap: "2.5rem", marginTop: "2.5rem", overflow: "hidden" }}
          >
            {[
              ["Studio", "Mumbai · Pune · Konkan"],
              ["Est.", "2008"],
              ["Enquiries", "hello@aksharrealty.in"],
            ].map(([k, v]) => (
              <motion.p
                key={k}
                custom={[0.6, 0]}
                variants={reduce ? undefined : translate}
                initial="initial"
                animate="enter"
                exit="exit"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#6B7280",
                  margin: 0,
                }}
              >
                <span style={{ color: "#D4873A", marginRight: "0.5rem" }}>{k}:</span>
                {v}
              </motion.p>
            ))}
          </div>
        </div>

        {/* ── Preview image — swaps per hovered link ───────────────────── */}
        <motion.div
          variants={imageOpacity}
          initial="initial"
          animate={selected.isActive ? "open" : "closed"}
          aria-hidden="true"
          className="hidden lg:block"
          style={{
            position: "relative",
            width: "420px",
            height: "320px",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <Image
            src={navLinks[selected.index].src}
            alt=""
            fill
            sizes="420px"
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </div>
    </motion.nav>
  );
}
