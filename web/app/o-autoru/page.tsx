import type { Metadata } from "next";
import stil from "./stranica.module.css";
import Dugme from "@/components/ui/Dugme";
import Otkrij from "@/components/ui/Otkrij";
import { Pazljivo } from "@/components/ui/Ikone";

export const metadata: Metadata = {
  title: "O autoru ideje — DentifID",
  description:
    "Strana o stomatologu koji je došao na ideju za DentifID. Tekst i fotografija se objavljuju tek uz njegovu saglasnost.",
  alternates: { canonical: "/o-autoru" },
};

const POLJA = [
  {
    naslov: "Ime i zvanje",
    tekst: "",
    oznaka: "[čeka tekst]",
  },
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
    <section className={stil.strana}>
      <div className="okvir">
        <article className={stil.clanak}>
          <Otkrij>
            <p className="nadnaslov">O autoru ideje</p>
            <h1>
              Stomatolog koji je došao <span className="istaknuto">na ideju</span>
            </h1>
            <p className={`uvod ${stil.uvod}`}>
              Ideja za DentifID došla je od stomatologa. Njegovo ime, biografija i
              fotografija idu na ovu stranu tek kada ih on sam odobri, svojim rečima.
            </p>

            <p className={stil.najava}>
              <Pazljivo />
              <span>
                Ova strana čeka njegov tekst i pismenu saglasnost. Do tada ovde nema imena
                ni fotografije, a polja ispod pokazuju šta će na njoj stajati.
              </span>
            </p>
          </Otkrij>

          <div className={stil.raspored}>
            <div
              className={stil.mestoZaSliku}
              role="img"
              aria-label="Mesto rezervisano za fotografiju, još je prazno"
            >
              <span>Mesto za fotografiju</span>
              <span>1:1 · čeka saglasnost</span>
            </div>

            <ul className={stil.polja}>
              {POLJA.map((polje) => (
                <li key={polje.naslov} className={stil.polje}>
                  <h2 className={stil.naslovPolja}>{polje.naslov}</h2>
                  {polje.tekst ? <p className={stil.tekstPolja}>{polje.tekst}</p> : null}
                  <span className={stil.ceka}>{polje.oznaka}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={stil.nazad}>
            <Dugme href="/#preuzimanje" vrsta="sporedno">
              Nazad na preuzimanje
            </Dugme>
          </div>
        </article>
      </div>
    </section>
  );
}
