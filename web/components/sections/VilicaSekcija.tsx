"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import stil from "./VilicaSekcija.module.css";
import Otkrij from "@/components/ui/Otkrij";
import { Prst, Zub as ZubZnak, Upitnik } from "@/components/ui/Ikone";
import { donjaVilica, gornjaVilica, okvirVilica, type Zub } from "@/lib/vilica";
import { podaciZuba } from "@/lib/zubi-podaci";

type Natpis = { tekst: string; x: number; y: number } | null;

const RED_ULAZ = [0.2, 0.8, 0.2, 1] as const;

export default function VilicaSekcija() {
  const [izabran, postaviIzabran] = useState<Zub | null>(null);
  const [natpis, postaviNatpis] = useState<Natpis>(null);
  const platno = useRef<HTMLDivElement>(null);

  const pokaziNatpis = (zub: Zub, meta: SVGGElement) => {
    if (!platno.current) return;
    const a = meta.getBoundingClientRect();
    const b = platno.current.getBoundingClientRect();
    postaviNatpis({
      tekst: `${zub.fdi} · ${zub.puniNaziv}`,
      x: a.left - b.left + a.width / 2,
      y: a.top - b.top,
    });
  };

  const zubi = [...gornjaVilica.zubi, ...donjaVilica.zubi];
  const podaci = izabran ? podaciZuba(izabran) : null;
  const { x, y, sirina, visina } = okvirVilica;

  return (
    <section className="sekcija" id="vilica" data-pratilac="94,26">
      <div className="okvir">
        <Otkrij className={stil.zaglavlje}>
          <p className="nadnaslov">Izbor zuba</p>
          <h2>
            Dodirnite zub i <span className="istaknuto">saznajte više</span> o njemu
          </h2>
          <p className={`uvod ${stil.uvod}`}>
            Svaki zub ima svoj zadatak — sekutići zasecaju, očnjaci kidaju, a kutnjaci
            vrše završnu obradu hrane. Kada znate čemu koji zub služi, lakše primetite
            promenu na vreme i bolje ga čuvate.
          </p>
        </Otkrij>

        <div className={stil.par}>
          {/* Veza između crteža i prozora: kroz nju „prođe" svaki izbor. */}
          <div className={stil.spoj} aria-hidden="true">
            <span className={stil.spojLinija} />
            <AnimatePresence>
              {izabran ? (
                <motion.span
                  key={izabran.fdi}
                  className={stil.spojTacka}
                  initial={{ left: "0%", opacity: 0 }}
                  animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                />
              ) : null}
            </AnimatePresence>
          </div>

          <div
            className={stil.platno}
            ref={platno}
            data-izabrano={izabran ? "da" : "ne"}
            onMouseLeave={() => postaviNatpis(null)}
          >
            <p className={stil.strane}>
              <span>Vaša desna</span>
              <span>Vaša leva</span>
            </p>

            <svg
              className={stil.crtez}
              viewBox={okvirVilica.viewBox}
              role="group"
              aria-label="Gornja i donja vilica, izaberite zub"
            >
              {/* Središnja linija i ravan zagrižaja, kao na stomatološkom kartonu. */}
              <line className={stil.osa} x1={0} y1={y + 6} x2={0} y2={y + visina - 6} />
              <line className={stil.osa} x1={x + 10} y1={0} x2={x + sirina - 10} y2={0} />

              <path className={stil.desni} d={gornjaVilica.desni} />
              <path className={stil.nepce} d={gornjaVilica.nepce} />
              <path className={stil.desni} d={donjaVilica.desni} />
              <path className={stil.nepce} d={donjaVilica.nepce} />

              {zubi.map((zub) => (
                <g
                  key={zub.fdi}
                  className={`${stil.zub} ${izabran?.fdi === zub.fdi ? stil.zubIzabran : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Zub ${zub.fdi}, ${zub.puniNaziv}`}
                  aria-pressed={izabran?.fdi === zub.fdi}
                  onClick={() => postaviIzabran(zub)}
                  onKeyDown={(dogadjaj) => {
                    if (dogadjaj.key === "Enter" || dogadjaj.key === " ") {
                      dogadjaj.preventDefault();
                      postaviIzabran(zub);
                    }
                  }}
                  onMouseEnter={(dogadjaj) => pokaziNatpis(zub, dogadjaj.currentTarget)}
                  onFocus={(dogadjaj) => pokaziNatpis(zub, dogadjaj.currentTarget)}
                  onBlur={() => postaviNatpis(null)}
                >
                  <path className={stil.kruna} d={zub.d} />
                  {zub.brazde.map((brazda, i) => (
                    <path key={i} className={stil.brazda} d={brazda} />
                  ))}
                  <circle className={stil.oznaka} cx={zub.cx} cy={zub.cy} r={zub.poluprecnik} />
                </g>
              ))}
            </svg>

            <AnimatePresence>
              {natpis ? (
                <motion.span
                  className={stil.natpis}
                  style={{ left: natpis.x, top: natpis.y }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16 }}
                >
                  {natpis.tekst}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>

          <div className={stil.prozor}>
            {/* Plavi talas prođe kroz prozor svaki put kad se izabere drugi zub. */}
            <AnimatePresence>
              {izabran ? (
                <motion.span
                  key={izabran.fdi}
                  className={stil.talas}
                  aria-hidden="true"
                  initial={{ x: "-100%", opacity: 1 }}
                  animate={{ x: "100%", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.85, ease: RED_ULAZ, delay: 0.18 }}
                />
              ) : null}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {izabran && podaci ? (
                <motion.div
                  key={izabran.fdi}
                  className={stil.sadrzaj}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: RED_ULAZ, delay: 0.12 }}
                >
                  <div className={stil.prozorZaglavlje}>
                    <span className={stil.avatar} aria-hidden="true">
                      <ZubZnak />
                    </span>
                    <span>
                      <span className={stil.prozorNaslov}>
                        {izabran.fdi} · {izabran.puniNaziv}
                      </span>
                      <span className={stil.prozorPodnaslov}>
                        {izabran.vilica === "gornja" ? "Gornja" : "Donja"} vilica ·{" "}
                        {izabran.strana === "leva" ? "vaša leva" : "vaša desna"} strana
                      </span>
                    </span>
                  </div>

                  <div className={stil.oblacici}>
                    {[
                      { polje: "Uloga", tekst: podaci.uloga },
                      { polje: "Koreni", tekst: podaci.koreni },
                      { polje: "Nicanje", tekst: podaci.nicanje },
                    ].map((red, i) => (
                      <motion.p
                        key={red.polje}
                        className={stil.oblacic}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.07, duration: 0.24 }}
                      >
                        <span className={stil.oblacicZnak} aria-hidden="true">
                          {i + 1}
                        </span>
                        <span>
                          <span className={stil.oblacicPolje}>{red.polje}</span>
                          {red.tekst}
                        </span>
                      </motion.p>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="prazno"
                  className={stil.prazno}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={stil.praznoZnak} aria-hidden="true">
                    <Prst />
                  </span>
                  <p>
                    Dodirnite bilo koji zub na crtežu.
                    <br />
                    Ovde će pisati koji je i čemu služi.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <p className={stil.napomena}>
              <Upitnik />
              <span>
                Ovo je samo informativni prikaz izbora zuba. Procenu hitnosti i preporuku
                aplikacija daje tek nakon celog upitnika.{" "}
                <strong className={stil.istaknuto}>Aplikacija ne postavlja dijagnozu.</strong>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
