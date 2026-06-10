# Akshar Realty — Claude Code Build Prompts
## Step-by-step prompts to paste into Claude Code, in order.

> **Before starting:** Make sure you're in the `akshar-realty/` project root. Claude Code will read `CLAUDE.md` automatically. Run each prompt in order. Do NOT skip.

---

## PHASE 1 — PROJECT SCAFFOLD

### Prompt 1.1 — Initialize & install
```
Read CLAUDE.md and docs/SETUP.md fully. Then:
1. Run the Next.js create command from SETUP.md Step 1 in the current directory
2. Install all dependencies from SETUP.md Step 2
3. Create the full folder structure exactly as shown in CLAUDE.md (File Conventions section)
4. Create next.config.ts from SETUP.md Step 8
Confirm each step is done before moving on. Do not write any UI yet.
```

### Prompt 1.2 — Tailwind + fonts + globals
```
Read docs/SETUP.md Steps 3, 4, 5, and 6. Then:
1. Replace src/app/globals.css with the full Tailwind v4 config from SETUP.md Step 3 — include all CSS custom properties and the grain overlay and reduced-motion rules
2. Update src/app/layout.tsx with the Google Fonts setup from SETUP.md Step 4 (Cormorant Garamond, DM Sans, DM Mono)
3. Create src/lib/gsap.ts from SETUP.md Step 5
4. Create src/lib/lenis.tsx from SETUP.md Step 6
5. Create src/lib/data.ts from SETUP.md Step 7 — copy the full types and property array including all 6 properties and all copy
6. Wrap the layout body in <SmoothScrollProvider> from lenis.tsx
Verify the dev server starts with no errors: pnpm dev
```

---

## PHASE 2 — NAVIGATION

### Prompt 2.1 — Navbar
```
Read CLAUDE.md, docs/DESIGN.md (Nav section), and docs/COPY.md (Nav section).
Invoke the award-taste skill, then build src/app/_components/nav/Navbar.tsx:

- Fixed position, full width, z-index 50
- Transparent over hero. After 80px scroll: bg transitions to --ink with 0.6 opacity backdrop-blur
- Left: "AKSHAR" in Cormorant Garamond 300, 1.4rem, tracking-widest, text-white
- Center: pill-shaped nav — Home · Properties · About · Contact in DM Sans, text-white/70, hover text-white
- Right: "Enquire Now" button — amber border, no fill, hover fills amber, font DM Sans
- Social icons left edge (only visible on hero section): Instagram, X, YouTube — vertical stack, amber on hover

Use GSAP useGSAP for the scroll-triggered bg transition (not IntersectionObserver).
Gate all motion behind motionSafe() from src/lib/gsap.ts.
Use next/link for all navigation.
```

---

## PHASE 3 — HERO SECTION (the signature beat)

### Prompt 3.1 — Hero structure and wordmark
```
Read CLAUDE.md, docs/DESIGN.md (Hero section and Component Signatures), docs/COPY.md (Hero section).
Invoke award-taste skill, then motion-orchestrator skill.

Build src/app/_components/hero/HeroSection.tsx:
- Full viewport height, position relative, overflow hidden
- Background: full-bleed <Image> from next/image (use a placeholder property image for now — /images/properties/heights.jpg)
- The "AKSHAR" wordmark: absolutely positioned, centered horizontally, vertically centered. Font: Cormorant Garamond 300, font-size var(--text-wordmark), letter-spacing 0.08em, uppercase, text-white, opacity 0.18. z-index BELOW the hero image (z-index: 0 for wordmark, z-index: 1 for image).
- The hero image uses mix-blend-mode: multiply or a dark overlay so the wordmark shows through slightly.
- Bottom right: tagline "Where legacy meets the skyline." in DM Sans 300, text-white
- Bottom right below tagline: sub-copy from COPY.md
- Top right: "Agents// · Properties// · Enquiries//" in DM Mono, text-stone, 0.7rem

The wordmark must visually sit BEHIND the photo (the photo is layered over it) but bleed through slightly. This is the signature element.
```

