---
name: image-hover-distortion
description: Akshar Realty image hover and reveal effects. Invoke for property card hover effects, the floating thumbnail in the properties list, or any image reveal animation. Akshar uses CSS clip-path reveals and GSAP scale/opacity — NOT full WebGL displacement, keeping perf high.
---

# Image Hover Distortion — Akshar Realty

Akshar keeps image effects lightweight: GSAP-driven scale + clip-path reveals rather than full WebGL displacement. This keeps bundle size low and perf high across devices.

## Property card hover (scale + subtle lift)
```css
.property-card { transition: none; } /* let GSAP own it */
.property-card-image { transform-origin: center; }
```
```ts
card.addEventListener('mouseenter', () => {
  gsap.to(card, { y: -6, boxShadow: '0 20px 60px rgba(12,12,14,0.25)', duration: 0.4, ease: 'expo.out' })
  gsap.to(card.querySelector('.card-image'), { scale: 1.04, duration: 0.6, ease: 'power3.out' })
})
card.addEventListener('mouseleave', () => {
  gsap.to(card, { y: 0, boxShadow: '0 8px 40px rgba(12,12,14,0.15)', duration: 0.5, ease: 'expo.out' })
  gsap.to(card.querySelector('.card-image'), { scale: 1, duration: 0.5, ease: 'power3.out' })
})
```

## Property list floating thumbnail (the premium hover-reveal)
See kinetic-type-and-scroll skill for the full quickTo implementation.
The thumbnail itself:
```css
.hover-thumb {
  position: fixed; pointer-events: none; z-index: 100;
  width: 220px; height: 155px; object-fit: cover;
  border-radius: 2px; /* only rounded element in the design */
  opacity: 0; transform: scale(0.88);
  will-change: transform, opacity;
}
```

## Scroll reveal (image wipe — feature section hero image)
```ts
gsap.from('.feature-image', {
  clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'expo.inOut',
  scrollTrigger: { trigger: '.feature-section', start: 'top 65%', once: true }
})
// After animation: remove will-change
// onComplete: () => { el.style.willChange = 'auto' }
```

## Reduced motion fallback
Under prefers-reduced-motion: skip all hover transforms, skip clip-path wipe, show images at full opacity immediately.
```ts
if (!motionSafe()) {
  gsap.set('.feature-image', { clipPath: 'inset(0 0% 0 0)', opacity: 1 })
  return
}
```
