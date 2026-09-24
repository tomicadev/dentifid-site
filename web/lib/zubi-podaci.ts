/**
 * Kratke anatomske činjenice o zubima, za prozor koji se otvara klikom.
 *
 * Ovde nema nijedne procene, ocene ni saveta o lečenju — samo uloga zuba, broj
 * korenova i uzrast u kom stalni zub obično niče. Uzrasti su okvirni, kako ih
 * navode udžbenici dentalne anatomije. Tekstove treba da pročita i potvrdi
 * stomatolog pre objave.
 */

import type { Zub } from "./vilica";

export type PodaciZuba = {
  uloga: string;
  koreni: string;
  nicanje: string;
};

export function podaciZuba(zub: Zub): PodaciZuba {
  const gore = zub.vilica === "gornja";
  const prvi = zub.fdi[1] === "4" || zub.fdi[1] === "6";

  switch (zub.tip) {
    case "sekutic":
      return {
        uloga:
          "Zaseca i odvaja zalogaj. Sa ostalim prednjim zubima oblikuje osmeh i učestvuje u izgovoru glasova.",
        koreni: "Jedan koren, kupastog oblika.",
        nicanje: gore
          ? "Stalni zub niče između 7. i 8. godine."
          : "Stalni zub niče između 6. i 7. godine, među prvima.",
      };

    case "lateralni":
      return {
        uloga:
          "Pomaže centralnom sekutiću pri zasecanju hrane i čini prelaz između prednjih zuba i očnjaka.",
        koreni: "Jedan koren.",
        nicanje: gore
          ? "Stalni zub niče između 8. i 9. godine."
          : "Stalni zub niče između 7. i 8. godine.",
      };

    case "ocnjak":
      return {
        uloga:
          "Kida i pridržava hranu. Kao najstabilniji zub u luku vodi pokrete donje vilice pri zagrižaju.",
        koreni: "Jedan koren — najduži u celoj vilici.",
        nicanje: gore
          ? "Stalni zub niče između 11. i 12. godine."
          : "Stalni zub niče između 9. i 10. godine.",
      };

    case "premolar":
      return {
        uloga:
          "Prihvata hranu od očnjaka i drobi je, pre nego što je preuzmu kutnjaci.",
        koreni: gore && prvi ? "Najčešće dva korena." : "Najčešće jedan koren.",
        nicanje: gore
          ? prvi
            ? "Stalni zub niče između 10. i 11. godine."
            : "Stalni zub niče između 10. i 12. godine."
          : prvi
            ? "Stalni zub niče između 10. i 12. godine."
            : "Stalni zub niče između 11. i 12. godine.",
      };

    case "molar":
    default:
      return {
        uloga:
          "Učestvuje u završnoj obradi hrane: usitnjava je i melje pre gutanja. Nosi najveći deo sile žvakanja.",
        koreni: gore ? "Tri korena — dva sa obrazne i jedan sa nepčane strane." : "Dva korena.",
        nicanje: prvi
          ? "Niče oko 6. godine, iza mlečnih zuba — često je prvi stalni zub."
          : gore
            ? "Niče između 12. i 13. godine."
            : "Niče između 11. i 13. godine.",
      };
  }
}
