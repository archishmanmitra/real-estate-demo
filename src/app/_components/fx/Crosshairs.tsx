"use client";

/*
 * Technical SVG registration marks for section corners (vorszk-style framing),
 * with an optional mono coordinate label. Parent must be position:relative.
 */

const Mark = ({ style }: { style: React.CSSProperties }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    aria-hidden="true"
    style={{ position: "absolute", ...style }}
  >
    <line x1="7" y1="0" x2="7" y2="14" stroke="currentColor" strokeWidth="1" />
    <line x1="0" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export function Crosshairs({
  color = "rgba(200,184,154,0.4)",
  inset = "1.25rem",
  label,
}: {
  color?: string;
  inset?: string;
  label?: string;
}) {
  return (
    <div aria-hidden="true" style={{ color, pointerEvents: "none" }}>
      <Mark style={{ top: inset, left: inset }} />
      <Mark style={{ top: inset, right: inset }} />
      <Mark style={{ bottom: inset, left: inset }} />
      <Mark style={{ bottom: inset, right: inset }} />
      {label && (
        <span
          style={{
            position: "absolute",
            bottom: inset,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
