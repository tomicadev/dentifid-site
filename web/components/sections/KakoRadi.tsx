"use client";

import { useEffect, useRef, useState } from "react";
import stil from "./KakoRadi.module.css";
import Otkrij from "@/components/ui/Otkrij";
import { Upitnik, VilicaZnak, Prsten } from "@/components/ui/Ikone";

const KORACI = [
  {
    ikona: Upitnik,
    naslov: "Odgovorite na pitanja",
    tekst:
      "Krenite od onoga što osećate: šta vas muči, od kada i koliko jako. Odrasli odgovaraju na 17 pitanja, a za decu roditelji popunjavaju prilagođen upitnik sa 12 pitanja.",
  },
  {
    ikona: VilicaZnak,
    naslov: "Pokažite zub",
    tekst:
      "Na crtežu gornje i donje vilice dodirnite zub koji vas muči — ne morate znati kako se zove. Za decu se prikazuju mlečni zubi.",
  },
  {
    ikona: Prsten,
    naslov: "Pogledajte procenu",
    tekst:
      "Dobijate ocenu od 1 do 10, nivo hitnosti i predlog kom specijalisti stomatologije da se obratite, pa znate da li je dovoljna redovna kontrola ili treba reagovati brže.",
  },
];

export default function KakoRadi() {
  const [vidljivo, postaviVidljivo] = useState(false);
  const okvir = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const element = okvir.current;
    if (!element) return;

    const posmatrac = new IntersectionObserver(
      (unosi) => {
        unosi.forEach((unos) => {
          if (unos.isIntersecting) {
            postaviVidljivo(true);
            posmatrac.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );

    posmatrac.observe(element);
    return () => posmatrac.disconnect();
  }, []);

  return (
    <section className={`sekcija ${stil.sekcija}`} id="kako-radi" data-pratilac="4.5,32">
      <div className="okvir">
        <Otkrij className={stil.zaglavlje}>
          <p className="nadnaslov">Kako radi</p>
          <h2>
            Tri koraka do <span className="istaknuto">procene</span>
          </h2>
        </Otkrij>

        <ol className={stil.koraci} ref={okvir}>
          <span className={stil.spojnica} data-vidljivo={vidljivo ? "da" : "ne"} aria-hidden="true" />
          {KORACI.map((korak, i) => {
            const Ikona = korak.ikona;
            return (
              <li key={korak.naslov} className={stil.korak}>
                <span className={stil.broj} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={stil.znacka} aria-hidden="true">
                  <Ikona />
                </span>
                <h3 className={stil.naslovKoraka}>{korak.naslov}</h3>
                <p className={stil.tekst}>{korak.tekst}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
