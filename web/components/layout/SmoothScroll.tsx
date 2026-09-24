"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Meko skrolovanje i jedan zajednički sat za sve GSAP animacije vezane za
 * skrol. Bez ovoga ScrollTrigger i Lenis rade svaki po svom taktu, pa
 * animacije kasne za stranom.
 *
 * Ko je tražio manje kretanja, dobija običan skrol pregledača.
 */
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mirnije = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mirnije.matches) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (vreme: number) => lenis.raf(vreme * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
