import type { CSSProperties } from "react";
import stil from "./TemeSekcija.module.css";
import Otkrij from "@/components/ui/Otkrij";
import Telefon from "@/components/ui/Telefon";

export default function TemeSekcija() {
  return (
    <section className="sekcija" id="teme" data-pratilac="5,28">
      <div className="okvir">
        <Otkrij className={stil.zaglavlje}>
          <p className="nadnaslov">Dve teme</p>
          <h2>
            Svetla ili <span className="istaknuto">tamna</span> tema?
          </h2>
          <p className={`uvod ${stil.uvodSredina}`}>
            Vi birate! Odaberite temu u Podešavanjima — svetlu, tamnu ili kao na telefonu.
            Isti ekran, dva raspoloženja.
          </p>
        </Otkrij>

        <div className={stil.kartica}>
          <div className={stil.telefoni}>
            <Telefon
              snimak="06-saveti-bez-trake"
              alt="Ekran sa savetima o nezi zuba u svetloj temi"
              odnos="1080 / 2111"
              sirina="clamp(10.5rem, 19vw, 14rem)"
              mirovanje={{ x: 5, y: 20 }}
              jacina={10}
              visinaLeta={24}
              className={stil.svetliTelefon}
            />
            <Telefon
              snimak="10-tamna-tema-saveti"
              alt="Isti ekran sa savetima u tamnoj temi"
              odnos="1080 / 2111"
              sirina="clamp(10.5rem, 19vw, 14rem)"
              mirovanje={{ x: 5, y: -20 }}
              jacina={10}
              visinaLeta={24}
              bojaSjaja="rgb(46 144 255 / 60%)"
              className={stil.tamniTelefon}
              style={{ "--kasnjenje": "-3.2s" } as CSSProperties}
            />
          </div>

          <ul className={stil.natpisi}>
            <li className={`${stil.natpis} ${stil.svetla}`}>
              <span className={stil.tacka} aria-hidden="true" />
              Svetla tema
            </li>
            <li className={`${stil.natpis} ${stil.tamna}`}>
              <span className={stil.tacka} aria-hidden="true" />
              Tamna tema
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
