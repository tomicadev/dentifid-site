"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  children: ReactNode;
  /** Razmak između dece kad se otkrivaju jedno za drugim. */
  korak?: number;
  /** Koliko elemenat krene niže pre nego što uđe. */
  pomeraj?: number;
  className?: string;
  /** Kad je tačno, animiraju se deca, a ne sam okvir. */
  decu?: boolean;
};

/**
 * Jednokratno otkrivanje na skrolu. Ko traži manje kretanja, dobija sadržaj
 * odmah, bez ijednog pomeranja.
 */
export default function Otkrij({
  children,
  korak = 0.08,
  pomeraj = 26,
  className,
  decu = false,
}: Props) {
  const okvir = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = okvir.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const mete = decu ? Array.from(element.children) : [element];
    const animacija = gsap.fromTo(
      mete,
      { opacity: 0, y: pomeraj },
      {
        opacity: 1,
        y: 0,
        duration: 0.62,
        ease: "power3.out",
        stagger: korak,
        scrollTrigger: { trigger: element, start: "top 86%", once: true },
      },
    );

    return () => {
      animacija.scrollTrigger?.kill();
      animacija.kill();
      gsap.set(mete, { clearProps: "opacity,transform" });
    };
  }, [decu, korak, pomeraj]);

  return (
    <div ref={okvir} className={className}>
      {children}
    </div>
  );
}