### Prompt 3.2 — Hero animations
```
Invoke kinetic-type-and-scroll skill.

Add animations to HeroSection.tsx:
1. Page load sequence (fires once, not on scroll):
   - t=0: wordmark fades in from opacity 0, slides DOWN into position (y: -40 → 0), duration 1.2s, ease power3.out
   - t=0.3: hero image fades in (opacity 0 → 1), duration 1s
   - t=0.8: tagline SplitText char reveal (type:'chars', stagger 0.03, yPercent: 100 → 0 from masked lines)
   - t=1.0: sub-copy fades in
   - t=1.1: right-side labels slide in from right

2. Scroll parallax (scrubbed):
   - Hero image: yPercent moves to 20 as you scroll the hero out
   - AKSHAR wordmark: yPercent moves to 40 (faster than image — creates depth separation)
   - Tagline + copy: yPercent moves to 15

Use useGSAP with a GSAP timeline. Gate all of this behind motionSafe().
Use invalidateOnRefresh: true on all ScrollTriggers.
```

---

## PHASE 4 — DISCOVERY SECTION (scattered cards)

### Prompt 4.1 — Discovery section structure
```
Read docs/DESIGN.md (Discovery section), docs/COPY.md (Discovery section), src/lib/data.ts.
Invoke award-taste skill.

Build src/app/_components/services/DiscoverySection.tsx:
- Background: --ivory, full width
- Left half (40%): eyebrow label "EXPLORE AKSHAR" in DM Mono · large stacked headlines (Homes. / Plots. / Villas. / Projects.) each on its own line, Cormorant Garamond 600, var(--text-xl) · body copy · search bar (DM Sans, no border-radius, 1px stone border, amber focus ring)
- Filter pills above headlines: All · Apartments · Villas · Plots (DM Mono, 0.65rem, amber border on active)
- Right half (60%): THIS IS WHERE SCATTERED CARDS GO (see Prompt 4.2)
- Section has no top padding — flows directly from hero with a clip-path edge or sharp cut
```

### Prompt 4.2 — Scattered property cards
```
Invoke kinetic-type-and-scroll skill.

Build src/app/_components/cards/ScatterCards.tsx:
- Takes the first 4 properties from data.ts
- Each card: 260px × 340px, border-radius 0, ivory bg with 1px stone border, overflow hidden
- Top 60%: <Image> fill cover. Bottom 40%: price (DM Sans bold, text-ink), location (DM Sans 300, text-steel 0.8rem), type tag (DM Mono, amber), heart icon (amber on hover, top right)
- Cards are absolutely positioned, overlapping like a physical stack scattered on a table:
  - Card 1: top: 5%, right: 5%, rotate: -4deg
  - Card 2: top: 12%, right: 18%, rotate: 3deg
  - Card 3: top: 30%, right: 8%, rotate: -1deg
  - Card 4: top: 45%, right: 20%, rotate: 5deg
- GSAP ScrollTrigger animation: when DiscoverySection enters viewport (start: "top 70%"), each card animates FROM x:280 opacity:0 TO its resting position with its rotation, stagger: 0.1, ease: power4.out, duration: 0.9

Also: the stacked headline words on the left animate in with SplitText type:'words', stagger:0.08, yPercent: 80 → 0, masked lines, triggered at same scroll point.

Gate behind motionSafe().
```

---

## PHASE 5 — PROPERTIES LIST (the hover-reveal accordion)

### Prompt 5.1 — Properties section structure
```
Read docs/DESIGN.md (Properties section, Accordion Row spec).
Invoke award-taste skill.

Build src/app/_components/properties/PropertiesList.tsx:
- Background: --ink (#0C0C0E), full width, generous vertical padding
- Top: two-column label row: "/Our Properties" left · "What Akshar does really well" right — both DM Mono, text-stone, 0.7rem
- Below: horizontal rule 1px rgba(255,255,255,0.08)
- 6 rows, one per property from data.ts. Each row:
  - height: ~80px on idle
  - Left: property.id (/01) in DM Mono, text-amber, 0.65rem
  - Center: property.name in Cormorant Garamond 300, 2.8rem, text-white
  - Right: "/See more" in DM Mono, text-stone, 0.65rem
  - Full-width border-bottom 1px rgba(255,255,255,0.08)
  - data-thumb attribute pointing to property.thumb image path

Build this with standard <div> rows (NOT Radix Accordion for this one — the expand animation is custom). Use Radix Accordion for the expand content.
```

