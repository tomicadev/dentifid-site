/**
 * Google Analytics 4 (gtag.js), samo uz pristanak posetioca.
 *
 * Pre izbora GA se uopšte ne učitava: nema kolačića ni slanja podataka
 * Google-u. Kad posetilac prihvati, učitava se gtag.js, a saglasnost za
 * analitiku (Consent Mode v2) prelazi u „granted”. Saglasnosti za reklame
 * ostaju odbijene — sajt nema reklame.
 */

/** Merni ID GA4 svojstva „DentifID”. Ranije je ovde stajao Tag Manager
 *  kontejner, koji je slao u strim unutar tuđeg svojstva (Valens). */
export const GA_ID = "G-JQNGFX5WZL";

/** Ključ u localStorage pod kojim se pamti izbor: „da” ili „ne”. */
export const KLJUC_SAGLASNOSTI = "dentifid-saglasnost";

/** Događaj kojim veza u podnožju ponovo otvara traku za pristanak. */
export const DOGADJAJ_PODESAVANJA = "dentifid:podesavanja-kolacica";

/**
 * Izvršava se u <head> pre svega ostalog: postavlja podrazumevanu saglasnost i
 * odmah učitava analitiku ako je posetilac ranije pristao.
 */
export const SKRIPTA_SAGLASNOSTI = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
window.dentifidUcitajAnalitiku = function () {
  if (window.dentifidAnalitika) return;
  window.dentifidAnalitika = true;
  gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
  document.head.appendChild(s);
};
try {
  if (localStorage.getItem('${KLJUC_SAGLASNOSTI}') === 'da') window.dentifidUcitajAnalitiku();
} catch (e) {}
`;

type ProzorSaAnalitikom = Window & {
  gtag?: (...args: unknown[]) => void;
  dentifidUcitajAnalitiku?: () => void;
};

export function procitajIzbor(): "da" | "ne" | null {
  try {
    const izbor = localStorage.getItem(KLJUC_SAGLASNOSTI);
    return izbor === "da" || izbor === "ne" ? izbor : null;
  } catch {
    return null;
  }
}

export function sacuvajIzbor(izbor: "da" | "ne") {
  try {
    localStorage.setItem(KLJUC_SAGLASNOSTI, izbor);
  } catch {
    // privatni prozor ili blokirano skladište: izbor važi do zatvaranja strane
  }
  const prozor = window as ProzorSaAnalitikom;
  if (izbor === "da") {
    prozor.dentifidUcitajAnalitiku?.();
    return;
  }
  // Povučen pristanak: analitika prestaje da meri, a njeni kolačići se brišu.
  prozor.gtag?.("consent", "update", { analytics_storage: "denied" });
  for (const deo of document.cookie.split(";")) {
    const ime = deo.split("=")[0].trim();
    if (ime === "_ga" || ime.startsWith("_ga_")) {
      for (const domen of ["", "; domain=.dentifid.rs", "; domain=dentifid.rs"]) {
        document.cookie = `${ime}=; Max-Age=0; path=/${domen}`;
      }
    }
  }
}
