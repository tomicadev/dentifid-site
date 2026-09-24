import type { Metadata } from "next";
import stil from "./stranica.module.css";
import Dugme from "@/components/ui/Dugme";
import Otkrij from "@/components/ui/Otkrij";
import { Strelica } from "@/components/ui/Ikone";
import MantilPozornica from "@/components/autor/MantilPozornica";
import { AUTOR } from "@/lib/autor";

export const metadata: Metadata = {
  title: "O autoru ideje — DentifID",
  description: `${AUTOR.ime}, doktor stomatologije koji je došao na ideju za DentifID.`,
  alternates: { canonical: "/o-autoru" },
};

const POLJA = [
  {
    naslov: "Biografija",
    tekst: "Gde je studirao, čime se bavi i koliko dugo radi.",
    oznaka: "[čeka tekst]",
  },
  {
    naslov: "Odakle ideja",
    tekst:
      "Koje pitanje pacijenti najčešće postavljaju i zašto je procena hitnosti korisna pre odlaska kod stomatologa.",
    oznaka: "[čeka tekst]",
  },
  {
    naslov: "Uloga u aplikaciji",
    tekst: "Napisao je i odobrio tekstove saveta i proverio sadržaj upitnika.",
    oznaka: "[čeka potvrdu formulacije]",
  },
];

export default function OAutoru() {
  return (
    <>
      <section className={stil.hero} data-pratilac="93,84">
        <div className={`okvir ${stil.heroMreza}`}>
          <MantilPozornica
            ime={AUTOR.ime}
            titula={AUTOR.titula}
            slika={AUTOR.slika}
            className={stil.pozornica}
          />

          <Otkrij decu korak={0.09} className={stil.heroTekst}>
            <p className="nadnaslov">O autoru ideje</p>
            <h1 className={stil.naslov}>
              Doktor stomatologije koji je došao <span className="istaknuto">na ideju</span>
            </h1>
            <p className={stil.potpis}>
              <span className={stil.crtica} aria-hidden="true" />
              {AUTOR.ime}
            </p>
            <p className={`uvod ${stil.uvod}`}>
              Kako je nastala ideja za DentifID — iz ugla stomatologa koji ju je smislio.
            </p>
            <a className={stil.dalje} href="#prica">
              Pročitajte priču
              <Strelica />
            </a>
          </Otkrij>
        </div>
      </section>

      <section id="prica" className={stil.strana}>
        <div className="okvir">
          <article className={stil.clanak}>
            <ul className={stil.polja}>
              {POLJA.map((polje) => (
                <li key={polje.naslov} className={stil.polje}>
                  <h2 className={stil.naslovPolja}>{polje.naslov}</h2>
                  <p className={stil.tekstPolja}>{polje.tekst}</p>
                  <span className={stil.ceka}>{polje.oznaka}</span>
                </li>
              ))}
            </ul>

            <div className={stil.nazad}>
              <Dugme href="/#preuzimanje" vrsta="sporedno">
                Nazad na preuzimanje
              </Dugme>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
