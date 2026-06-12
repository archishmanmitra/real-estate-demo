"use client";

import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import * as Accordion from "@radix-ui/react-accordion";
import { gsap, motionSafe } from "@/lib/gsap";
import { properties } from "@/lib/data";
import { Crosshairs } from "../fx/Crosshairs";
import { useTransitionRouter } from "../transition/PageTransition";

export function PropertiesList() {
  const sectionRef = useRef<HTMLElement>(null);
  const thumbRef = useRef<HTMLImageElement>(null);
  const { navigate } = useTransitionRouter();

  useEffect(() => {
    const thumb = thumbRef.current;
    const section = sectionRef.current;
    if (!thumb || !section) return;

    // GSAP owns all transforms on the thumb from the start
    gsap.set(thumb, { scale: 0.88, opacity: 0 });

    // Cursor-follow only for precise pointer devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const setX = gsap.quickTo(thumb, "x", { duration: 0.5, ease: "expo.out" });
    const setY = gsap.quickTo(thumb, "y", { duration: 0.5, ease: "expo.out" });

    const onMove = (e: MouseEvent) => {
      setX(e.clientX);
      setY(e.clientY);
    };
    window.addEventListener("mousemove", onMove);

    const rows = Array.from(
      section.querySelectorAll<HTMLElement>(".prop-row")
    );
    const rowCleanups: (() => void)[] = [];

    if (motionSafe()) {
      rows.forEach((row) => {
        const nameEl = row.querySelector<HTMLElement>(".prop-name");
        const lineEl = row.querySelector<HTMLElement>(".prop-line");

        const onEnter = () => {
          thumb.src = row.dataset.thumb ?? "";
          gsap.to(thumb, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" });
          if (nameEl) gsap.to(nameEl, { x: -10, duration: 0.4, ease: "expo.out" });
          if (lineEl) gsap.to(lineEl, { scaleX: 1, duration: 0.4, ease: "expo.out" });
        };

        const onLeave = () => {
          gsap.to(thumb, { opacity: 0, scale: 0.88, duration: 0.35 });
          if (nameEl) gsap.to(nameEl, { x: 0, duration: 0.4, ease: "expo.out" });
          if (lineEl) gsap.to(lineEl, { scaleX: 0, duration: 0.35, ease: "expo.out" });
        };

        row.addEventListener("mouseenter", onEnter);
        row.addEventListener("mouseleave", onLeave);
        rowCleanups.push(() => {
          row.removeEventListener("mouseenter", onEnter);
          row.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    return () => {
      window.removeEventListener("mousemove", onMove);
      rowCleanups.forEach((fn) => fn());
    };
  }, []);

  useGSAP(
    () => {
      if (!motionSafe()) return;
      gsap.from(".accordion-item", {
        opacity: 0,
        y: 24,
        filter: "blur(4px)",
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <>
      {/* ── Scoped styles ───────────────────────────────────────────── */}
      <style>{`
        /* ── PropertiesList mobile ───────────────────────────────────── */
        @media (max-width: 639px) {
          /* Less left indent on accordion content */
          .accordion-content-inner { padding-left: 1rem !important; }
          /* Hide /See more text to save space */
          .prop-see-more { display: none; }
          /* Slightly tighter row padding */
          .prop-row { padding-top: 1.1rem !important; padding-bottom: 1.1rem !important; }
          /* Section header: wrap on narrow screens */
          .props-header { flex-wrap: wrap; gap: 0.5rem; }
          .props-header span:last-child { display: none; }
        }

        /* Button reset for accordion trigger rows */
        .prop-row {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          width: 100%;
          padding: 1.5rem 0;
          position: relative;
          cursor: pointer;
        }
        .prop-row:focus-visible {
          outline: 1px solid rgba(212,135,58,0.4);
          outline-offset: -1px;
        }

        /* Radix accordion content height animation */
        .accordion-content {
          overflow: hidden;
        }
        .accordion-content[data-state="open"] {
          animation: accordion-open 0.32s cubic-bezier(0.87, 0, 0.13, 1);
        }
        .accordion-content[data-state="closed"] {
          animation: accordion-close 0.26s cubic-bezier(0.87, 0, 0.13, 1);
        }
        @keyframes accordion-open {
          from { height: 0; opacity: 0; }
          to   { height: var(--radix-accordion-content-height); opacity: 1; }
        }
        @keyframes accordion-close {
          from { height: var(--radix-accordion-content-height); opacity: 1; }
          to   { height: 0; opacity: 0; }
        }
      `}</style>

      {/* ── Floating thumbnail — fixed, cursor-tracked via quickTo ───── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={thumbRef}
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        alt=""
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "220px",
          height: "155px",
          objectFit: "cover",
          borderRadius: "2px", // the only rounded element in the product
          pointerEvents: "none",
          zIndex: 100,
        }}
      />

      {/* ── Section ─────────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        style={{
          position: "relative",
          backgroundColor: "#0C0C0E",
          paddingTop: "clamp(4rem,8vh,7rem)",
          paddingBottom: "clamp(4rem,8vh,7rem)",
          paddingLeft: "clamp(1.5rem,5vw,5rem)",
          paddingRight: "clamp(1.5rem,5vw,5rem)",
        }}
      >
        <Crosshairs color="rgba(200,184,154,0.3)" label="(03) — Portfolio" />
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

          {/* Section header labels */}
          <div
            className="props-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: "#C8B89A",
                textTransform: "uppercase",
              }}
            >
              /Our Properties
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                color: "#C8B89A",
                textTransform: "uppercase",
              }}
            >
              What Akshar does really well
            </span>
          </div>

          {/* Top rule */}
          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(255,255,255,0.08)",
              marginTop: "1rem",
            }}
          />

          {/* ── Accordion rows ──────────────────────────────────────── */}
          <Accordion.Root type="single" collapsible>
            {properties.map((prop) => (
              <Accordion.Item
                key={prop.id}
                value={prop.id}
                className="accordion-item"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/*
                  Trigger = the visible row.
                  data-thumb: src swapped imperatively on mouseenter.
                  .prop-name + .prop-line: targeted by useEffect GSAP.
                */}
                <Accordion.Trigger
                  className="prop-row"
                  data-thumb={prop.thumb}
                >
                  {/* /01 — amber mono ID */}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      color: "#D4873A",
                      textTransform: "uppercase",
                      width: "4rem",
                      flexShrink: 0,
                    }}
                  >
                    /{prop.id}
                  </span>

                  {/* Property name — Cormorant 300, nudges x:-10 on hover */}
                  <span
                    className="prop-name"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.8rem,3vw,2.8rem)",
                      fontWeight: 300,
                      color: "#FAFAF8",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.1,
                    }}
                  >
                    {prop.name}
                  </span>

                  {/* /See more — right-aligned mono */}
                  <span
                    className="prop-see-more"
                    style={{
                      marginLeft: "auto",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      color: "#C8B89A",
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    /See more
                  </span>

                  {/* Amber underline — scaleX:0 → 1 on hover, origin left */}
                  <span
                    className="prop-line"
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "#D4873A",
                      transform: "scaleX(0)",
                      transformOrigin: "left center",
                      display: "block",
                    }}
                  />
                </Accordion.Trigger>

                {/* Expanded content */}
                <Accordion.Content className="accordion-content">
                  <div
                    className="accordion-content-inner"
                    style={{
                      padding: "0 0 1.75rem 4rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 300,
                        fontSize: "0.9rem",
                        color: "rgba(200,184,154,0.72)",
                        lineHeight: 1.72,
                        maxWidth: "38rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {prop.description}
                    </p>
                    <a
                      href={`/properties/${prop.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/properties/${prop.slug}`, prop.name);
                      }}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "#D4873A",
                        textDecoration: "none",
                      }}
                    >
                      View Property →
                    </a>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>

        </div>
      </section>
    </>
  );
}
