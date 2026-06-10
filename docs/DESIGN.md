# Akshar Realty — Design System

## Thesis
Akshar means "letter / indestructible" in Sanskrit. The brand idea: **permanence written in stone** — an Indian real estate company with the visual confidence of a European luxury architecture studio. Cinematic, warm, editorial. The thing a visitor will remember: the giant "AKSHAR" wordmark that sits behind the hero photograph like a monument, then scrolls away slower than the image — revealing the photo's depth.

---

## Palette

| Token | Hex | Usage |
|---|---|---|
| `--ink` | `#0C0C0E` | Dark bg, Properties section, type on light |
| `--ivory` | `#F5F0E8` | Light bg, Discovery section, cards |
| `--stone` | `#C8B89A` | Secondary text, dividers, labels on dark |
| `--amber` | `#D4873A` | Sole accent — CTAs, hover lines, number labels |
| `--steel` | `#6B7280` | Meta text, tags, small labels |
| `--white` | `#FAFAF8` | Pure white type on dark sections |

**Grain:** Apply a `0.08` opacity CSS noise texture overlay on all sections — adds warmth, fights the "AI-flat" look.
**Never** use pure `#000000` or `#FFFFFF` — always `--ink` / `--white`.

---

## Typography

### Display face: Cormorant Garamond
- Source: Google Fonts (`display` subset)
- Use for: Hero wordmark, section headings, property names in accordion
- Weights: 300 (light, for giant wordmark), 600 (semibold, for section heads)
- Tracking: `-0.02em` for large, `0.02em` for eyebrows
- **The wordmark:** `font-size: clamp(5rem, 15vw, 16rem)`, `font-weight: 300`, `letter-spacing: 0.08em`, uppercase

### Body face: DM Sans
- Source: Google Fonts
- Use for: Body copy, nav items, card meta, search inputs
- Weights: 300, 400, 500

### Mono / label face: DM Mono
- Source: Google Fonts
- Use for: Section labels (`/Our Properties`), numbering (`/01`), tags
- Weight: 400, size: `0.65rem`–`0.75rem`, uppercase, `letter-spacing: 0.12em`

### Type scale
```css
--text-wordmark:  clamp(5rem,   15vw, 16rem);   /* AKSHAR hero */
--text-display:   clamp(2.5rem,  6vw,  5rem);   /* section heads */
--text-xl:        clamp(1.5rem,  3vw,  2.5rem); /* Discovery list items */
--text-lg:        clamp(1.1rem, 1.5vw, 1.25rem);
--text-base:      1rem;
--text-sm:        0.875rem;
--text-label:     0.7rem;                        /* DM Mono labels */
```

---

## Layout

- Max content width: `1400px`
- Section padding: `clamp(4rem, 10vh, 8rem)` vertical, `clamp(1.5rem, 5vw, 5rem)` horizontal
- Grid: 12-column, mostly asymmetric (left-heavy for text, right-heavy for media)
- Border-radius: `0` on all major blocks — zero border radius reads as confident and architectural; only `4px` on tiny tags/buttons.

---

## Motion Grammar

**Rule:** One orchestrated signature per section. Kill anything that doesn't direct the eye or encode hierarchy.

| Section | Signature motion |
|---|---|
| **Hero** | Page load: wordmark fades + slides down-to-rest as image fades in. Then idle parallax (wordmark moves slower than image on scroll). |
| **Discovery** | Scroll trigger: text words stagger up (SplitText, `type:'words'`). Cards scatter in from off-right with rotation (`gsap.from` with `x:200, rotation: random(-8,8), stagger:0.1`). |
| **Properties** | Hover on list row: amber underline slides in, floating thumbnail fades + follows cursor via `quickTo`. Active row expands. |
| **Feature** | Scroll into view: amenity cards pop in with slight scale + fade, staggered from center outward. |
| **CTA** | SplitText char reveal on scroll. |

**Timing reference:**
- Standard ease: `power3.out`
- Scroll-scrubbed: `ease: none` (linear)
- Hover snap: `expo.out`, `duration: 0.4`
- Page-load sequence: 0.8–1.2s total

---

## Component Signatures

### Nav
- Transparent over hero, transitions to `--ink` bg on scroll (after 80px) — smooth opacity transition
- Left: "AKSHAR" logotype in Cormorant, `1.4rem`
- Center: pill-shaped nav links on dark bg (`Home · Properties · About · Contact`)
- Right: CTA button "Enquire Now" — amber border, no fill, hover fills amber
- Left edge: vertical social icons (Instagram, X, YouTube) — only on hero

### Property Card (scatter section)
- `280px × 360px`, `border-radius: 0`, ivory bg
- Full-bleed photo top 60%, meta below: price in DM Sans bold, address in DM Sans 300, small amber tag
- Heart icon top-right (amber on hover)
- Drop shadow: `0 8px 40px rgba(12,12,14,0.15)`
- Rotation: each card has a unique static rotation (`-6deg` to `+6deg`) applied as an inline style, then GSAP animates FROM off-screen TO that rotation

### Properties Accordion Row
- Full width, `border-bottom: 1px solid rgba(255,255,255,0.08)`
- Left: `/01` in DM Mono amber · Center: property name in Cormorant `3rem` · Right: `/See more` in DM Mono stone
- Hover: name slides left 12px (subtle), amber underline slides in from left, thumbnail appears
- Active: row expands to show 3-line description + "View Property →" link in amber

### Floating Thumbnail (hover reveal on Properties)
- `220px × 160px`, fixed position, `pointer-events:none`
- Follows cursor via GSAP `quickTo` with `expo` ease
- Fades in/out with `scale: 0.9 → 1` on enter/leave
- Rounded `2px` — the only rounded element

---

## Sections Reference

### Hero
```
[NAV BAR — transparent]
[                      HERO IMAGE full-bleed                     ]
[          AK  SHAR  ← giant wordmark BEHIND image              ]
  @2025                          Agents// Houses// Enquiries//
  [Animated tagline — SplitText reveal]
  [description paragraph — right side]
[Social icons left edge]
```

### Discovery (Ivory bg)
```
  GET RECOMMENDATIONS     [Agents] [Buy & Rent]
  Homes.
  Plots.
  Villas.
  Projects.
  [body copy]
  [Search location input]       [Scattered property cards →→→]
```

### Properties (Ink bg)
```
  /Our Properties          What Akshar does really well
  ─────────────────────────────────────────────────────
  /01    Akshar Heights                          /See more
  /02    Akshar Greens                           /See more
  /03    Akshar Villas                           /See more
  /04    Akshar Residences                       /See more
  /05    Akshar Skyline                          /See more
  /06    Akshar Meadows                          /See more
  ─────────────────────────────────────────────────────
                [floating thumb follows cursor]
```

### Feature (full-bleed image)
```
  /Our Services            Spaces crafted for living
  [ FULL BLEED PROPERTY PHOTO ]
    [Amenity card]              [Amenity card]
         [Amenity card]
```

### CTA Footer
```
  ─────────────────────────────────────────────────────
  "Let's find
   your home."
  [Enquire Now →]      AKSHAR REALTY · Mumbai · ©2025
```

---

## Anti-Patterns (never do these)

- Generic SaaS card grid
- Purple / blue gradient hero
- Border-radius > 4px on major blocks
- Inter / Roboto / Arial as display face
- Emoji as iconography
- Scattered motion (every animation must direct the eye)
- Card carousels / sliders without narrative
- Numbered markers (01/02) unless the content is actually sequential (the accordion IS sequential)
- Lorem ipsum — use real copy from `docs/COPY.md`
