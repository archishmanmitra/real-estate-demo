---
name: perf-and-motion-a11y
description: Akshar Realty quality floor. Invoke on every polish pass, after every build phase, and whenever anything feels slow or accessibility is questioned. Enforces prefers-reduced-motion across GSAP/Motion/Lenis, image optimization, CLS prevention, Lighthouse targets, and keyboard/screen-reader requirements for this project.
---

# Perf & A11y — Akshar Realty

## Reduced-motion checklist (verify EVERY animation source)

- **GSAP:** `if (!motionSafe()) return` at top of every `useGSAP` block. `motionSafe()` is in `src/lib/gsap.ts`
- **Motion:** `const reduce = useReducedMotion()` → skip transforms or set `duration:0`
- **Lenis:** in `SmoothScrollProvider`, check `prefers-reduced-motion`; if true, set `lerp:1` (instant scroll)
- **CSS backup:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration:.01ms!important; transition-duration:.01ms!important; scroll-behavior:auto!important; }
  }
  ```
  (already in globals.css — verify it's there)

## Keyboard / ARIA requirements

- **Navbar links:** `next/link` = native `<a>` = keyboard OK
- **Enquire Now button:** `<button>` element, not `<div>`
- **Property accordion rows:** `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter/Space triggers expand)
- **Radix Accordion (expand content):** ARIA handled by Radix — don't override role/aria-expanded manually
- **Property card hearts:** `aria-label="Save Akshar Heights"` (use property name)
- **Hover thumbnail:** `aria-hidden="true"` (decorative)
- **All images:** meaningful `alt` text (not "property image" — use the property name and location)
- **Focus rings:** `outline: 2px solid #D4873A; outline-offset: 3px` on all `:focus-visible` elements

## Image / performance

- Hero image: `priority` prop on next/image, explicit `width`/`height` or `fill` with sized parent
- All other images: `loading="lazy"`, explicit dimensions to prevent CLS
- Target size: hero < 300kb WebP, property images < 200kb WebP, thumbnails < 80kb
- Use `next/image` — never raw `<img>` for property images
- grain.png: 200×200px, < 5kb

## CLS prevention

- Hero: set explicit `min-height: 100svh` so the section doesn't shift when image loads
- Scatter cards: parent container has explicit height (don't rely on card stack for height)
- Font: using `next/font` with `display:'swap'` — FOUT is acceptable, FOUT with layout shift is not. Ensure fallback font size is close to Cormorant using `size-adjust` if needed.

## Lighthouse targets
- Performance: ≥ 85
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 90

## Ship checklist
- [ ] `motionSafe()` guard in every GSAP `useGSAP` block
- [ ] `useReducedMotion()` in every Motion component
- [ ] Lenis lerp:1 under reduced-motion
- [ ] All images: `alt`, explicit dimensions, WebP, sized
- [ ] Hero image: `priority` prop
- [ ] Accordion rows: keyboard accessible
- [ ] All buttons: are actual `<button>` elements
- [ ] Focus rings: amber, visible
- [ ] `pnpm build` passes with zero errors
- [ ] Lighthouse run on Vercel preview URL
