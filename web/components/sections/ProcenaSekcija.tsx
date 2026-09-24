"use client";

import { useEffect, useRef, useState } from "react";
import stil from "./ProcenaSekcija.module.css";
import Otkrij from "@/components/ui/Otkrij";

type Nivo = {
  primer: number;
  raspon: string;
  ime: string;
  /** Natpis ispod ocene u prstenu, kad nije isti kao ime nivoa u listi. */
  natpis?: string;
  poruka: string;
  boja: string;
  bojaTekst: string;
  sjaj: string;
};

/** Nivoi i rasponi su iz aplikacije; poruke opisuju samo ono što aplikacija radi. */
const NIVOI: Nivo[] = [
  {
    primer: 2,
    raspon: "1–3",
    ime: "Rutinska stomatološka kontrola",
    poruka:
      "Najniži nivo: aplikacija predlaže redovnu kontrolu i navodi kom specijalisti da se javite.",
    boja: "#34c759",
    bojaTekst: "#1c8a3a",
    sjaj: "rgb(52 199 89 / 20%)",
  },
  {
    primer: 5,
    raspon: "4–6",
    ime: "Preporučen stomatološki pregled",
    natpis: "Preporučuje se stomatološki pregled",
    poruka:
      "Aplikacija preporučuje da zakažete pregled. Uz ocenu stoji i predlog kom specijalisti da se obratite.",
    boja: "#ffcc00",
    bojaTekst: "#8a6a00",
    sjaj: "rgb(255 204 0 / 22%)",
  },
  {
    primer: 7,
    raspon: "7–8",
    ime: "Pregled u što skorijem roku",
    poruka:
      "Pregled ne bi trebalo odlagati. Kada ih ima, aplikacija uz rezultat navodi i razloge pod „Zašto ovaj rezultat”.",
    boja: "#ff9500",
    bojaTekst: "#a35c00",
    sjaj: "rgb(255 149 0 / 22%)",
  },
  {
    primer: 9,
    raspon: "9–10",
    ime: "Urgentno stanje",
    poruka:
      "Najviši nivo. Ako neki odgovor ukaže na znak hitnog stanja, aplikacija pre rezultata otvara ekran sa uputstvom i dugmetom za poziv hitne službe (194).",
    boja: "#ff3b30",
    bojaTekst: "#dd0c00",
    sjaj: "rgb(255 59 48 / 20%)",
  },
];

const POLUPRECNIK = 78;
const OBIM = 2 * Math.PI * POLUPRECNIK;

