// Variants from blog.olivierlarose.com/tutorials/navigation-menu, tuned for Akshar.
import type { Variants } from "motion/react";

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const opacity: Variants = {
  initial: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.35 } },
  closed: { opacity: 0, transition: { duration: 0.35 } },
};

export const height: Variants = {
  initial: { height: 0 },
  enter: { height: "auto", transition: { duration: 0.75, ease: EASE } },
  exit: { height: 0, transition: { duration: 0.75, ease: EASE } },
};

export const background: Variants = {
  initial: { height: 0 },
  open: { height: "100vh", transition: { duration: 0.75, ease: EASE } },
  closed: { height: 0, transition: { duration: 0.75, ease: EASE } },
};

export const blur: Variants = {
  initial: { filter: "blur(0px)", opacity: 1 },
  open: { filter: "blur(4px)", opacity: 0.55, transition: { duration: 0.3 } },
  closed: { filter: "blur(0px)", opacity: 1, transition: { duration: 0.3 } },
};

export const translate: Variants = {
  initial: { y: "100%", opacity: 0 },
  enter: ([i]: [number, number]) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: EASE, delay: i },
  }),
  exit: ([, i]: [number, number]) => ({
    y: "100%",
    opacity: 0,
    transition: { duration: 0.7, ease: EASE, delay: i },
  }),
};

export const imageOpacity: Variants = {
  initial: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
  closed: { opacity: 0, transition: { duration: 0.4, ease: EASE } },
};
