import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registered once at module evaluation (client bundles only) rather than per
// component mount — gsap.registerPlugin() is idempotent, but centralizing it
// here means every consumer imports from one place instead of re-registering.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