export default function ProcenaSekcija() {
  const [izabran, postaviIzabran] = useState(2); // počinje od nivoa 7, kao na snimku
  const [dirano, postaviDirano] = useState(false);
  const [prikaz, postaviPrikaz] = useState(0);
  const okvir = useRef<HTMLDivElement>(null);
  const kadar = useRef<number>(0);

  const nivo = NIVOI[izabran];

  // Brojka broji do ocene, umesto da se pojavi.
  useEffect(() => {
    const mirnije = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (mirnije) {
      postaviPrikaz(nivo.primer);
      return;
    }

    const pocetak = performance.now();
    const od = prikaz;
    const trajanje = 780;

    const korak = (sada: number) => {
      const deo = Math.min((sada - pocetak) / trajanje, 1);
      const mekano = 1 - Math.pow(1 - deo, 3);
      postaviPrikaz(od + (nivo.primer - od) * mekano);
      if (deo < 1) kadar.current = requestAnimationFrame(korak);
    };

    kadar.current = requestAnimationFrame(korak);
    return () => cancelAnimationFrame(kadar.current);
    // Namerno se ne prati `prikaz`: ulazna vrednost se čita samo na početku.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [izabran]);

  // Dok posetilac ne dodirne nijedan nivo, prsten sam prolazi kroz sva četiri.
  useEffect(() => {
    if (dirano) return;
    const element = okvir.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let sat: ReturnType<typeof setInterval> | null = null;
    const posmatrac = new IntersectionObserver(
      (unosi) => {
        unosi.forEach((unos) => {
          if (unos.isIntersecting && !sat) {
            sat = setInterval(() => postaviIzabran((p) => (p + 1) % NIVOI.length), 3400);
          } else if (!unos.isIntersecting && sat) {
            clearInterval(sat);
            sat = null;
          }
        });
      },
      { threshold: 0.35 },
    );

    posmatrac.observe(element);
    return () => {
      posmatrac.disconnect();
      if (sat) clearInterval(sat);
    };
  }, [dirano]);

  const izaberi = (i: number) => {
    postaviDirano(true);
    postaviIzabran(i);
  };

  const podeoci = Array.from({ length: 10 }, (_, i) => {
    const ugao = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r1 = POLUPRECNIK + 13;
    const r2 = POLUPRECNIK + 19;
    const k = (v: number) => Number(v.toFixed(2));
    return {
      x1: k(100 + Math.cos(ugao) * r1),
      y1: k(100 + Math.sin(ugao) * r1),
      x2: k(100 + Math.cos(ugao) * r2),
      y2: k(100 + Math.sin(ugao) * r2),
      pun: i < Math.round(prikaz),
    };
  });

  return (
    <section className={`sekcija ${stil.sekcija}`} id="procena" data-pratilac="4.5,30">
      <div className="okvir">
        <Otkrij className={stil.zaglavlje}>
          <p className="nadnaslov">Rezultat</p>
          <h2>
            Jedna ocena, <span className="istaknuto">četiri nivoa</span> hitnosti
          </h2>
          <p className="uvod" style={{ marginTop: "var(--r4)" }}>
            Kada završite upitnik, dobijate DentifID SCORE od 1 do 10. Iz ocene sledi jedan
            od četiri nivoa — od rutinske kontrole do urgentnog stanja. Izaberite nivo i
            pogledajte kako rezultat izgleda.
          </p>
        </Otkrij>

        <div className={stil.mreza} ref={okvir}>
          <div
            className={stil.prstenOkvir}
            style={
              {
                "--boja": nivo.boja,
                "--boja-tekst": nivo.bojaTekst,
                "--sjaj": nivo.sjaj,
              } as React.CSSProperties
            }
          >
            <svg className={stil.prstenSvg} viewBox="0 0 200 200" aria-hidden="true">
              <circle className={stil.staza} cx="100" cy="100" r={POLUPRECNIK} />
              <circle
                className={stil.luk}
                cx="100"
                cy="100"
                r={POLUPRECNIK}
                strokeDasharray={OBIM}
                strokeDashoffset={OBIM * (1 - nivo.primer / 10)}
              />
              {podeoci.map((p, i) => (
                <line
                  key={i}
                  className={`${stil.podeok} ${p.pun ? stil.podeokPun : ""}`}
                  x1={p.x1}
                  y1={p.y1}
                  x2={p.x2}
                  y2={p.y2}
                />
              ))}
            </svg>

            <div className={stil.sredina}>
              <span className={stil.broj}>{Math.round(prikaz)}</span>
              <span className={stil.odDeset}>DentifID score</span>
              <span className={stil.imeNivoa}>{nivo.natpis ?? nivo.ime}</span>
            </div>
          </div>

          <div>
            <ul className={stil.nivoi}>
              {NIVOI.map((n, i) => (
                <li key={n.ime}>
                  <button
                    type="button"
                    className={`${stil.nivo} ${i === izabran ? stil.nivoAktivan : ""}`}
                    style={
                      { "--boja": n.boja, "--boja-tekst": n.bojaTekst } as React.CSSProperties
                    }
                    onClick={() => izaberi(i)}
                    onMouseEnter={() => izaberi(i)}
                    aria-pressed={i === izabran}
                  >
                    <span className={stil.ocena}>{n.raspon}</span>
                    <span>
                      <span className={stil.ime}>{n.ime}</span>
                      <span className={stil.poruka}>{n.poruka}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <p className={stil.napomena}>
              Procena se oslanja isključivo na odgovore koje unesete. Aplikacija ne postavlja
              dijagnozu i ne zamenjuje pregled kod stomatologa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
