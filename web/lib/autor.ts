/**
 * Podaci o autoru ideje. Ime, fotografija i tekst su objavljeni uz njegovu
 * saglasnost; tekst priče je doslovno onaj koji je autor poslao.
 */
export const AUTOR = {
  ime: "Matija Lakićević",
  titula: "Doktor stomatologije",
  /** Kvadratni isečak za karticu na mantilu. */
  slika: "/img/autor.webp" as string | undefined,
  /** Veća, uspravna fotografija za biografiju. */
  portret: "/img/autor-portret.webp",
};

export const PRICA = {
  biografija: {
    naslov: "Matija Lakićević, doktor stomatologije",
    pasusi: [
      "Matija Lakićević, rođen 2001. godine, svoj profesionalni put u oblasti stomatologije započinje još 2017. godine, upisom Srednje medicinske škole sa domom učenika „Sestre Ninković“, na smeru zubni tehničar.",
      "Nakon završetka srednjoškolskog obrazovanja i položenog stručnog ispita, svoje obrazovanje nastavlja upisom studija stomatologije 2021. godine. Studije završava 2026. godine, čime stiče zvanje doktora stomatologije.",
      "Višegodišnje obrazovanje u oblasti dentalne medicine omogućilo mu je da sagleda stomatologiju iz različitih perspektiva — od dentalne laboratorije i izrade protetskih nadoknada, do kliničkog rada i direktnog pristupa pacijentu.",
    ],
  },
  /**
   * Kratka putanja školovanja. Neprelomivi razmaci ( ) drže crtu uz reč
   * pre nje i zanimanje u jednom redu.
   */
  putanja: [
    { godina: "2017.", opis: "Srednja medicinska škola — Zubni tehničar" },
    { godina: "2021.", opis: "Fakultet medicinskih nauka u Kragujevcu" },
    { godina: "2026.", opis: "Doktor stomatologije" },
  ],
  ideja: {
    naslov: "Odakle je potekla ideja",
    pasusi: [
      "Ideja za DentifID nastala je iz želje da se savremena tehnologija približi stomatologiji i učini njen značaj dostupnijim širem broju ljudi.",
      "Tokom studija stomatologije razvila se zamisao o stvaranju digitalnog rešenja koje bi moglo da bude prvi korak između korisnika i stomatološke ordinacije — da korisniku pomogne da prepozna značaj simptoma, bolje razume svoje oralno zdravlje i, što je najvažnije, pravovremeno potraži stručnu pomoć.",
      "DentifID je tako nastao kao rezultat interesovanja za digitalizaciju, programiranje i razvoj inovativnih rešenja koja mogu imati praktičnu primenu u svakodnevnom životu.",
    ],
  },
  uloga: {
    naslov: "Uloga u aplikaciji",
    pasus:
      "Kao autor ideje, učestvuje u razvoju DentifID-a sa fokusom na stručni i konceptualni deo aplikacije.",
    istaknuto: "Ovo je tek početak.",
    ostatak:
      "U narednom periodu očekuje vas razvoj novih funkcionalnosti i dolazak ozbiljnijih projekata koji će nastaviti da povezuju savremenu tehnologiju sa stomatologijom i unapređenjem oralnog zdravlja.",
  },
};
