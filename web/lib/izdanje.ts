/** Podaci o objavljenom izdanju aplikacije; menjaju se na jednom mestu. */

export const IZDANJE = {
  verzija: "1.0.1",
  velicina: "62,9 MB",
  velicinaZaokruzeno: "63 MB",
  najstarijiAndroid: "7.0",
  paket: "com.dentifid.app",
  adresaApk:
    "https://github.com/tomicadev/dentifid-releases/releases/latest/download/dentifid.apk",
  adresaIzdanja: "https://github.com/tomicadev/dentifid-releases",
} as const;

export const KONTAKT = {
  korisnici: "dentifid.app@gmail.com",
  autor: "matijavelickovic100@gmail.com",
  izdavac: "Matija Veličković",
  politikaPrivatnosti:
    "https://tomicadev.github.io/dentifid-legal/privacy-policy.html",
  brisanjeNaloga:
    "https://tomicadev.github.io/dentifid-legal/account-deletion.html",
} as const;
