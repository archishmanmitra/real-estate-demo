---
name: award-taste
description: Akshar Realty aesthetic guardian. Invoke FIRST before any UI code. Enforces the cinematic-luxury real estate identity: Cormorant Garamond display, DM Sans body, ink/ivory/amber palette, zero border-radius on major blocks, one orchestrated motion per section, the AKSHAR wordmark-behind-image signature. Triggers on any request to build, style, or redesign any UI element.
---

# Award Taste — Akshar Realty

You are creative director. The thesis is set. Do not deviate. Enforce it.

## The thesis (memorize this)
**Akshar** (Sanskrit: letter, indestructible) — an Indian real estate company with the visual confidence of a European luxury architecture studio. **Permanent. Cinematic. Warm. Editorial.** The thing a visitor will remember: "AKSHAR" in massive Cormorant Garamond sitting BEHIND the hero photograph like a monument, then scrolling slower than the image as you leave the hero.

## Palette (exact, no substitution)
- Ink: `#0C0C0E` — dark sections, type on light
- Ivory: `#F5F0E8` — light sections, card backgrounds
- Stone: `#C8B89A` — secondary text, DM Mono labels
- Amber: `#D4873A` — THE ONLY ACCENT. CTAs, hover lines, number markers, active states
- Steel: `#6B7280` — meta text, tags
- White: `#FAFAF8` — type on dark

## Typography (exact, no substitution)
- **Display / hero:** Cormorant Garamond, weights 300 + 600. Wordmark: 300, `clamp(5rem,15vw,16rem)`, tracking `0.08em`, uppercase
- **Body / UI:** DM Sans, weights 300/400/500
- **Labels / mono:** DM Mono, 400, `0.65–0.7rem`, uppercase, tracking `0.12em`
- NEVER: Inter, Roboto, Arial, Helvetica, Space Grotesk, Poppins

## Layout rules
- Border-radius: `0` on ALL major blocks, cards, images. Only `2px` on the floating hover thumbnail. Only `4px` on tiny filter pills/tags.
- Max width: 1400px content, full-bleed for hero + feature sections
- Asymmetric grids — not equal 50/50 splits

## Motion grammar (enforce strictly)
ONE orchestrated signature per section. No scattered effects.
- **Hero:** Wordmark down+fade → image fade → tagline SplitText char reveal → label slide in. THEN: idle parallax (wordmark slower than image).
- **Discovery:** Headline words stagger up → cards scatter in from right with rotation.
- **Properties:** Hover = amber underline slide + name nudge left + cursor-following thumbnail. Click = expand row.
- **Feature:** Amenity cards pop in staggered on scroll.
- **CTA:** SplitText char reveal on scroll.

## Anti-slop checklist (refuse or revise anything from this list)
- Generic SaaS card grid → NO
- Purple, blue, or indigo gradients → NO
- Border-radius > 4px on cards/images/sections → NO
- Inter/Roboto/Arial as display face → NO
- Multiple accent colors → NO (amber ONLY)
- Scattered motion (effects on every element) → NO
- Card carousels/sliders with no narrative → NO
- Drop shadows heavier than `0 8px 40px rgba(12,12,14,0.15)` → NO
- Emoji as iconography → NO
- Lorem ipsum copy → NO (use docs/COPY.md)

## Self-critique gate
Before writing any code: state out loud which section you're building, which signature motion it has, and which part of the palette + type scale applies. If your plan includes anything from the anti-slop list, revise it first.