### Prompt 5.2 — Hover reveal thumbnail
```
Invoke kinetic-type-and-scroll skill.

Add hover interactions to PropertiesList.tsx:
1. Floating thumbnail (ONE image element, shared across all rows):
   - Fixed position, pointer-events: none, z-index 100
   - Size: 220px × 155px, object-fit cover, no border-radius
   - On row mouseenter: swap src to row's thumbnail, gsap.to(thumb, { opacity:1, scale:1, duration:0.35 })
   - On row mouseleave: gsap.to(thumb, { opacity:0, scale:0.88, duration:0.35 })
   - Cursor follow: const setX = gsap.quickTo(thumb, 'x', {duration:0.5, ease:'expo'}); const setY = gsap.quickTo(thumb, 'y', {duration:0.5, ease:'expo'}); update on window mousemove

2. Row hover state:
   - Property name slides left 10px (gsap.to name, { x:-10, duration:0.4, ease:'expo.out' })
   - Amber underline slides in from left (scaleX: 0→1, transformOrigin: left, duration:0.4)
   - On mouseleave: reverse both

3. Row click/expand:
   - Row height expands, description appears (3 lines), "View Property →" link in amber
   - Use Radix Accordion for the expand/collapse with height animation (--radix-accordion-content-height)

Only one row expanded at a time.
Gate cursor follow behind: window.matchMedia('(pointer: fine)').matches
Gate all motion behind motionSafe().
```

---

## PHASE 6 — FEATURE SECTION (full-bleed with amenity cards)

### Prompt 6.1 — Feature section
```
Read docs/DESIGN.md (Feature section), docs/COPY.md (Feature section).
Invoke kinetic-type-and-scroll skill.

Build src/app/_components/features/FeatureSection.tsx:
- Full viewport height, position relative
- Full-bleed background image (use /images/properties/villas.jpg for now — the sunset house)
- Dark overlay gradient from bottom (rgba(12,12,14,0.6) bottom, transparent top)
- Top left: "/Our Spaces" in DM Mono stone · Top right: "Crafted for how you live" in DM Mono stone
- THREE floating amenity cards that appear on scroll (staggered pop-in):
  - Each card: 200px × 120px, bg white/90 backdrop-blur, no border-radius, padding 1rem
  - Icon (simple SVG or emoji placeholder for now) + title + description from COPY.md
  - Card 1 position: top:30%, left:8%
  - Card 2 position: top:25%, right:12%
  - Card 3 position: top:55%, right:8%
  - GSAP ScrollTrigger: animate FROM scale:0.85, opacity:0, y:20 TO resting, stagger:0.15, ease:power3.out

Gate behind motionSafe().
```

---

## PHASE 7 — CTA + FOOTER

### Prompt 7.1 — CTA and footer
```
Read docs/COPY.md (About/CTA and Footer sections).
Invoke award-taste skill.

Build src/app/_components/footer/Footer.tsx:
- Background: --ink
- Top section: centered, large Cormorant Garamond 300 pull quote — italic, text-stone, ~1.5rem
- Below quote: the "Let's find / your home." headline — Cormorant Garamond 600, var(--text-display), text-white, two lines
- Below headline: "Schedule a Visit →" button — amber border, no fill, hover fills amber, DM Sans, padding 0.75rem 2rem
- SplitText char reveal on scroll for the headline (type:'chars', stagger:0.02, yPercent:100, masked)
- Bottom footer bar: full width, 1px rgba(255,255,255,0.08) border-top, flex space-between
  - Left: "AKSHAR REALTY · Est. 2008 · Mumbai, India"
  - Right: "© 2026"
  - Both DM Mono, text-stone, 0.65rem
```

---

## PHASE 8 — PAGE ASSEMBLY

### Prompt 8.1 — Wire everything together
```
Update src/app/page.tsx to assemble all sections in order:
1. <Navbar />
2. <HeroSection />
3. <DiscoverySection /> (with <ScatterCards /> inside)
4. <PropertiesList />
5. <FeatureSection />
6. <Footer />

Make sure:
- SmoothScrollProvider wraps the layout (in layout.tsx, not page.tsx)
- Each section that has a Canvas is wrapped in next/dynamic with ssr:false
- ScrollTrigger.refresh() is called after the page hydrates (useEffect on page mount)
- The page has no horizontal overflow
- The grain overlay (className="grain" on the <html> or root div) is applied

Run pnpm dev and verify all sections render and no console errors.
```

