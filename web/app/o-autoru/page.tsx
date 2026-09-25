import type { Metadata } from "next";
import stil from "./stranica.module.css";
import Otkrij from "@/components/ui/Otkrij";
import { Strelica } from "@/components/ui/Ikone";
import MantilPozornica from "@/components/autor/MantilPozornica";
import Prica from "@/components/autor/Prica";
import { AUTOR } from "@/lib/autor";

export const metadata: Metadata = {
  title: "O autoru ideje — DentifID",
  description: `${AUTOR.ime}, doktor stomatologije koji je došao na ideju za DentifID.`,
  alternates: { canonical: "/o-autoru" },
};

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

      <Prica />
    </>
  );
}
