# Akshar Realty — Starter

Premium animation-heavy real estate website for Akshar. Built on Next.js 15 + GSAP + Lenis + React Three Fiber. Awwwards-tier aesthetic.

## Quick start

```bash
# 1. Open this folder in Claude Code
claude

# 2. Paste Prompt 1.1 from docs/PROMPTS.md
# 3. Follow the prompts in order
```

## Folder map
```
akshar-realty/
├── CLAUDE.md              ← Master context (Claude Code reads this automatically)
├── docs/
│   ├── DESIGN.md          ← Full design system (palette, type, layout, motion grammar)
│   ├── SETUP.md           ← Technical setup steps with code
│   ├── COPY.md            ← All brand copy (use this, never lorem ipsum)
│   └── PROMPTS.md         ← Step-by-step Claude Code prompts — START HERE
├── .claude/
│   └── skills/            ← 6 project-specific skills (Claude Code reads automatically)
│       ├── award-taste/
│       ├── motion-orchestrator/
│       ├── kinetic-type-and-scroll/
│       ├── webgl-r3f-scenes/
│       ├── image-hover-distortion/
│       └── perf-and-motion-a11y/
├── src/                   ← Will be created by create-next-app
└── public/                ← Add your property photos here
```

## Design identity
- **Palette:** Ink `#0C0C0E` · Ivory `#F5F0E8` · Stone `#C8B89A` · Amber `#D4873A`
- **Type:** Cormorant Garamond (display) · DM Sans (body) · DM Mono (labels)
- **Signature:** "AKSHAR" giant wordmark sits BEHIND the hero photo, parallaxes slower than the image

## Motion beat sheet
1. Hero load → wordmark ↓ → image → tagline chars → labels
2. Discovery scroll → headline words stagger up + property cards scatter from right
3. Properties hover → amber underline + cursor thumbnail follows mouse
4. Feature scroll → amenity cards pop in staggered
5. CTA scroll → headline SplitText reveal

## Sections
1. Hero (full-bleed cinematic + AKSHAR wordmark)
2. Discovery (ivory, scatter cards, stacked headline)
3. Properties (dark, hover-reveal accordion list)
4. Feature (full-bleed house + amenity pop-overs)
5. CTA + Footer

## Photos needed
Add to `public/images/properties/`:
- `heights.jpg`, `greens.jpg`, `villas.jpg`, `residences.jpg`, `skyline.jpg`, `meadows.jpg`
- Thumbnails: same names with `-thumb.jpg` suffix
- `grain.png` (200×200px noise, from grainy.dev)

Placeholder: Unsplash query ideas in `docs/SETUP.md`.
