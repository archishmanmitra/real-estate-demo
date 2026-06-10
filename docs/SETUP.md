# Akshar Realty — Technical Setup

## Prerequisites
- Node.js 20+
- pnpm (preferred) or npm

---

## Step 1 — Create Next.js project

```bash
npx create-next-app@latest akshar-realty \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
cd akshar-realty
```

---

## Step 2 — Install all dependencies

```bash
pnpm add gsap @gsap/react lenis motion \
  three @react-three/fiber @react-three/drei @react-three/postprocessing \
  @radix-ui/react-accordion @radix-ui/react-dialog \
  clsx tailwind-merge

pnpm add -D @types/three vite-plugin-glsl
```

---

## Step 3 — Tailwind v4 config

In `src/app/globals.css`, add at the top:

```css
@import "tailwindcss";

@theme {
  --color-ink:    #0C0C0E;
  --color-ivory:  #F5F0E8;
  --color-stone:  #C8B89A;
  --color-amber:  #D4873A;
  --color-steel:  #6B7280;
  --color-white:  #FAFAF8;

  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body:    "DM Sans", system-ui, sans-serif;
  --font-mono:    "DM Mono", monospace;

  --text-wordmark: clamp(5rem, 15vw, 16rem);
  --text-display:  clamp(2.5rem, 6vw, 5rem);
  --text-xl:       clamp(1.5rem, 3vw, 2.5rem);
  --text-label:    0.7rem;
}

/* Grain overlay utility */
.grain::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image: url('/images/grain.png');
  opacity: 0.06;
  z-index: 9999;
}

/* Reduced motion baseline */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Step 4 — Google Fonts (next/font)

In `src/app/layout.tsx`:

```tsx
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "600"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-ivory font-body antialiased">{children}</body>
    </html>
  );
}
```

---

## Step 5 — GSAP registration (once, at module level)

Create `src/lib/gsap.ts`:

```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Reduced motion helper
export const motionSafe = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Quick matchMedia wrapper for gsap.matchMedia
export const mm = gsap.matchMedia();

export { gsap, ScrollTrigger, SplitText };
```

---

## Step 6 — Lenis smooth scroll provider

Create `src/lib/lenis.tsx`:

```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
  return <>{children}</>;
}
```

Wrap the root layout body in `<SmoothScrollProvider>`.

---

## Step 7 — Property data

Create `src/lib/data.ts`:

```ts
export type Property = {
  id: string;
  slug: string;
  name: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  type: "apartment" | "villa" | "plot" | "residential";
  image: string;
  thumb: string;
  description: string;
  amenities: string[];
};

export const properties: Property[] = [
  {
    id: "01",
    slug: "akshar-heights",
    name: "Akshar Heights",
    location: "Andheri West, Mumbai",
    price: "₹2.4 Cr",
    beds: 3, baths: 3, sqft: 1850,
    type: "apartment",
    image: "/images/properties/heights.jpg",
    thumb: "/images/properties/heights-thumb.jpg",
    description: "Elevated living above the city. 28-storey tower with panoramic views, rooftop pool, and concierge.",
    amenities: ["Rooftop Pool", "Concierge", "EV Charging", "Co-work Lounge"],
  },
  {
    id: "02",
    slug: "akshar-greens",
    name: "Akshar Greens",
    location: "Powai, Mumbai",
    price: "₹1.8 Cr",
    beds: 2, baths: 2, sqft: 1200,
    type: "apartment",
    image: "/images/properties/greens.jpg",
    thumb: "/images/properties/greens-thumb.jpg",
    description: "A garden community woven through native landscaping. 400 units, zero surface parking.",
    amenities: ["Landscaped Courts", "Jogging Trail", "Clubhouse", "Solar Powered"],
  },
  {
    id: "03",
    slug: "akshar-villas",
    name: "Akshar Villas",
    location: "Alibaug, Raigad",
    price: "₹4.2 Cr",
    beds: 4, baths: 4, sqft: 3200,
    type: "villa",
    image: "/images/properties/villas.jpg",
    thumb: "/images/properties/villas-thumb.jpg",
    description: "Weekend villa estates at the coast. Private plunge pool, sea-facing terrace, 2-acre plots.",
    amenities: ["Private Pool", "Sea View", "2-Acre Plot", "24hr Security"],
  },
  {
    id: "04",
    slug: "akshar-residences",
    name: "Akshar Residences",
    location: "Bandra East, Mumbai",
    price: "₹3.1 Cr",
    beds: 3, baths: 3, sqft: 2100,
    type: "residential",
    image: "/images/properties/residences.jpg",
    thumb: "/images/properties/residences-thumb.jpg",
    description: "Heritage neighbourhood, contemporary interiors. Stone-clad facade, double-height lobby.",
    amenities: ["Double-Height Lobby", "Stone Facade", "Gym", "Terrace Garden"],
  },
  {
    id: "05",
    slug: "akshar-skyline",
    name: "Akshar Skyline",
    location: "Lower Parel, Mumbai",
    price: "₹5.8 Cr",
    beds: 4, baths: 4, sqft: 3600,
    type: "apartment",
    image: "/images/properties/skyline.jpg",
    thumb: "/images/properties/skyline-thumb.jpg",
    description: "Mumbai's financial district at your feet. Sky villas on floors 40–55, private elevator lobbies.",
    amenities: ["Sky Villa", "Private Elevator", "Infinity Pool", "Business Lounge"],
  },
  {
    id: "06",
    slug: "akshar-meadows",
    name: "Akshar Meadows",
    location: "Pune, Hinjawadi",
    price: "₹95 Lac",
    beds: 2, baths: 2, sqft: 980,
    type: "apartment",
    image: "/images/properties/meadows.jpg",
    thumb: "/images/properties/meadows-thumb.jpg",
    description: "First home, done right. Smartly planned 2BHKs near the IT corridor with forest-edge views.",
    amenities: ["Forest Edge", "Smart Home", "EV Ready", "Community Hall"],
  },
];

export const discoveryCopy = {
  eyebrow: "EXPLORE AKSHAR",
  headline: ["Homes.", "Plots.", "Villas.", "Projects."],
  body: "We don't just build structures — we create addresses worth returning to. Akshar Realty has crafted over 12 landmark projects across Mumbai, Pune, and the Konkan coast.",
  searchPlaceholder: "Search by location or project name…",
};
```

---

## Step 8 — next.config.ts

```ts
import type { NextConfig } from "next";
const config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["gsap", "@react-three/drei"],
  },
};
export default config;
```

---

## Assets needed (add to `/public/images/`)

- `grain.png` — 200×200px seamless noise texture (generate free at grainy.dev or noisetexture.com)
- `properties/heights.jpg` etc. — cinematic property photos (use Unsplash/Pexels for dev, replace with real photography for prod). Target: 1600×900px, compressed to <200kb WebP.
- Property thumbnails: 440×320px each

## Recommended Unsplash queries for placeholder images
- "luxury apartment Mumbai aerial" → heights
- "green residential complex" → greens
- "beach villa alibaug" → villas
- "modern residential building Mumbai" → residences
- "luxury penthouse city view" → skyline
- "modern apartment forest" → meadows
