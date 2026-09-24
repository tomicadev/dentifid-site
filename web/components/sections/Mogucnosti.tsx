import Link from "next/link";
import stil from "./Mogucnosti.module.css";
import Otkrij from "@/components/ui/Otkrij";
import { Dete, Istorija, Karton, Zvono, Zub, Strelica } from "@/components/ui/Ikone";

const STAVKE = [
  {
    ikona: Dete,
    naslov: "Procena za dete",
    tekst:
      "Deca nisu mali odrasli — ni kad su zubi u pitanju. Kroz dečji profil upitnik je prilagođen uzrastu, a na crtežu vilice su mlečni zubi.",
  },
  {
    ikona: Istorija,
    naslov: "Istorija procena",
    tekst:
      "Svaka procena ostaje zapisana, sa datumom, rezultatom i odgovorima. Na pregledu stomatologu možete da pokažete kako se problem menjao.",
  },
  {
    ikona: Karton,
    naslov: "Stomatološki karton",
    tekst:
      "Datum poslednjeg pregleda i čišćenja kamenca, sledeći termin, kontakt vašeg stomatologa, urađene intervencije, alergije i sistemske bolesti — na jednom mestu.",
  },
  {
    ikona: Zvono,
    naslov: "Podsetnici",
    tekst:
      "Aplikacija prati datume iz kartona i podseća vas na kontrolni pregled, čišćenje kamenca i zakazan termin. Podsetnik koji vam ne treba jednostavno odbacite.",
  },
  {
    ikona: Zub,
    naslov: "Devet saveta o nezi zuba",
    tekst:
      "Kratki tekstovi o svakodnevnoj nezi, prevenciji, zubima kod dece i oporavku posle intervencije. Napisao ih je i odobrio stomatolog.",
  },
];

export default function Mogucnosti() {
  return (
    <section className="sekcija" id="mogucnosti" data-pratilac="94,24">
      <div className="okvir">
        <Otkrij className={stil.zaglavlje}>
          <p className="nadnaslov">Sve u jednoj aplikaciji</p>
          <h2>
            Šta još <span className="istaknuto">nudimo?</span>
          </h2>
        </Otkrij>

        <Otkrij decu korak={0.06} className={stil.kartice} pomeraj={22}>
          {STAVKE.map((stavka) => {
            const Ikona = stavka.ikona;
            return (
              <div key={stavka.naslov} className={stil.kartica}>
                <span className={stil.znak} aria-hidden="true">
                  <Ikona />
                </span>
                <h3 className={stil.naslovKartice}>{stavka.naslov}</h3>
                <p className={stil.tekst}>{stavka.tekst}</p>
              </div>
            );
          })}

          <div className={`${stil.kartica} ${stil.poziv}`}>
            <span className={stil.znak} aria-hidden="true">
              <Strelica />
            </span>
            <h3 className={stil.naslovKartice}>I još mnogo toga</h3>
            <p className={stil.tekst}>
              Profili za ukućane, prijava preko Google naloga, svetla i tamna tema i brisanje
              naloga sa svim podacima u jednom koraku.
            </p>
            <Link className={stil.pozivVeza} href="/#preuzimanje">
              Preuzmite i pogledajte
              <Strelica />
            </Link>
          </div>
        </Otkrij>
      </div>
    </section>
  );
}
