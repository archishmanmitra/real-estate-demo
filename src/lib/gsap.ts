import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const motionSafe = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const mm = gsap.matchMedia();

export { gsap, ScrollTrigger, SplitText };