---

## PHASE 9 — POLISH & PERFORMANCE

### Prompt 9.1 — Reduced motion + a11y pass
```
Invoke perf-and-motion-a11y skill.

Audit the entire codebase:
1. Every GSAP animation: wrap trigger in if (motionSafe()) from src/lib/gsap.ts
2. Every Motion component: add useReducedMotion() check
3. Lenis: in SmoothScrollProvider, check prefers-reduced-motion; if true, set lerp:1
4. All <Image> components: add explicit width/height or fill + sized container to prevent CLS
5. All property images: add priority prop to the hero image only
6. All interactive elements (nav links, accordion rows, CTA button): verify visible :focus-visible ring (amber color)
7. Property card hover hearts: add aria-label
8. Accordion rows: add role="button" tabIndex={0} onKeyDown enter/space handler

Run: npx @axe-core/cli http://localhost:3000
Fix any critical a11y errors before moving on.
```

### Prompt 9.2 — Performance pass
```
Invoke perf-and-motion-a11y skill.

1. Verify all property images have been converted to WebP and are under 200kb each
2. Add loading="lazy" to all below-fold images (all except the hero)
3. Verify ScatterCards and FeatureSection have invalidateOnRefresh:true on all ScrollTriggers
4. Add will-change: transform to the .akshar-wordmark and card elements (in CSS, remove after animation completes via onComplete callback)
5. Check for layout shift: open Chrome DevTools → Performance → record a scroll. CLS should be < 0.1.
6. Run: pnpm build — fix any TypeScript or build errors
7. Deploy to Vercel: vercel deploy
8. Run Lighthouse on the Vercel preview URL. Target: Performance ≥ 85, Accessibility ≥ 95
Report the scores.
```

---

## PHASE 10 — ENHANCEMENTS (do after core is solid)

### Prompt 10.1 — Enquiry modal
```
Read docs/COPY.md (Contact/Enquiry section).
Build an enquiry modal using Radix Dialog:
- Triggered by "Enquire Now" nav button and "Schedule a Visit" CTA
- Backdrop: dark ink 80% opacity with backdrop-blur
- Modal: ivory bg, no border-radius, max-width 520px
- Form fields from COPY.md: Name, Phone, City, Interested In (select), Message
- Submit button: amber fill, DM Sans
- Entry animation: Motion AnimatePresence, modal slides up from y:40, opacity 0→1
- Close: X button top right, click outside closes, Escape closes
- After submit: "Our team responds within 4 business hours." confirmation line
```

### Prompt 10.2 — Page transitions
```
Add App Router page transitions:
Install: pnpm add next-view-transitions
Wrap layout in <ViewTransitions> from next-view-transitions.
Add a CSS view-transition for page enter/exit:
::view-transition-old(root) { animation: 0.4s ease out fade-out; }
::view-transition-new(root) { animation: 0.5s ease in fade-in; }
Test by navigating to /properties and back. Verify back-button scroll restoration works.
```

### Prompt 10.3 — Individual property page
```
Read src/lib/data.ts.
Create src/app/properties/[slug]/page.tsx:
- generateStaticParams from all property slugs
- Full-bleed hero with the property image, name in large Cormorant at top
- Details: price, beds/baths/sqft in a clean horizontal row
- Description paragraph
- Amenities as a horizontal list with amber dot markers
- "Enquire About This Property" button → opens the enquiry modal
- Back link: "← All Properties"
Use the same motion patterns (SplitText reveal for the name, parallax on hero image).
```

### Prompt 10.4 — Mobile responsiveness pass
```
Audit and fix mobile layout for all viewports down to 375px:
- Navbar: collapse center links into a hamburger menu on < 768px. Use a Motion AnimatePresence drawer that slides in from top, ink bg, full height.
- Hero: wordmark stays but scales down (clamp handles it). Tagline and sub-copy stack below.
- Discovery section: left and right stack vertically. Scattered cards become a single scrollable horizontal row (overflow-x: auto, snap scroll).
- Properties list: font-size for property names reduces to 1.8rem on mobile. Thumbnail disabled (pointer: coarse).
- Feature section: amenity cards stack vertically, centered.
- Footer: stack vertically, centered.
Test on Chrome DevTools at 375px, 390px, 768px. Fix any overflow or clipping issues.
```
