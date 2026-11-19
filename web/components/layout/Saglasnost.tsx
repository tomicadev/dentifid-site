"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import stil from "./Saglasnost.module.css";
import Dugme from "@/components/ui/Dugme";
import { KONTAKT } from "@/lib/izdanje";
import { DOGADJAJ_PODESAVANJA, procitajIzbor, sacuvajIzbor } from "@/lib/analitika";

/**
 * Traka za pristanak na analitiku. Pojavljuje se dok posetilac ne izabere, a
 * veza „Podešavanja kolačića” u podnožju je ponovo otvara. Oba izbora su
 * podjednako vidljiva i sajt radi isto i kad se analitika odbije.
 */
export default function Saglasnost() {
  const [otvoreno, setOtvoreno] = useState(false);
  const smanjeno = useReducedMotion();

  useEffect(() => {
    if (procitajIzbor() === null) setOtvoreno(true);
    const otvori = () => setOtvoreno(true);
    window.addEventListener(DOGADJAJ_PODESAVANJA, otvori);
    return () => window.removeEventListener(DOGADJAJ_PODESAVANJA, otvori);
  }, []);

  const izaberi = (izbor: "da" | "ne") => {
    sacuvajIzbor(izbor);
    setOtvoreno(false);
  };

  return (
    <AnimatePresence>
      {otvoreno ? (
        <motion.section
          className={stil.traka}
          role="region"
          aria-label="Pristanak na kolačiće"
          initial={smanjeno ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={smanjeno ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div className={stil.tekst}>
            <p className={stil.naslov}>Kolačići za analitiku</p>
            <p className={stil.opis}>
              Uz vaš pristanak koristimo Google Analytics da bismo videli koliko ljudi
              posećuje sajt i koje delove čitaju. Bez pristanka sajt radi isto, samo
              bez merenja.{" "}
              <a href={KONTAKT.politikaPrivatnosti} rel="noopener">
                Politika privatnosti
              </a>
            </p>
          </div>
          <div className={stil.radnje}>
            <Dugme vrsta="sporedno" onClick={() => izaberi("ne")}>
              Ne, hvala
            </Dugme>
            <Dugme onClick={() => izaberi("da")}>Prihvatam</Dugme>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

/** Veza u podnožju kojom se izbor može promeniti u svakom trenutku. */
export function PodesavanjaKolacica({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(DOGADJAJ_PODESAVANJA))}
    >
      Podešavanja kolačića
    </button>
  );
}
