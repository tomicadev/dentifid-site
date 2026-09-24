import Link from "next/link";
import stil from "./Footer.module.css";
import { IZDANJE, KONTAKT } from "@/lib/izdanje";
import Cetkica3D from "@/components/ui/Cetkica3D";

export default function Footer() {
  return (
    <footer className={stil.podnozje}>
      {/* Dve ukrštene četkice na šavu iznad podnožja. */}
      <div className={stil.znakMesto} aria-hidden="true">
        <Cetkica3D boja="#0e62e0" pasta className={`${stil.cetkica} ${stil.cetkicaLeva}`} />
        <Cetkica3D boja="#12a0d6" className={`${stil.cetkica} ${stil.cetkicaDesna}`} />
      </div>

      <div className="okvir">
        <div className={stil.karton}>
          <div className={stil.zaglavljeKartona}>
            <Link href="/" className={stil.logo} aria-label="DentifID, početna strana">
              <img src="/svg/logo.svg" width={284} height={97} alt="DentifID" />
            </Link>
            <p className={stil.slogan}>
              DentifID pomaže da procenite koliko je hitan problem sa zubima i kome da se
              javite. Nije medicinsko sredstvo i ne postavlja dijagnozu — konačnu reč uvek
              daje stomatolog.
            </p>
          </div>

          <div>
            <p className={stil.naslovKolone}>Izdanje</p>
            <ul className={stil.redovi}>
              <li className={stil.red}>
                <span className={stil.polje}>Verzija</span>
                <span className={stil.crtice} aria-hidden="true" />
                <span>{IZDANJE.verzija}</span>
              </li>
              <li className={stil.red}>
                <span className={stil.polje}>Veličina</span>
                <span className={stil.crtice} aria-hidden="true" />
                <span>{IZDANJE.velicina}</span>
              </li>
              <li className={stil.red}>
                <span className={stil.polje}>Android</span>
                <span className={stil.crtice} aria-hidden="true" />
                <span>{IZDANJE.najstarijiAndroid} ili noviji</span>
              </li>
              <li className={stil.red}>
                <span className={stil.polje}>Jezik</span>
                <span className={stil.crtice} aria-hidden="true" />
                <span>srpski</span>
              </li>
            </ul>
          </div>

          <div>
            <p className={stil.naslovKolone}>Kontakt i pravne informacije</p>
            <ul className={stil.redovi}>
              <li className={stil.red}>
                <span className={stil.polje}>Korisnička podrška</span>
                <span className={stil.crtice} aria-hidden="true" />
                <a className={stil.veza} href={`mailto:${KONTAKT.korisnici}`}>
                  {KONTAKT.korisnici}
                </a>
              </li>
              <li className={stil.red}>
                <span className={stil.polje}>Developer</span>
                <span className={stil.crtice} aria-hidden="true" />
                <a className={stil.veza} href={`mailto:${KONTAKT.autor}`}>
                  {KONTAKT.autor}
                </a>
              </li>
              <li className={stil.red}>
                <span className={stil.polje}>Privatnost</span>
                <span className={stil.crtice} aria-hidden="true" />
                <a className={stil.veza} href={KONTAKT.politikaPrivatnosti} rel="noopener">
                  Politika privatnosti
                </a>
              </li>
              <li className={stil.red}>
                <span className={stil.polje}>Bezbednost naloga</span>
                <span className={stil.crtice} aria-hidden="true" />
                <a className={stil.veza} href={KONTAKT.brisanjeNaloga} rel="noopener">
                  Obriši nalog
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={stil.sitno}>
          <span>Developer: {KONTAKT.izdavac}</span>
          <span className={stil.ime}>DentifID</span>
        </div>
      </div>
    </footer>
  );
}
