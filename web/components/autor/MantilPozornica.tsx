"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import stil from "./MantilPozornica.module.css";
import type { StanjeMantila } from "./MantilScena";

const MantilScena = dynamic(() => import("./MantilScena"), { ssr: false });

type Props = {
  ime: string;
  titula: string;
  slika?: string;
  className?: string;
};

function imaWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Pozornica za 3D mantil. Scena se učitava tek u pregledaču, staje kad
 * pozornica nije na ekranu, a uz „manje kretanja” mantil miruje. Bez WebGL-a
 * ostaje kartica napravljena u HTML-u.
 */
export default function MantilPozornica({ ime, titula, slika, className }: Props) {
  const okvir = useRef<HTMLDivElement>(null);
  const stanje = useRef<StanjeMantila>({ misX: 0, misY: 0 });
  const [webgl, postaviWebgl] = useState<boolean | null>(null);
  const [vidljivo, postaviVidljivo] = useState(true);
  const [mirno, postaviMirno] = useState(false);
  const [spremno, postaviSpremno] = useState(false);

  useEffect(() => {
    postaviWebgl(imaWebGL());
    const smanjeno = window.matchMedia("(prefers-reduced-motion: reduce)");
    const odluci = () => postaviMirno(smanjeno.matches);
    odluci();
    smanjeno.addEventListener("change", odluci);
    return () => smanjeno.removeEventListener("change", odluci);
  }, []);

  useEffect(() => {
    const element = okvir.current;
    if (!element) return;
    const posmatrac = new IntersectionObserver(([unos]) => postaviVidljivo(unos.isIntersecting), {
      rootMargin: "120px",
    });
    posmatrac.observe(element);
    return () => posmatrac.disconnect();
  }, []);

  // Mantil se blago okreće ka mišu.
  useEffect(() => {
    const naMis = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = okvir.current?.getBoundingClientRect();
      if (!r) return;
      const x = ((e.clientX - (r.left + r.width / 2)) / r.width) * 2;
      const y = ((e.clientY - (r.top + r.height / 2)) / r.height) * 2;
      stanje.current.misX = Math.max(-1, Math.min(1, x));
      stanje.current.misY = Math.max(-1, Math.min(1, y));
    };
    window.addEventListener("pointermove", naMis, { passive: true });
    return () => window.removeEventListener("pointermove", naMis);
  }, []);

  return (
    <div ref={okvir} className={`${stil.pozornica} ${className ?? ""}`} aria-hidden="true">
      <div className={stil.oreol} />
      {webgl ? (
        <div className={`${stil.platno} ${spremno ? stil.spremno : ""}`}>
          <MantilScena
            ime={ime}
            titula={titula}
            slika={slika}
            aktivno={vidljivo}
            mirno={mirno}
            stanje={stanje}
            onSpremno={() => postaviSpremno(true)}
          />
        </div>
      ) : null}
      {webgl === false ? (
        <div className={stil.rezerva}>
          <div className={stil.rezervaSlika}>
            {slika ? <img src={slika} alt="" /> : null}
          </div>
          <p className={stil.rezervaIme}>{ime}</p>
          <p className={stil.rezervaTitula}>{titula}</p>
        </div>
      ) : null}
    </div>
  );
}
