"use client";

/*
 * Terrain wave — mouse-reactive wireframe topography in stone/amber.
 * Vertex shader displaces a dense plane with layered sines; the cursor adds a
 * local swell. Lazy-mounts when scrolled near, refs only in useFrame.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const TerrainCanvas = dynamic(() => import("./TerrainCanvas"), { ssr: false });

export function TerrainWave() {
  const ref = useRef<HTMLElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Topography of Akshar locations"
      style={{
        position: "relative",
        height: "72vh",
        backgroundColor: "#0C0C0E",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {mount && <TerrainCanvas />}

      {/* Labels over the canvas */}
      <div
        className="absolute left-0 right-0 flex justify-between"
        style={{ top: "2rem", padding: "0 clamp(1.5rem,5vw,5rem)", zIndex: 10 }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "rgba(200,184,154,0.7)",
            textTransform: "uppercase",
          }}
        >
          /Topography
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            color: "rgba(200,184,154,0.7)",
            textTransform: "uppercase",
          }}
        >
          From the city grid to the coastline
        </span>
      </div>

      <p
        className="absolute"
        style={{
          bottom: "2.5rem",
          left: "clamp(1.5rem,5vw,5rem)",
          zIndex: 10,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.6rem,3.5vw,2.6rem)",
          fontWeight: 300,
          fontStyle: "italic",
          color: "#F5F0E8",
          margin: 0,
          maxWidth: "24ch",
          lineHeight: 1.25,
        }}
      >
        Mumbai. Pune. The Konkan coast.
      </p>
    </section>
  );
}
