"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import stil from "./AplikacijaSekcija.module.css";
import Otkrij from "@/components/ui/Otkrij";
import Telefon from "@/components/ui/Telefon";
import { Strelica } from "@/components/ui/Ikone";

const EKRANI = [
  {
    snimak: "01-pocetna",
    oznaka: "Početna",
    naslov: "Sve važno na prvom ekranu",
    tekst:
      "Velika plava kartica za novu procenu, podsetnici iz vašeg kartona i poslednja procena — ne morate ništa da tražite po menijima.",
    alt: "Početni ekran aplikacije sa karticom za novu procenu i poslednjom procenom",
  },
  {
    snimak: "02-pitanje",
    oznaka: "Pitanja",
    naslov: "Pitanje po pitanje",
    tekst:
      "Upitnik vas vodi jedno pitanje po ekranu. Traka na vrhu pokazuje koliko je ostalo, a pitanja koja se ne odnose na vaš slučaj aplikacija sama preskače.",
    alt: "Ekran sa pitanjem iz upitnika i ponuđenim odgovorima",
  },
  {
    snimak: "03-vilica",
    oznaka: "Izbor zuba",
    naslov: "Zub birate dodirom",
    tekst:
      "Umesto da problem opisujete rečima, dodirnete zub na crtežu vilice. Možete izabrati i više njih, a za decu se prikazuju mlečni zubi.",
    alt: "Ekran za izbor zuba sa crtežom gornje vilice i dva označena zuba",
  },
  {
    snimak: "04-rezultat",
    oznaka: "Rezultat",
    naslov: "Procena sa objašnjenjem",
    tekst:
      "Ispod DentifID skora, nivoa hitnosti u boji i predloga specijaliste su svi vaši odgovori, na osnovu kojih je nastala procena.",
    alt: "Ekran rezultata sa ocenom 7 i nivoom „Pregled u što skorijem roku”",
  },
];

/** Položaj telefona u odnosu na onaj u sredini: levo, sredina, desno ili van scene. */
function polozaj(razlika: number) {
  const smer = Math.sign(razlika);
  const daljina = Math.abs(razlika);
  if (daljina === 0) return stil.sredina;
  if (daljina === 1) return smer < 0 ? stil.levo : stil.desno;
  return smer < 0 ? stil.vanLevo : stil.vanDesno;
}

export default function AplikacijaSekcija() {
  const [indeks, postaviIndeks] = useState(0);
  const pocetak = useRef<number | null>(null);

  const idi = (novi: number) => {
    postaviIndeks(Math.min(Math.max(novi, 0), EKRANI.length - 1));
  };

  const ekran = EKRANI[indeks];

  return (
    <section className={`sekcija ${stil.sekcija}`} id="aplikacija" data-pratilac="94,22">
      <div className="okvir">
        <div className={stil.mreza}>
          <div>
            <Otkrij className={stil.zaglavlje}>
              <p className="nadnaslov">U aplikaciji</p>
              <h2>
                Od pitanja do <span className="istaknuto">rezultata</span>
              </h2>
            </Otkrij>

            {/* Koračnik: četiri ekrana, ujedno i dugmad za prelazak. */}
            <ol className={stil.koraci}>
              {EKRANI.map((stavka, i) => (
                <li key={stavka.oznaka} className={stil.korakMesto}>
                  <button
                    type="button"
                    className={`${stil.korak} ${i === indeks ? stil.korakAktivan : ""} ${
                      i < indeks ? stil.korakPredjen : ""
                    }`}
                    onClick={() => idi(i)}
                    aria-current={i === indeks ? "step" : undefined}
                  >
                    <span className={stil.korakBroj}>{i + 1}</span>
                    <span className={stil.korakOznaka}>{stavka.oznaka}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className={stil.opisMesto} aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={ekran.oznaka}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <h3 className={stil.naslovKoraka}>{ekran.naslov}</h3>
                  <p className={stil.opis}>{ekran.tekst}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className={stil.upravljanje}>
              <button
                type="button"
                className={`${stil.strelica} ${stil.nazad}`}
                onClick={() => idi(indeks - 1)}
                disabled={indeks === 0}
                aria-label="Prethodni ekran"
              >
                <Strelica />
              </button>
              <button
                type="button"
                className={stil.strelica}
                onClick={() => idi(indeks + 1)}
                disabled={indeks === EKRANI.length - 1}
                aria-label="Sledeći ekran"
              >
                <Strelica />
              </button>
              <span className={stil.brojac}>
                {indeks + 1} / {EKRANI.length}
              </span>
            </div>
          </div>

          <div
            className={stil.pozornica}
            onPointerDown={(dogadjaj) => {
              pocetak.current = dogadjaj.clientX;
            }}
            onPointerUp={(dogadjaj) => {
              if (pocetak.current === null) return;
              const razlika = dogadjaj.clientX - pocetak.current;
              if (Math.abs(razlika) > 40) idi(indeks + (razlika < 0 ? 1 : -1));
              pocetak.current = null;
            }}
            onPointerLeave={() => {
              pocetak.current = null;
            }}
          >
            {EKRANI.map((stavka, i) => (
              <div
                key={stavka.snimak}
                className={`${stil.mesto} ${polozaj(i - indeks)}`}
                aria-hidden={i !== indeks}
                onClick={() => {
                  if (i !== indeks) idi(i);
                }}
              >
                <Telefon
                  snimak={stavka.snimak}
                  alt={stavka.alt}
                  sirina="clamp(12.5rem, 21vw, 16rem)"
                  pratiMis={i === indeks}
                  mirovanje={{ x: 4, y: -10 }}
                  jacina={12}
                  visinaLeta={10}
                  postolje={i === indeks}
                  sizes="(max-width: 60rem) 55vw, 17rem"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
