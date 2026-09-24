import stil from "./KarticaLice.module.css";

type Props = {
  ime: string;
  titula: string;
  slika?: string;
};

/**
 * Lice identifikacione kartice. Napravljeno je u HTML-u i samo postavljeno u
 * prostor, pa slika, ime i titula ostaju oštri kao ostatak strane.
 */
export default function KarticaLice({ ime, titula, slika }: Props) {
  return (
    <div className={stil.kartica}>
      <span className={stil.prorez} />
      <img className={stil.logo} src="/svg/logo.svg" width={284} height={97} alt="" />
      <span className={stil.linija} />
      <div className={stil.foto}>
        {slika ? (
          <img src={slika} width={640} height={640} alt="" />
        ) : (
          <svg viewBox="0 0 264 264" aria-hidden="true">
            <circle cx="132" cy="104" r="48" fill="#bccfe8" />
            <path d="M34 264c6-72 46-100 98-100s92 28 98 100z" fill="#bccfe8" />
          </svg>
        )}
      </div>
      <p className={stil.ime}>{ime}</p>
      <p className={stil.titula}>{titula}</p>
      <span className={stil.traka} />
      <span className={stil.sjaj} />
    </div>
  );
}
