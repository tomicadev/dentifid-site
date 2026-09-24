"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import stil from "./Telefon.module.css";

type Props = {
  /** Ime snimka bez širine, npr. "04-rezultat" — postoje verzije -540 i -1080. */
  snimak: string;
  alt: string;
  /** Širina telefona, bilo koja CSS vrednost. */
  sirina?: string;
  /** Odnos stranica snimka; snimci bez statusne trake su niži. */
  odnos?: string;
  /** Da li se telefon naginje prema mišu. */
  pratiMis?: boolean;
  /** Najveći nagib u stepenima. */
  jacina?: number;
  /** Ugao u mirovanju, da telefon deluje trodimenzionalno i kad se miš ne pomera. */
  mirovanje?: { x: number; y: number };
  visinaLeta?: number;
  prioritet?: boolean;
  postolje?: boolean;
  kamera?: boolean;
  bojaSjaja?: string;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
};

export default function Telefon({
  snimak,
  alt,
  sirina = "18rem",
  odnos = "1080 / 2214",
  pratiMis = true,
  jacina = 14,
  mirovanje = { x: 4, y: -12 },
  visinaLeta = 14,
  prioritet = false,
  postolje = true,
  kamera = true,
  bojaSjaja,
  sizes = "(max-width: 40rem) 70vw, 20rem",
  className,
  style,
}: Props) {
  const scena = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scena.current;
    if (!element) return;

    const postavi = (x: number, y: number) => {
      element.style.setProperty("--nagibX", `${x.toFixed(2)}deg`);
      element.style.setProperty("--nagibY", `${y.toFixed(2)}deg`);
      // Odsjaj ide suprotno od nagiba, kao pravo svetlo na staklu.
      element.style.setProperty("--sjajX", `${50 - y * 2.2}%`);
      element.style.setProperty("--sjajY", `${30 + x * 2.2}%`);
    };

    postavi(mirovanje.x, mirovanje.y);

    const mirnije = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (mirnije || !pratiMis) return;

    const finMis = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let ciljX = mirovanje.x;
    let ciljY = mirovanje.y;
    let x = ciljX;
    let y = ciljY;
    let kadar = 0;
    let vidljiv = true;

    const naMis = (dogadjaj: PointerEvent) => {
      const okvir = element.getBoundingClientRect();
      const sredinaX = okvir.left + okvir.width / 2;
      const sredinaY = okvir.top + okvir.height / 2;
      const nx = Math.max(-1, Math.min(1, (dogadjaj.clientX - sredinaX) / (window.innerWidth / 2)));
      const ny = Math.max(-1, Math.min(1, (dogadjaj.clientY - sredinaY) / (window.innerHeight / 2)));
      ciljY = mirovanje.y + nx * jacina;
      ciljX = mirovanje.x - ny * jacina * 0.7;
    };

    const naIzlaz = () => {
      ciljX = mirovanje.x;
      ciljY = mirovanje.y;
    };

    const korak = (vreme: number) => {
      if (!finMis) {
        // Na dodirnim ekranima nema miša, pa se telefon sam blago njiše.
        ciljY = mirovanje.y + Math.sin(vreme / 2200) * jacina * 0.45;
        ciljX = mirovanje.x + Math.cos(vreme / 2800) * jacina * 0.2;
      }
      x += (ciljX - x) * 0.08;
      y += (ciljY - y) * 0.08;
      postavi(x, y);
      if (vidljiv) kadar = requestAnimationFrame(korak);
    };

    // Van ekrana se ništa ne računa.
    const posmatrac = new IntersectionObserver(([unos]) => {
      const bio = vidljiv;
      vidljiv = unos.isIntersecting;
      if (vidljiv && !bio) kadar = requestAnimationFrame(korak);
    });
    posmatrac.observe(element);

    if (finMis) {
      window.addEventListener("pointermove", naMis, { passive: true });
      document.documentElement.addEventListener("pointerleave", naIzlaz);
    }
    kadar = requestAnimationFrame(korak);

    return () => {
      cancelAnimationFrame(kadar);
      posmatrac.disconnect();
      window.removeEventListener("pointermove", naMis);
      document.documentElement.removeEventListener("pointerleave", naIzlaz);
    };
  }, [pratiMis, jacina, mirovanje.x, mirovanje.y]);

  const klase = [
    stil.scena,
    postolje ? "" : stil.bezPostolja,
    kamera ? "" : stil.bezKamere,
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={scena}
      className={klase}
      style={
        {
          "--w": sirina,
          "--odnos": odnos,
          "--visinaLeta": `${visinaLeta}px`,
          ...(bojaSjaja ? { "--bojaSjaja": bojaSjaja } : {}),
          ...style,
        } as CSSProperties
      }
    >
      <span className={stil.oreol} aria-hidden="true" />
      <div className={stil.lebdenje}>
        <div className={stil.telefon}>
          <span className={`${stil.taster} ${stil.tasterDesno}`} aria-hidden="true" />
          <span className={`${stil.taster} ${stil.tasterLevo1}`} aria-hidden="true" />
          <span className={`${stil.taster} ${stil.tasterLevo2}`} aria-hidden="true" />
          <div className={stil.ekran}>
            <img
              src={`/img/${snimak}-540.webp`}
              srcSet={`/img/${snimak}-540.webp 540w, /img/${snimak}-1080.webp 1080w`}
              sizes={sizes}
              alt={alt}
              width={1080}
              height={Number(odnos.split("/")[1]?.trim() ?? 2214)}
              loading={prioritet ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
            <span className={stil.kamera} aria-hidden="true" />
            <span className={stil.odsjaj} aria-hidden="true" />
          </div>
        </div>
      </div>
      <span className={stil.postolje} aria-hidden="true" />
    </div>
  );
}
