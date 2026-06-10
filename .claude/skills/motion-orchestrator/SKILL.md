---
name: motion-orchestrator
description: Akshar Realty animation stack dispatcher. Invoke AFTER award-taste whenever writing any animation, motion, scroll, or interaction code. Picks the right library per job (GSAP vs Motion vs R3F) and enforces the Lenis+GSAP ticker setup. Prevents common mistakes like setState in useFrame, missing plugin registration, and ScrollTrigger without invalidateOnRefresh.
---

# Motion Orchestrator — Akshar Realty

## Stack decision rules

| Job | Tool | Why |
|---|---|---|
| Any scroll-driven, timeline, or perf-critical animation | **GSAP + ScrollTrigger** | Frame-accurate, no React re-renders |
| SplitText kinetic type reveals | **GSAP SplitText** (free since 2025) | Best-in-class, now open |
| Smooth scroll | **Lenis** wired to GSAP ticker | Native scroll preserved, ST synced |
| UI state, hover, gestures, page transitions | **Motion** (`motion/react`) | Declarative, React-native |
| 3D, shaders, WebGL | **R3F + drei** | Only if a section calls for it |
| Accessible widgets (accordion, modal) | **Radix UI** | Handles ARIA, focus, keyboard |

## Mandatory setup (check before writing motion code)

1. `src/lib/gsap.ts` exists and registers plugins: `gsap.registerPlugin(ScrollTrigger, SplitText)`
2. `src/lib/lenis.tsx` exists and wires: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add(raf)` + `gsap.ticker.lagSmoothing(0)`
3. `SmoothScrollProvider` wraps the root layout
4. All animations use `useGSAP()` from `@gsap/react` — never raw `useEffect` for GSAP
5. All Canvas components use `next/dynamic({ ssr: false })`

## Common mistakes — catch before writing

- `setState` inside `useFrame` → use refs
- GSAP inside `useEffect` without `useGSAP` → cleanup leaks
- `SplitText` without `split.revert()` in cleanup → DOM leak on remount
- ScrollTrigger on responsive element without `invalidateOnRefresh: true` → breaks on resize
- Missing `once: true` on entrance animations that should fire once
- `will-change: transform` left on permanently → memory leak; remove in onComplete

## Akshar motion beat sheet (reference)

```
Section          Trigger           Library    Signature
─────────────────────────────────────────────────────────────────
Hero load        page mount        GSAP TL    wordmark ↓ → image → tagline chars → labels
Hero scroll      scrub             GSAP ST    wordmark y+40%, image y+20%, tagline y+15%
Discovery        scroll enter 70%  GSAP       words stagger up (SplitText) + cards scatter in
Properties       mouse hover       GSAP       quickTo cursor → amber underline → name nudge
Properties row   click             Radix+CSS  accordion expand (height transition)
Feature          scroll enter 60%  GSAP       amenity cards pop in, stagger 0.15s
CTA              scroll enter 75%  GSAP       headline SplitText chars reveal
Page transition  route change      Motion     fade via next-view-transitions
Enquiry modal    button click      Motion     AnimatePresence slide up
```
