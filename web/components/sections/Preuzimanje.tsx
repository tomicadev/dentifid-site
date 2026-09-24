import stil from "./Preuzimanje.module.css";
import Dugme from "@/components/ui/Dugme";
import Otkrij from "@/components/ui/Otkrij";
import { Android, Apple } from "@/components/ui/Ikone";
import { IZDANJE } from "@/lib/izdanje";

const KORACI = [
  "Dodirnite dugme ispod ili skenirajte QR kod telefonom.",
  "Kad se fajl preuzme, otvorite ga iz obaveštenja ili iz foldera Preuzimanja.",
  "Android će pitati da dozvolite instalaciju iz ovog izvora — potvrdite i vratite se na instalaciju.",
  "Otvorite aplikaciju, napravite nalog i pokrenite prvu procenu.",
];

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
          <div className={stil.mreza}>
            <div>
              <Otkrij>
                <p className="nadnaslov">Preuzimanje</p>
                <h2>
                  Instalirajte <span className="istaknuto">za minut</span>
                </h2>
                <p className={`uvod ${stil.uvodDole}`}>
                  Za preuzimanje aplikacije ispratite sledeće korake:
                </p>
              </Otkrij>

              <ol className={stil.koraci}>
                {KORACI.map((korak, i) => (
                  <li key={korak} className={stil.korak}>
                    <span className={stil.korakBroj} aria-hidden="true">
                      {i + 1}
                    </span>
                    <p className={stil.korakTekst}>{korak}</p>
                  </li>
                ))}
              </ol>

              <p className={stil.napomenaPlay}>
                Ako se javi Play Protect sa porukom da programer nije poznat, izaberite
                „Ipak instaliraj”. Tu poruku pokazuje svaki telefon za aplikacije koje ne
                dolaze iz prodavnice.
              </p>

              <div className={stil.radnje}>
                <Dugme href={IZDANJE.adresaApk} velicina="veliko" ikona={<Android />}>
                  Preuzmi za Android
                </Dugme>
                <Dugme vrsta="sporedno" velicina="veliko" ikona={<Apple />} disabled>
                  Uskoro za iPhone
                </Dugme>
              </div>
            </div>

            <figure className={stil.qr}>
              {(["gl", "gd", "dl", "dd"] as const).map((ugao) => (
                <span key={ugao} className={`${stil.ugao} ${stil[ugao]}`} aria-hidden="true">
                  <svg viewBox="0 0 200 200">
                    <path d="M96 26C88 26 70 4 52 9C33 13 13 33 12 62C11 85 17 103 27 119C34 143 42 170 54 182C61 189 69 187 72 178C80 159 88 138 96 131C99 128 104 129 106 133C111 145 116 169 124 181C133 193 152 194 162 183C171 173 176 155 179 136C187 111 195 86 193 64C191 34 170 7 146 8C124 9 104 26 96 26Z" />
                  </svg>
                </span>
              ))}
              <span className={stil.qrOkvir}>
                <img
                src="/img/qr.png"
                width={350}
                height={350}
                alt="QR kod koji vodi na ovu stranu za preuzimanje"
                />
              </span>
              <figcaption className={stil.qrNatpis}>
                Skenirajte telefonom ili otvorite
                <span className={stil.qrAdresa}>dentifid.rs/#preuzimanje</span>
              </figcaption>
            </figure>
          </div>

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
              Cena <strong>besplatno</strong>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
