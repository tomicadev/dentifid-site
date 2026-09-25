# DentifID — promo sajt

Sajt koji predstavlja Android aplikaciju DentifID i nudi je na preuzimanje.
Next.js sa statičnim izvozom, bez servera i bez prikupljanja podataka o
posetiocima.

```
web/                   sajt (Next.js, React, TypeScript)
  app/                 strane: početna, o-autoru, 404, robots, sitemap
  components/
    layout/            zaglavlje (četkica), podnožje, meko skrolovanje
    hero/              hero sa telefonom
    sections/          sekcije početne strane
    pratilac/          3D zub koji prati posetioca kroz stranu
    three/             providan 3D zub (hologram)
    ui/                dugme, znaci, telefon, četkica, otkrivanje na skrol
  lib/                 geometrija vilice, podaci o zubima, podaci o izdanju
  public/              pismo, snimci u .webp, QR, logotip, ikone
sajt-staro/            prva, čisto statična verzija sajta (rezerva)
alati/                 skripte za pismo, vilicu, QR, snimke i kontrast
materijal/             izvorni brief i snimci (ne objavljuje se)
docs/superpowers/      specifikacija i plan prve verzije
```

## Tehnika

| Sloj | Izbor |
|---|---|
| Okvir | Next.js 16, App Router, `output: "export"` |
| Jezik | TypeScript, React 19 |
| Stilovi | CSS moduli i promenljive na `:root`, bez Tailwind-a |
| 3D | Three.js preko `@react-three/fiber` i `@react-three/drei` |
| Animacije | GSAP + ScrollTrigger, Motion (Framer Motion), Lenis za meko skrolovanje |
| Pismo | Inter, lokalno, jedan promenljivi `woff2` sa latin-ext |

3D scene se učitavaju tek u pregledaču (`next/dynamic`, `ssr: false`), pa
početno učitavanje ne čeka na WebGL.

## Razvoj

```bash
cd web
npm install --legacy-peer-deps
npm run dev
```

`--legacy-peer-deps` je potreban zbog neobaveznog `expo` peer-a u
`@react-three/fiber`, koji ovaj projekat ne koristi.

Provera tipova: `npm run typecheck`. Građenje: `npm run build` (izlaz u
`web/out`).

## Objavljivanje

GitHub Pages, preko `.github/workflows/pages.yml`: radnja gradi `web/` i
objavljuje samo `web/out`. Svako slanje na `main` pokreće novo objavljivanje.

Podešavanje, jednom:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Pages → Custom domain:** `dentifid.rs`. Kad GitHub izda
   sertifikat, uključiti **Enforce HTTPS**. Fajl `CNAME` nije potreban — kod
   objavljivanja preko radnje GitHub ga zanemaruje.
3. **DNS kod Loopie** (isto kao za valens.rs):

   | Tip | Ime | Vrednost |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | tomicadev.github.io |

   A zapisi koje je Loopia postavila sama (194.9.94.85 i 194.9.94.86) se brišu.

QR kod u `web/public/img/qr.png` vodi na `https://dentifid.rs/#preuzimanje`.
Ako se adresa ikad promeni, novi se pravi sa
`python alati/napravi-qr.py <adresa>`; `metadataBase` u `web/app/layout.tsx`,
`robots.ts` i `sitemap.ts` tada treba uskladiti sa njom.

## Kad izađe nova verzija aplikacije

Dugme vodi na stalnu adresu `releases/latest/download/dentifid.apk`, pa se
adresa i QR ne menjaju. Menja se samo `web/lib/izdanje.ts`: broj verzije,
veličina i najstariji podržani Android.

## Alati

| Skripta | Šta radi |
|---|---|
| `alati/napravi-pismo.py` | podskup pisma Inter (latinica + latin-ext) u jedan promenljivi `woff2` |
| `alati/napravi-vilicu.py` | crta vilicu za staru, statičnu verziju sajta |
| `alati/napravi-qr.py` | pravi QR kod za zadatu adresu |
| `alati/napravi-snimke.py` | pretvara snimke iz `materijal/snimci/` u `.webp` |
| `alati/kontrast.py` | meri odnos kontrasta za parove boja |

Vilica na novom sajtu se ne generiše skriptom nego se računa u
`web/lib/vilica.ts`, pri građenju strane.

## Kontakt forma

Sajt nema server, pa formu šalje servis [Web3Forms](https://web3forms.com).
Ključ je podešen 25.09.2026. i poruke stižu na mejl za koji je napravljen. Bez
ključa (npr. u lokalnom radu) forma otvara program za poštu sa već popunjenom
porukom, tako da radi i bez njega.

1. Na web3forms.com upisati adresu na koju poruke treba da stižu
   (`matijavelickovic100@gmail.com`) i potvrditi mejl — stiže ključ.
2. U repou: **Settings → Secrets and variables → Actions → Variables**,
   dodati promenljivu `WEB3FORMS_KLJUC` sa tim ključem.
3. Sledeće objavljivanje ga ugrađuje u sajt. Za lokalni rad ključ ide u
   `web/.env.local` kao `NEXT_PUBLIC_WEB3FORMS_KLJUC=...`.

Ključ je po prirodi javan (stoji u kodu strane), pa ga nije potrebno čuvati
kao tajnu. Mejl pošiljaoca Web3Forms sam postavlja kao adresu za odgovor.

Politika privatnosti (repo `dentifid-legal`) od 25.09.2026. ima pasus o formi:
Web3Forms ne čuva sadržaj poruka, samo ih prosleđuje na mejl; serveri su u
SAD, a poruke se u sandučetu čuvaju najduže 7 dana posle prepiske. Ako se pojavi spam, Web3Forms besplatno nudi hCaptcha (deljeni ključ,
uključuje se u njihovoj kontrolnoj tabli).

## Šta još čeka

1. **Tekstovi na strani O autoru** — biografija, odakle ideja i uloga u
   aplikaciji. Ime i fotografija su objavljeni uz saglasnost stomatologa.
2. **iPhone** — dugme stoji kao „Uskoro za iPhone” i isključeno je dok
   aplikacija ne izađe za iOS; iOS verzija je u izradi.
