"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import stil from "./Preuzimanje.module.css";
import Dugme from "@/components/ui/Dugme";
import { Android, Apple } from "@/components/ui/Ikone";
import { IZDANJE, SIDRO_IPHONE } from "@/lib/izdanje";

type Platforma = "android" | "iphone";

const PLATFORME: Record<
  Platforma,
  {
    naziv: string;
    ikona: ReactNode;
    koraci: string[];
    napomena: ReactNode;
    dugme: { tekst: string; href: string };
    qr: { src: string; alt: string; natpis: string; adresa: string };
  }
> = {
  android: {
    naziv: "Android",
    ikona: <Android />,
    koraci: [
      "Dodirnite dugme ispod ili skenirajte QR kod telefonom.",
      "Kad se fajl preuzme, otvorite ga iz obaveštenja ili iz foldera Preuzimanja.",
      "Android će pitati da dozvolite instalaciju iz ovog izvora — potvrdite i vratite se na instalaciju.",
      "Otvorite aplikaciju, napravite nalog i pokrenite prvu procenu.",
    ],
    napomena: (
      <>
        Ako se javi Play Protect sa porukom da programer nije poznat, izaberite
        „Ipak instaliraj”. Tu poruku pokazuje svaki telefon za aplikacije koje ne
        dolaze iz prodavnice.
      </>
    ),
    dugme: { tekst: "Preuzmi za Android", href: IZDANJE.adresaApk },
    qr: {
      src: "/img/qr.png",
      alt: "QR kod koji vodi na ovu stranu za preuzimanje",
      natpis: "Skenirajte telefonom ili otvorite",
      adresa: "dentifid.rs/#preuzimanje",
    },
  },
  iphone: {
    naziv: "iPhone",
    ikona: <Apple />,
    koraci: [
      "Iz App Store-a instalirajte besplatnu Apple-ovu aplikaciju TestFlight.",
      "Dodirnite dugme ispod ili skenirajte QR kod kamerom telefona.",
      "Otvoriće se TestFlight — prihvatite poziv i instalirajte DentifID.",
      "Otvorite aplikaciju, napravite nalog i pokrenite prvu procenu.",
    ],
    napomena: (
      <>
        TestFlight je Apple-ova zvanična aplikacija za objavljivanje aplikacija pre
        izlaska u App Store. Nove verzije DentifID-a stižu preko nje, kao obično
        ažuriranje.
      </>
    ),
    dugme: { tekst: "Preuzmi za iPhone", href: IZDANJE.adresaTestFlight },
    qr: {
      src: "/img/qr-iphone.png",
      alt: "QR kod koji vodi na DentifID u aplikaciji TestFlight",
      natpis: "Skenirajte kamerom iPhone-a",
      adresa: "testflight.apple.com",
    },
  },
};

/**
 * Uputstvo za preuzimanje sa izborom telefona: koraci, napomena, dugme i QR kod
 * menjaju se zajedno. Na iPhone-u, i kad se dođe preko dugmeta „Za iPhone”,
 * odmah je izabran iPhone.
 */
export default function Platforme({ uvod }: { uvod: ReactNode }) {
  const [izbor, setIzbor] = useState<Platforma>("android");
  const id = useId();

  useEffect(() => {
    const iOS =
      /iPhone|iPad|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    if (iOS || window.location.hash === `#${SIDRO_IPHONE}`) setIzbor("iphone");

    // Next.js menja adresu bez događaja „hashchange”, pa se prati sam klik na vezu.
    const naKlik = (e: MouseEvent) => {
      const veza = (e.target as Element | null)?.closest?.("a[href]");
      if (veza?.getAttribute("href")?.endsWith(`#${SIDRO_IPHONE}`)) setIzbor("iphone");
    };
    document.addEventListener("click", naKlik);
    return () => document.removeEventListener("click", naKlik);
  }, []);

  const p = PLATFORME[izbor];

  return (
    <div className={stil.mreza}>
      <div>
        {uvod}

        <div className={stil.izbor} role="tablist" aria-label="Telefon" id={SIDRO_IPHONE}>
          {(Object.keys(PLATFORME) as Platforma[]).map((kljuc) => (
            <button
              key={kljuc}
              type="button"
              role="tab"
              id={`${id}-${kljuc}`}
              aria-selected={izbor === kljuc}
              aria-controls={`${id}-panel`}
              className={stil.izborDugme}
              onClick={() => setIzbor(kljuc)}
            >
              <span className={stil.izborIkona} aria-hidden="true">
                {PLATFORME[kljuc].ikona}
              </span>
              {PLATFORME[kljuc].naziv}
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${izbor}`}>
          <ol className={stil.koraci} key={izbor}>
            {p.koraci.map((korak, i) => (
              <li key={korak} className={stil.korak}>
                <span className={stil.korakBroj} aria-hidden="true">
                  {i + 1}
                </span>
                <p className={stil.korakTekst}>{korak}</p>
              </li>
            ))}
          </ol>

          <p className={stil.napomenaPlay}>{p.napomena}</p>

          <div className={stil.radnje}>
            <Dugme href={p.dugme.href} velicina="veliko" ikona={p.ikona}>
              {p.dugme.tekst}
            </Dugme>
          </div>
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
        <span className={stil.qrPlatforma}>
          <span className={stil.izborIkona} aria-hidden="true">
            {p.ikona}
          </span>
          {p.naziv}
        </span>
        <span className={stil.qrOkvir}>
          <img key={p.qr.src} src={p.qr.src} width={350} height={350} alt={p.qr.alt} />
        </span>
        <figcaption className={stil.qrNatpis}>
          {p.qr.natpis}
          <span className={stil.qrAdresa}>{p.qr.adresa}</span>
        </figcaption>
      </figure>
    </div>
  );
}
