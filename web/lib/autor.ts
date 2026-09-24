/**
 * Podaci o autoru ideje. Ime, fotografija i tekst idu na javni sajt tek uz
 * njegovu pismenu saglasnost.
 */
export const AUTOR = {
  ime: "Matija Lakićević",
  titula: "Doktor stomatologije",
  /** Put do fotografije u `public/`; dok je nema, kartica pokazuje siluetu. */
  slika: "/img/autor.webp" as string | undefined,
};
