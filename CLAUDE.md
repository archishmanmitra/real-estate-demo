# Akshar Realty — Claude Code Master Context

## Project Identity
**Client:** Akshar Real Estate Company (India)
**Aesthetic target:** Awwwards/FWA-tier, cinematic real estate — inspired by the reference video (Zillow concept). Better than the reference. Not a copy — a new identity.
**Framework:** Next.js 15 App Router · TypeScript · Tailwind CSS v4 · GSAP (free, all plugins incl. SplitText) · Lenis · Motion (framer-motion → motion/react) · React Three Fiber + drei

## Design Identity (do not deviate without asking)
See `docs/DESIGN.md` for the full system. Short version:
- **Name treatment:** "AKSHAR" in massive display type (clamp 6rem → 16rem), bleeds behind the hero image — the signature move
- **Palette:** Ink `#0C0C0E`, Ivory `#F5F0E8`, Warm Stone `#C8B89A`, Amber `#D4873A`, Muted Steel `#6B7280`
- **Type:** Display = `Cormorant Garamond` (editorial serif, luxury feel) · Body = `DM Sans` · Mono label = `DM Mono`
- **Tone:** Cinematic luxury, Indian heritage warmth. NOT generic SaaS.
- **Motion grammar:** One orchestrated sequence per section. No scattered effects. scroll-driven, purposeful.

## Sections (in order)
1. **Hero** — full-bleed cinematic photo, "AKSHAR" giant wordmark parallax BEHIND image, nav bar, animated tagline, social links left
2. **Discovery** — warm ivory bg, stacked editorial text ("Homes. Plots. Villas. Projects."), scattered property cards animate in from right with rotation
3. **Properties** — dark ink bg, numbered hover-reveal accordion list (`/01 Akshar Heights → /06 Akshar Villas`), hover shows floating thumbnail
4. **Feature Detail** — full-bleed property image with floating UI cards (amenity pop-overs that appear on scroll)
5. **About / CTA** — warm grain texture, large serif quote, "Let's Find Your Home" CTA

## Skills to invoke (in `.claude/skills/`)
Always invoke in this order for any design/motion/build task:
1. `award-taste` — before any UI work
2. `motion-orchestrator` — before any animation code
3. `kinetic-type-and-scroll` — for GSAP/Lenis/SplitText
4. `webgl-r3f-scenes` — for any Three.js/shader work
5. `image-hover-distortion` — for image hover effects
6. `perf-and-motion-a11y` — on every polish pass

## Tech Rules (non-negotiable)
- NEVER use `setState` for per-frame animation — use GSAP refs or R3F `useFrame`
- ALWAYS use `useGSAP()` from `@gsap/react` (not raw useEffect for GSAP)
- Register plugins once at module top: `gsap.registerPlugin(ScrollTrigger, SplitText)`
- Lenis MUST be wired to the GSAP ticker (see `docs/SETUP.md`)
- `next/dynamic` + `ssr:false` for ALL Canvas components
- Wrap 3D assets in `<Suspense>`; call `useGLTF.preload()` after first paint
- `invalidateOnRefresh: true` on all responsive ScrollTriggers
- Always `split.revert()` in cleanup
- `prefers-reduced-motion` gated in EVERY motion component

## File Conventions
```
src/app/_components/
  nav/         → Navbar.tsx
  hero/        → HeroSection.tsx, AksharWordmark.tsx, HeroParallax.tsx
  cards/       → PropertyCard.tsx, ScatterCards.tsx
  services/    → DiscoverySection.tsx
  properties/  → PropertiesList.tsx, HoverThumb.tsx
  features/    → FeatureSection.tsx, AmenityCard.tsx
  footer/      → Footer.tsx
src/lib/
  lenis.tsx    → SmoothScrollProvider
  gsap.ts      → plugin registration + matchMedia helpers
  data.ts      → property data (typed)
```

## What NOT to do
- No Inter, Roboto, Arial, or Space Grotesk as display
- No purple/blue gradients
- No generic "card grid" layouts
- No emoji as iconography
- No scattered motion (every animation must serve hierarchy)
- No lorem ipsum — use real Akshar copy from `docs/COPY.md`
- No SSR on Canvas/WebGL components

## Deployment target
Vercel. Run `next build` before committing. Lighthouse score target: ≥ 90 performance.
