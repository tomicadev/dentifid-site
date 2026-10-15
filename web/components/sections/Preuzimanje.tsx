import stil from "./Preuzimanje.module.css";
import Otkrij from "@/components/ui/Otkrij";
import Platforme from "./Platforme";
import { IZDANJE } from "@/lib/izdanje";

export default function Preuzimanje() {
  return (
    <>
      <div className={stil.talasi} aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path className={stil.talas1} d="M0 54c180-40 360 24 540 24s360-56 540-56 300 34 360 46v52H0Z" />
          <path className={stil.talas2} d="M0 78c200-36 340 14 520 20s380-40 560-34 260 30 360 38v18H0Z" />
          <path className={stil.talas3} d="M0 100c220-26 380 6 560 12s400-24 580-18 200 18 300 24v12H0Z" />
        </svg>
      </div>

      <section className={stil.sekcija} id="preuzimanje" data-pratilac="94,20">
        <div className="okvir">
          <Platforme
            uvod={
              <Otkrij>
                <p className="nadnaslov">Preuzimanje</p>
                <h2>
                  Instalirajte <span className="istaknuto">za minut</span>
                </h2>
                <p className={`uvod ${stil.uvodDole}`}>
                  Izaberite telefon i ispratite sledeće korake:
                </p>
              </Otkrij>
            }
          />

          <ul className={stil.podaci}>
            <li className={stil.podatak}>
              Verzija <strong>{IZDANJE.verzija}</strong>
            </li>
            <li className={stil.podatak}>
              Veličina <strong>{IZDANJE.velicina}</strong>
            </li>
            <li className={stil.podatak}>
              Android <strong>{IZDANJE.najstarijiAndroid} ili noviji</strong>
            </li>
            <li className={stil.podatak}>
              iPhone <strong>preko TestFlight-a</strong>
            </li>
            <li className={stil.podatak}>
              Cena <strong>besplatno</strong>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
