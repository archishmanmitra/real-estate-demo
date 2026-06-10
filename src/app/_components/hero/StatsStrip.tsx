"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, motionSafe } from "@/lib/gsap";

const STATS = [
  { value: 180, suffix: "+", label: "Projects Delivered" },
  { value: 16,  suffix: "",  label: "Years Building Trust" },
  { value: 3,   suffix: "",  label: "Cities" },
  { value: 2400, suffix: "+", label: "Families Housed" },
] as const;

export function StatsStrip() {
  const stripRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionSafe()) return;

      // Staggered entrance
      gsap.from(".stat-item", {
        opacity: 0,
        y: 20,
        filter: "blur(4px)",
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: stripRef.current,
          start: "top 88%",
          once: true,
        },
      });

      // Count-up per stat
      const counters = gsap.utils.toArray<HTMLElement>(".stat-value", stripRef.current);
      counters.forEach((el) => {
        const target = parseInt(el.dataset.target ?? "0", 10);
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 1.8,
          ease: "power3.out",
          onUpdate() {
            el.textContent = Math.round(obj.n).toLocaleString();
          },
          scrollTrigger: {
            trigger: stripRef.current,
            start: "top 88%",
            once: true,
          },
        });
      });
    },
    { scope: stripRef }
  );

  return (
    <section
      ref={stripRef}
      aria-label="Key statistics"
      style={{
        backgroundColor: "#0C0C0E",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          max-width: 1400px;
          margin: 0 auto;
          padding-left: clamp(1.5rem, 5vw, 5rem);
          padding-right: clamp(1.5rem, 5vw, 5rem);
        }
        @media (min-width: 768px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
          .stat-item:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.08); border-bottom: none; }
        }
        .stat-item:nth-child(1),
        .stat-item:nth-child(2) { border-bottom: 1px solid rgba(255,255,255,0.08); }
        @media (min-width: 768px) {
          .stat-item:nth-child(1),
          .stat-item:nth-child(2) { border-bottom: none; }
        }
      `}</style>

      <div className="stats-grid">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="stat-item"
            style={{
              padding: "clamp(1.75rem,3.5vh,2.75rem) 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
            }}
          >
            {/* Number row */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.05em",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem,4.5vw,4rem)",
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              <span
                className="stat-value"
                data-target={stat.value}
                style={{ color: "#D4873A" }}
              >
                {stat.value.toLocaleString()}
              </span>
              {stat.suffix && (
                <span style={{ color: "#C8B89A" }}>{stat.suffix}</span>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.14em",
                color: "rgba(200,184,154,0.55)",
                textTransform: "uppercase",
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
