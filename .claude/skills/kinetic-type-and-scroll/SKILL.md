---
name: kinetic-type-and-scroll
description: Akshar Realty GSAP + Lenis production code. Invoke for: Lenis setup, SplitText reveals, parallax, pinned sections, card scatter, hover-reveal property list, any scroll-driven animation. Contains copy-paste code tuned for this project.
---

# Kinetic Type & Scroll — Akshar Realty

Always use `useGSAP()` from `@gsap/react`. Import from `src/lib/gsap.ts`. Check `motionSafe()` before every animation block.

## Lenis + GSAP wiring (already in src/lib/lenis.tsx — do NOT redo)
```ts
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

## AKSHAR wordmark page-load timeline
```tsx
useGSAP(() => {
  if (!motionSafe()) return
  const tl = gsap.timeline()
  tl.from('.akshar-wordmark', { y: -60, opacity: 0, duration: 1.2, ease: 'power3.out' })
    .from('.hero-image', { opacity: 0, duration: 1 }, 0.3)
    .from('.hero-tagline .char', { yPercent: 100, stagger: 0.03, duration: 0.8, ease: 'power3.out' }, 0.8)
    .from('.hero-sub', { opacity: 0, y: 12, duration: 0.6 }, 1.1)
    .from('.hero-labels span', { opacity: 0, x: 20, stagger: 0.1, duration: 0.5 }, 1.1)
}, { scope: heroRef })
```

## AKSHAR wordmark parallax (scrubbed)
```ts
// Wordmark moves faster than image → depth separation
gsap.to('.akshar-wordmark', { yPercent: 40, ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
})
gsap.to('.hero-image-wrap', { yPercent: 20, ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
})
```

## SplitText reveal (for Discovery headline and CTA)
```tsx
const split = SplitText.create(el.current, { type: 'words,lines', mask: 'lines' })
gsap.from(split.words, { yPercent: 100, stagger: 0.08, duration: 0.9, ease: 'power3.out',
  scrollTrigger: { trigger: el.current, start: 'top 75%', once: true }
})
// Cleanup: return () => split.revert()
```

## Property cards scatter-in
```tsx
const cards = gsap.utils.toArray<HTMLElement>('.property-card')
cards.forEach((card) => {
  gsap.from(card, {
    x: 280, opacity: 0, rotation: Number(card.dataset.rotate),
    duration: 0.9, ease: 'power4.out',
    scrollTrigger: { trigger: '.discovery-section', start: 'top 70%', once: true },
  })
})
// Each card has data-rotate="-4" | "3" | "-1" | "5" in JSX
```

## Cursor-following thumbnail (Properties section)
```tsx
const img = thumbRef.current
const setX = gsap.quickTo(img, 'x', { duration: 0.5, ease: 'expo' })
const setY = gsap.quickTo(img, 'y', { duration: 0.5, ease: 'expo' })

// In useEffect (not useGSAP — this is a DOM event, not a GSAP context)
const onMove = (e: MouseEvent) => { setX(e.clientX); setY(e.clientY) }
window.addEventListener('mousemove', onMove)

// Per row: mouseenter / mouseleave
row.addEventListener('mouseenter', () => {
  img.src = row.dataset.thumb!
  gsap.to(img, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' })
  gsap.to(rowNameEl, { x: -10, duration: 0.4, ease: 'expo.out' })
  gsap.to(rowLineEl, { scaleX: 1, duration: 0.4, ease: 'expo.out' }) // amber underline
})
row.addEventListener('mouseleave', () => {
  gsap.to(img, { opacity: 0, scale: 0.88, duration: 0.35 })
  gsap.to(rowNameEl, { x: 0, duration: 0.4, ease: 'expo.out' })
  gsap.to(rowLineEl, { scaleX: 0, duration: 0.35, ease: 'expo.out' })
})
// Only on pointer: fine
if (!window.matchMedia('(pointer: fine)').matches) return
```

## Amenity cards pop-in (Feature section)
```ts
gsap.from('.amenity-card', { scale: 0.85, opacity: 0, y: 20, stagger: 0.15, duration: 0.7, ease: 'power3.out',
  scrollTrigger: { trigger: '.feature-section', start: 'top 60%', once: true, invalidateOnRefresh: true }
})
```

## Nav bg scroll transition
```ts
ScrollTrigger.create({
  start: 'top -80', onUpdate: (self) => {
    gsap.to('.navbar', { backgroundColor: self.progress > 0 ? 'rgba(12,12,14,0.85)' : 'transparent',
      backdropFilter: self.progress > 0 ? 'blur(12px)' : 'none', duration: 0.4 })
  }
})
```
