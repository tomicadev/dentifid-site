import stil from "./NijeDijagnoza.module.css";
import { Pazljivo } from "@/components/ui/Ikone";
import Otkrij from "@/components/ui/Otkrij";

export default function NijeDijagnoza() {
  return (
    <section className={`sekcija ${stil.sekcija}`} id="sta-nije" data-pratilac="6,50">
      <div className="okvir">
        <Otkrij>
          <div className={stil.kartica}>
            <span className={stil.znak} aria-hidden="true">
              <Pazljivo />
            </span>
            <h2 className={stil.naslov}>Šta aplikacija nije</h2>
            <p className={stil.tekst}>
              Aplikacija ne postavlja dijagnozu i ne zamenjuje pregled kod stomatologa.
              Procena se oslanja isključivo na odgovore koje korisnik unese, a konačnu ocenu
              vašeg stanja uvek daje stomatolog ili stručno medicinsko lice kod koga obavljate
              pregled.
            </p>
            <p className={stil.hitno}>
              Ako imate otežano disanje ili gutanje, jak otok lica ili obilno krvarenje, ne
              čekajte procenu — odmah pozovite hitnu službu na{" "}
              <a className={stil.broj} href="tel:194">
                194
              </a>
              .
            </p>
          </div>
        </Otkrij>
      </div>
    </section>
  );
}
