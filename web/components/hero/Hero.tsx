import stil from "./Hero.module.css";
import Dugme from "@/components/ui/Dugme";
import Telefon from "@/components/ui/Telefon";
import { Android, Apple, Zub } from "@/components/ui/Ikone";

const DOKAZI = [
  { broj: "17", tekst: "pitanja do vaše procene" },
  { broj: "9", tekst: "saveta o nezi zuba i desni" },
  { broj: "0", tekst: "reklama u aplikaciji" },
];

export default function Hero() {
  return (
    <section className={stil.hero} data-pratilac="93,31">
      <div className={`okvir ${stil.mreza}`}>
        <div className={stil.tekst}>
          <p className={stil.znacka}>
            <span className={stil.znackaTacka}>
              <Zub />
            </span>
            Digitalna procena — stručna preporuka
          </p>

          <h1 className={stil.naslov}>
            Koliko je hitan vaš <span className="istaknuto">problem</span> sa zubima?
          </h1>

          <p className={`uvod ${stil.opis}`}>
            DentifID kroz kratak upitnik daje procenu hitnosti i predlog specijaliste
            stomatologije kome da se obratite.
          </p>

          <div className={stil.radnje}>
            <Dugme href="/#preuzimanje" velicina="veliko" ikona={<Android />}>
              Preuzmi aplikaciju
            </Dugme>
            <span className={stil.uskoro}>
              <Dugme vrsta="sporedno" velicina="veliko" ikona={<Apple />} disabled>
                Za iPhone
              </Dugme>
            </span>
          </div>

          <p className={stil.podatak}>Besplatno · Android 7.0+ · 63 MB</p>

          <ul className={stil.dokazi}>
            {DOKAZI.map((dokaz) => (
              <li key={dokaz.tekst} className={stil.dokaz} tabIndex={0}>
                <span className={stil.dokazBroj}>{dokaz.broj}</span>
                <span className={stil.dokazTekst}>{dokaz.tekst}</span>
                <span className={stil.dokazCrta} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <div className={stil.scena}>
          <Telefon
            snimak="04-rezultat"
            alt="Ekran rezultata u aplikaciji: DentifID SCORE 7 i nivo „Pregled u što skorijem roku”"
            sirina="clamp(14.5rem, 23vw, 18.5rem)"
            mirovanje={{ x: 6, y: -16 }}
            jacina={16}
            visinaLeta={16}
            prioritet
            sizes="(max-width: 60rem) 60vw, 19rem"
          />
        </div>
      </div>
    </section>
  );
}
