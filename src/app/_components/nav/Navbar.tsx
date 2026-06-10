"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useTransitionRouter } from "../transition/PageTransition";
import { NavMenu } from "./NavMenu";
import { opacity, background } from "./anim";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isActive, setIsActive] = useState(false);
  const { navigate } = useTransitionRouter();

  // Frosted-ink bg on scroll (always ink while menu is open)
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (isActive) {
      gsap.set(nav, { backgroundColor: "#0C0C0E", backdropFilter: "none" });
      return;
    }
    const apply = (on: boolean) =>
      gsap.to(nav, {
        backgroundColor: on ? "rgba(12,12,14,0.85)" : "transparent",
        backdropFilter: on ? "blur(12px)" : "none",
        WebkitBackdropFilter: on ? "blur(12px)" : "none",
        duration: 0.4,
      });
    apply(window.scrollY > 80);
    const st = ScrollTrigger.create({
      start: 80,
      onEnter: () => apply(true),
      onLeaveBack: () => apply(false),
    });
    return () => st.kill();
  }, [isActive]);

  // Magnetic CTA — GSAP quickTo, pointer:fine only
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn || !window.matchMedia("(pointer: fine)").matches) return;
    const setX = gsap.quickTo(btn, "x", { duration: 0.4, ease: "expo.out" });
    const setY = gsap.quickTo(btn, "y", { duration: 0.4, ease: "expo.out" });
    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      setX((e.clientX - (r.left + r.width / 2)) * 0.35);
      setY((e.clientY - (r.top + r.height / 2)) * 0.35);
    };
    const onLeave = () =>
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "expo.out" });
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // Esc closes the menu
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsActive(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isActive]);

  return (
    <>
      <style>{`
        .nav-cta { transition: background-color 0.25s ease, color 0.25s ease; }
        .nav-cta:hover { background-color: #D4873A !important; color: #0C0C0E !important; }
        .nav-cta:active { transform: scale(0.97); }

        .burger {
          position: relative;
          width: 26px;
          height: 10px;
          pointer-events: none;
        }
        .burger::before, .burger::after {
          content: '';
          position: absolute;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #FAFAF8;
          transition: transform 0.3s cubic-bezier(0.76, 0, 0.24, 1);
        }
        .burger::before { top: 0; }
        .burger::after { bottom: 0; }
        .burger-active::before { transform: translateY(4.5px) rotate(45deg); }
        .burger-active::after { transform: translateY(-4.5px) rotate(-45deg); }

        .menu-toggle {
          all: unset;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          cursor: pointer;
          padding: 0.4rem 0.2rem;
        }
        .menu-label {
          position: relative;
          height: 1rem;
          width: 3.2rem;
          overflow: hidden;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #FAFAF8;
        }
        .menu-label p { position: absolute; inset: 0; margin: 0; }
      `}</style>

      <header
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="flex items-center justify-between px-8 py-5">
          {/* Logo */}
          <button
            onClick={() => {
              setIsActive(false);
              navigate("/");
            }}
            aria-label="Akshar Realty — home"
            style={{
              all: "unset",
              cursor: "pointer",
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 300,
              letterSpacing: "0.18em",
              color: "#FAFAF8",
              textTransform: "uppercase",
            }}
          >
            AKSHAR
          </button>

          {/* Burger + Menu/Close label */}
          <button
            className="menu-toggle"
            onClick={() => setIsActive((v) => !v)}
            aria-expanded={isActive}
            aria-label={isActive ? "Close menu" : "Open menu"}
          >
            <span className={`burger ${isActive ? "burger-active" : ""}`} />
            <span className="menu-label" aria-hidden="true">
              <motion.p variants={opacity} animate={!isActive ? "open" : "closed"}>
                Menu
              </motion.p>
              <motion.p variants={opacity} animate={isActive ? "open" : "closed"}>
                Close
              </motion.p>
            </span>
          </button>

          {/* CTA — magnetic, hides while menu open */}
          <motion.div variants={opacity} animate={!isActive ? "open" : "closed"}>
            <button
              ref={btnRef}
              className="nav-cta"
              onClick={() => navigate("/contact")}
              tabIndex={isActive ? -1 : 0}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.78rem",
                fontWeight: 400,
                color: "#D4873A",
                border: "1px solid #D4873A",
                background: "transparent",
                padding: "0.45rem 1.2rem",
                borderRadius: "2px",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              Enquire Now
            </button>
          </motion.div>
        </div>

        {/* Drop-down nav panel */}
        <AnimatePresence mode="wait">
          {isActive && <NavMenu onClose={() => setIsActive(false)} />}
        </AnimatePresence>
      </header>

      {/* Dim background under the open menu */}
      <motion.div
        variants={background}
        initial="initial"
        animate={isActive ? "open" : "closed"}
        onClick={() => setIsActive(false)}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 40,
          backgroundColor: "rgba(12,12,14,0.55)",
          backdropFilter: "blur(2px)",
        }}
      />
    </>
  );
}
