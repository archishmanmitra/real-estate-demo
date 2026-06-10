"use client";

/*
 * Rotating SVG badge — circular text "AKSHAR REALTY · EST 2008 · MUMBAI ·"
 * slow CSS spin (paused under reduced motion), amber crosshair at center.
 */

export function RotatingBadge({ size = 110 }: { size?: number }) {
  return (
    <div aria-hidden="true" style={{ width: size, height: size }}>
      <style>{`
        @keyframes badge-spin { to { transform: rotate(360deg); } }
        .badge-spin { animation: badge-spin 18s linear infinite; transform-origin: 50% 50%; }
        @media (prefers-reduced-motion: reduce) { .badge-spin { animation: none; } }
      `}</style>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <path
            id="badge-circle"
            d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
          />
        </defs>
        <g className="badge-spin">
          <text
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "8.2px",
              letterSpacing: "0.22em",
              fill: "rgba(200,184,154,0.75)",
              textTransform: "uppercase",
            }}
          >
            <textPath href="#badge-circle">
              AKSHAR REALTY · EST 2008 · MUMBAI ·
            </textPath>
          </text>
        </g>
        {/* center crosshair */}
        <g stroke="#D4873A" strokeWidth="0.8">
          <line x1="50" y1="44" x2="50" y2="56" />
          <line x1="44" y1="50" x2="56" y2="50" />
        </g>
      </svg>
    </div>
  );
}
