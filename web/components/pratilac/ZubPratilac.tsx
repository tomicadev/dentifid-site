"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import stil from "./ZubPratilac.module.css";
import { Koverta, Strelica } from "@/components/ui/Ikone";
import type { StanjePratioca } from "./ZubScena";

const ZubScena = dynamic(() => import("./ZubScena"), { ssr: false });

type Rezim = "put" | "ugao";

/**
 * 3D zub koji prati posetioca. Na računaru prelazi u prazan deo svake sekcije
 * (sekcija to mesto zadaje atributom `data-pratilac="x,y"`, u vw i vh), a
 * prelaskom miša otvara oblačić sa pozivom da se piše autoru. Na telefonu je
 * dugme u uglu koje oblačić otvara dodirom.
 */
export default function ZubPratilac() {
  const [rezim, postaviRezim] = useState<Rezim>("ugao");
  const [spreman, postaviSpreman] = useState(false);
  const [otvoren, postaviOtvoren] = useState(false);
  const [strana, postaviStranu] = useState<"levo" | "desno">("levo");
  const [mirno, postaviMirno] = useState(false);

  const okvir = useRef<HTMLDivElement>(null);
  const tajmer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stanje = useRef<StanjePratioca>({ misX: 0, misY: 0, zamah: 0, iznad: false });

  // 3D scena se učitava tek kad se strana smiri, da ne kasni prvi prikaz.
  useEffect(() => {
    const kreni = () => postaviSpreman(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(kreni, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(kreni, 1200);
    return () => clearTimeout(id);
  }, []);

  // Računar sa mišem dobija putujući zub, sve ostalo dugme u uglu.
  useEffect(() => {
    const siroko = window.matchMedia("(min-width: 60rem) and (hover: hover) and (pointer: fine)");
    const smanjeno = window.matchMedia("(prefers-reduced-motion: reduce)");
    const odluci = () => {
      postaviMirno(smanjeno.matches);
      postaviRezim(siroko.matches && !smanjeno.matches ? "put" : "ugao");
    };
    odluci();
    siroko.addEventListener("change", odluci);
    smanjeno.addEventListener("change", odluci);
    return () => {
      siroko.removeEventListener("change", odluci);
      smanjeno.removeEventListener("change", odluci);
    };
  }, []);

  // Putovanje između praznih mesta u sekcijama.
  useEffect(() => {
    if (rezim !== "put") return;
    const element = okvir.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);

    const idi = (x: number, y: number) => {
      postaviStranu(x > 50 ? "levo" : "desno");
      stanje.current.zamah = 1;
      gsap.to(element, { "--x": x, "--y": y, duration: 1.15, ease: "power3.inOut", overwrite: true });
    };

    const okidaci = Array.from(document.querySelectorAll<HTMLElement>("[data-pratilac]")).map(
      (sekcija) => {
        const [x, y] = (sekcija.dataset.pratilac ?? "90,26").split(",").map(Number);
        return ScrollTrigger.create({
          trigger: sekcija,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (sam) => {
            if (sam.isActive) idi(x, y);
          },
        });
      },
    );

    const prva = document.querySelector<HTMLElement>("[data-pratilac]");
    if (prva && window.scrollY < 40) {
      const [x, y] = (prva.dataset.pratilac ?? "90,26").split(",").map(Number);
      gsap.set(element, { "--x": x, "--y": y });
      postaviStranu(x > 50 ? "levo" : "desno");
    }
    ScrollTrigger.refresh();

    return () => okidaci.forEach((okidac) => okidac.kill());
  }, [rezim]);

  // Zub se naginje prema mišu, gde god da je miš na strani.
  useEffect(() => {
    if (rezim !== "put") return;
    const naMis = (dogadjaj: PointerEvent) => {
      const element = okvir.current;
      if (!element) return;
      const o = element.getBoundingClientRect();
      const dx = dogadjaj.clientX - (o.left + o.width / 2);
      const dy = dogadjaj.clientY - (o.top + o.height / 2);
      stanje.current.misX = Math.max(-1, Math.min(1, dx / 500));
      stanje.current.misY = Math.max(-1, Math.min(1, dy / 400));
    };
    window.addEventListener("pointermove", naMis, { passive: true });
    return () => window.removeEventListener("pointermove", naMis);
  }, [rezim]);

  // Dodir van zuba i oblačića zatvara oblačić na telefonu.
  useEffect(() => {
    if (!otvoren || rezim !== "ugao") return;
    const van = (dogadjaj: PointerEvent) => {
      if (!okvir.current?.contains(dogadjaj.target as Node)) postaviOtvoren(false);
    };
    document.addEventListener("pointerdown", van);
    return () => document.removeEventListener("pointerdown", van);
  }, [otvoren, rezim]);

  const otvori = useCallback(() => {
    if (tajmer.current) clearTimeout(tajmer.current);
    stanje.current.iznad = true;
    postaviOtvoren(true);
  }, []);

  const zatvoriKasnije = useCallback(() => {
    stanje.current.iznad = false;
    if (tajmer.current) clearTimeout(tajmer.current);
    tajmer.current = setTimeout(() => postaviOtvoren(false), 380);
  }, []);

  const naKlik = () => {
    if (rezim === "ugao") {
      postaviOtvoren((o) => !o);
      return;
    }
    document.getElementById("kontakt")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const naPut = rezim === "put";

  return (
    <div
      ref={okvir}
      className={`${stil.pratilac} ${naPut ? "" : stil.ugao}`}
      onMouseEnter={naPut ? otvori : undefined}
      onMouseLeave={naPut ? zatvoriKasnije : undefined}
    >
      <button
        type="button"
        className={stil.dugme}
        aria-label="Kontaktirajte autora aplikacije"
        aria-expanded={otvoren}
        onClick={naKlik}
        onFocus={otvori}
        onBlur={zatvoriKasnije}
      >
        <span className={stil.platno} aria-hidden="true">
          {spreman ? (
            <ZubScena stanje={stanje} mirno={mirno} naPlavom={!naPut} />
          ) : (
            <span className={stil.rezerva}>
              <img src="/svg/znak.svg" alt="" width={200} height={200} />
            </span>
          )}
        </span>
      </button>

      <div className={`${stil.mesto} ${naPut ? stil[strana] : ""}`}>
        <AnimatePresence>
          {otvoren ? (
            <motion.div
              className={stil.oblacic}
              initial={{ opacity: 0, scale: 0.92, x: naPut ? (strana === "levo" ? 10 : -10) : 0, y: naPut ? 0 : 8 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              onMouseEnter={naPut ? otvori : undefined}
              onMouseLeave={naPut ? zatvoriKasnije : undefined}
            >
              <p className={stil.oblacicNaslov}>
                <Koverta />
                Pitanje ili predlog?
              </p>
              <p className={stil.oblacicTekst}>
                Pišite direktno autoru aplikacije.
              </p>
              <a
                className={stil.oblacicVeza}
                href="/#kontakt"
                onClick={() => postaviOtvoren(false)}
              >
                Kontaktirajte me
                <Strelica />
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
