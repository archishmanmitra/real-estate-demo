"use client";

/**
 * Curve page transition — after blog.olivierlarose.com/articles/nextjs-page-transition-guide.
 * An ink overlay with a curved leading edge sweeps up to cover the page, the route
 * name fades in, the router navigates underneath, then the overlay sweeps away.
 * Implemented as an explicit phase machine (no Next.js internals), so it is robust
 * across App Router versions. Links trigger it via useTransitionRouter().
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { animate, motion, useReducedMotion } from "motion/react";
import { routeLabels } from "@/lib/data";

type Phase = "loading" | "intro" | "idle" | "cover" | "reveal";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];
const DURATION = 0.8;

const TransitionContext = createContext<{
  navigate: (href: string, label?: string) => void;
}>({
  navigate: () => {},
});

export const useTransitionRouter = () => useContext(TransitionContext);

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("loading");
  const [label, setLabel] = useState(routeLabels[pathname] ?? "");
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const target = useRef<string | null>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const measure = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Intro: page loads covered behind a counting preloader, then reveals.
  useEffect(() => {
    if (reduce) {
      setPhase("idle");
      return;
    }
    if (phase !== "loading") return;
    const controls = animate(0, 100, {
      duration: 1.5,
      ease: [0.6, 0.05, 0.2, 1],
      onUpdate: (v) => {
        if (counterRef.current)
          counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      },
      onComplete: () => setPhase("intro"),
    });
    return () => controls.stop();
  }, [reduce, phase]);

  const navigate = useCallback(
    (href: string, customLabel?: string) => {
      if (href === pathname) return;
      if (reduce) {
        router.push(href);
        return;
      }
      setLabel(customLabel ?? routeLabels[href] ?? "");
      target.current = href;
      setPhase("cover");
    },
    [pathname, reduce, router]
  );

  // When the route actually changes while covered → reveal the new page.
  useEffect(() => {
    if (target.current && pathname === target.current) {
      target.current = null;
      window.scrollTo(0, 0);
      setPhase("reveal");
    }
  }, [pathname]);

  const { w, h } = dims;
  const ready = w > 0 && h > 0;

  // SVG spans viewport + 300px curve allowance on each end.
  const dCurved = ready
    ? `M0 300 Q${w / 2} 0 ${w} 300 L${w} ${h + 300} Q${w / 2} ${h + 600} 0 ${h + 300} Z`
    : "";
  const dFlat = ready
    ? `M0 300 Q${w / 2} 300 ${w} 300 L${w} ${h + 300} Q${w / 2} ${h + 300} 0 ${h + 300} Z`
    : "";

  const below = h + 600;
  const covered = 0;
  const above = -(h + 600);

  const overlayTargets: Record<Phase, { y: number; d: string }> = {
    loading: { y: covered, d: dFlat },
    intro: { y: above, d: dCurved },
    idle: { y: below, d: dCurved },
    cover: { y: covered, d: dFlat },
    reveal: { y: above, d: dCurved },
  };

  const overlayInitial: Record<Phase, { y: number; d: string }> = {
    loading: { y: covered, d: dFlat },
    intro: { y: covered, d: dFlat },
    idle: { y: below, d: dCurved },
    cover: { y: below, d: dCurved },
    reveal: { y: covered, d: dFlat },
  };

  const onComplete = () => {
    if (phase === "cover" && target.current) {
      router.push(target.current);
    } else if (phase === "reveal" || phase === "intro") {
      setPhase("idle");
    }
  };

  const active = phase !== "idle";

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Static cover before dimensions are measured (prevents intro flash) */}
      {!ready && !reduce && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#F5F0E8",
            zIndex: 200,
          }}
        />
      )}

      {ready && !reduce && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "-300px",
            left: 0,
            width: "100vw",
            height: `${h + 600}px`,
            zIndex: 200,
            pointerEvents: "none",
            visibility: active ? "visible" : "hidden",
          }}
        >
          <motion.svg
            key={phase}
            width={w}
            height={h + 600}
            viewBox={`0 0 ${w} ${h + 600}`}
            fill="none"
            style={{ position: "absolute", inset: 0, display: "block" }}
            initial={{ y: overlayInitial[phase].y }}
            animate={{ y: overlayTargets[phase].y }}
            transition={{ duration: DURATION, ease: EASE }}
            onAnimationComplete={onComplete}
          >
            {/* Amber leading rim — offset toward whichever edge leads the sweep */}
            <g
              transform={`translate(0, ${
                phase === "reveal" || phase === "intro" ? 14 : -14
              })`}
            >
              <motion.path
                fill="#D4873A"
                initial={{ d: overlayInitial[phase].d }}
                animate={{ d: overlayTargets[phase].d }}
                transition={{ duration: DURATION, ease: EASE }}
              />
            </g>
            <motion.path
              fill="#F5F0E8"
              initial={{ d: overlayInitial[phase].d }}
              animate={{ d: overlayTargets[phase].d }}
              transition={{ duration: DURATION, ease: EASE }}
            />
          </motion.svg>

          {/* Preloader — AKSHAR + counting percentage */}
          {(phase === "loading" || phase === "intro") && (
            <motion.div
              animate={{ opacity: phase === "loading" ? 1 : 0 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.2rem,5vw,3.8rem)",
                  fontWeight: 300,
                  letterSpacing: "0.18em",
                  color: "#0C0C0E",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                AKSHAR
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: "#D4873A",
                  textTransform: "uppercase",
                  marginTop: "0.8rem",
                }}
              >
                <span ref={counterRef}>000</span> / 100
              </p>
            </motion.div>
          )}

          {/* Route label — only during navigation transitions */}
          {(phase === "cover" || phase === "reveal") && (
          <motion.p
            key={`label-${phase}-${label}`}
            initial={{ opacity: phase === "cover" ? 0 : 1 }}
            animate={{ opacity: phase === "cover" ? 1 : 0 }}
            transition={{ duration: DURATION * 0.6, ease: EASE }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#0C0C0E",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </motion.p>
          )}
        </div>
      )}
    </TransitionContext.Provider>
  );
}
