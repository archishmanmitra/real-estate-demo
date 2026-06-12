"use client";

/*
 * Foreground skyline cutout — sits IN FRONT of the AKSHAR wordmark so the
 * type reads as standing behind the city (andyhardy.co depth-sandwich).
 * Solid ink silhouette merges seamlessly into the ink section below.
 * Includes a construction crane and scattered lit amber windows.
 */

export function SkylineForeground({ className, preserveAspectRatio = "none" }: { className?: string; preserveAspectRatio?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 520"
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {/* ── City silhouette ─────────────────────────────────────────── */}
      <path
        fill="#0C0C0E"
        d="M0 520 L0 308
           H36 V258 H68 V308 H96 V218 H114 V198 H136 V218 H158 V308
           H206 V262 H248 V308
           H278 V168 H298 V146 H330 V168 H352 V308
           H392 V236 H434 V308
           H458 V128 H478 V100 H506 V128 H524 V308
           H554 V66 H572 V46 H616 V66 H636 V308
           H658 V40 H700 V308
           H726 V96 H768 V308
           H794 V58 H836 V308
           H858 V136 H892 V308
           H922 V206 H978 V308
           H1006 V244 H1044 V308
           H1072 V182 H1102 V308
           H1148 V274 H1198 V308
           H1238 V224 H1266 V308
           H1316 V282 H1362 V308
           H1402 V262 H1440 V308
           L1440 520 Z"
      />

      {/* antenna spires on the supertalls */}
      <rect x="677" y="0" width="3" height="42" fill="#0C0C0E" />
      <rect x="813" y="22" width="3" height="38" fill="#0C0C0E" />
      <circle cx="678.5" cy="0" r="2.5" fill="#D4873A" opacity="0.9" />

      {/* ── Construction crane (right of centre) ─────────────────────── */}
      <g fill="#0C0C0E">
        <rect x="947" y="118" width="6" height="92" />
        <rect x="896" y="114" width="128" height="5" />
        <rect x="1016" y="119" width="2" height="34" />
        <rect x="1010" y="153" width="14" height="10" />
        <path d="M896 114 L950 96 L953 114 Z" />
      </g>

      {/* ── Lit windows — sparse amber, the only colour ──────────────── */}
      <g fill="#D4873A">
        <rect x="306" y="190" width="5" height="7" opacity="0.55" />
        <rect x="318" y="226" width="5" height="7" opacity="0.35" />
        <rect x="486" y="150" width="5" height="7" opacity="0.6" />
        <rect x="470" y="200" width="5" height="7" opacity="0.4" />
        <rect x="497" y="244" width="5" height="7" opacity="0.3" />
        <rect x="584" y="96" width="5" height="7" opacity="0.6" />
        <rect x="600" y="142" width="5" height="7" opacity="0.45" />
        <rect x="568" y="188" width="5" height="7" opacity="0.35" />
        <rect x="672" y="78" width="5" height="7" opacity="0.65" />
        <rect x="686" y="130" width="5" height="7" opacity="0.4" />
        <rect x="668" y="186" width="5" height="7" opacity="0.5" />
        <rect x="740" y="130" width="5" height="7" opacity="0.55" />
        <rect x="752" y="180" width="5" height="7" opacity="0.35" />
        <rect x="806" y="92" width="5" height="7" opacity="0.6" />
        <rect x="820" y="148" width="5" height="7" opacity="0.45" />
        <rect x="868" y="170" width="5" height="7" opacity="0.4" />
        <rect x="938" y="232" width="5" height="7" opacity="0.4" />
        <rect x="1084" y="210" width="5" height="7" opacity="0.45" />
        <rect x="1248" y="248" width="5" height="7" opacity="0.4" />
      </g>
    </svg>
  );
}
