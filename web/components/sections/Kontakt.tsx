"use client";

import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import stil from "./Kontakt.module.css";
import Otkrij from "@/components/ui/Otkrij";
import { Koverta, Kvacica, Strelica } from "@/components/ui/Ikone";
import { KONTAKT } from "@/lib/izdanje";

/**
 * Kontakt forma za poruku autoru.
 *
 * Sajt nema server, pa poruku šalje servis Web3Forms kada je ključ podešen
 * (`NEXT_PUBLIC_WEB3FORMS_KLJUC` pri građenju). Bez ključa forma otvara
 * program za poštu sa već popunjenom porukom — ništa se ne gubi.
 */

const KLJUC = process.env.NEXT_PUBLIC_WEB3FORMS_KLJUC ?? "";

const TEME = ["Pitanje o aplikaciji", "Predlog", "Prijava greške", "Saradnja"];

type Polja = { ime: string; email: string; tema: string; poruka: string; saglasnost: boolean };
type Greske = Partial<Record<keyof Polja, string>>;
type Stanje = "unos" | "slanje" | "poslato" | "posta" | "greska";

const NAJVISE = 1500;

function proveri(p: Polja): Greske {
  const g: Greske = {};
  if (p.ime.trim().length < 2) g.ime = "Upišite ime i prezime.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email.trim())) g.email = "Upišite ispravnu mejl adresu.";
  if (p.poruka.trim().length < 10) g.poruka = "Poruka treba da ima bar desetak znakova.";
  if (!p.saglasnost) g.saglasnost = "Potrebna je saglasnost da bismo mogli da odgovorimo.";
  return g;
}

export default function Kontakt() {
  const id = useId();
  const [polja, postaviPolja] = useState<Polja>({
    ime: "",
    email: "",
    tema: TEME[0],
    poruka: "",
    saglasnost: false,
  });
  const [dodirnuto, postaviDodirnuto] = useState<Partial<Record<keyof Polja, boolean>>>({});
  const [stanje, postaviStanje] = useState<Stanje>("unos");
  const [zamka, postaviZamku] = useState("");

  const greske = proveri(polja);
  const pokazi = (polje: keyof Polja) => (dodirnuto[polje] ? greske[polje] : undefined);

  const promeni = <K extends keyof Polja>(polje: K, vrednost: Polja[K]) =>
    postaviPolja((p) => ({ ...p, [polje]: vrednost }));

  const posalji = async (dogadjaj: FormEvent) => {
    dogadjaj.preventDefault();
    postaviDodirnuto({ ime: true, email: true, poruka: true, saglasnost: true });
    if (Object.keys(greske).length) return;
    if (zamka) return; // polje koje popunjavaju samo roboti

    const naslov = `DentifID sajt — ${polja.tema}`;

    if (!KLJUC) {
      const telo = `${polja.poruka}\n\n— ${polja.ime} (${polja.email})`;
      window.location.href = `mailto:${KONTAKT.autor}?subject=${encodeURIComponent(naslov)}&body=${encodeURIComponent(telo)}`;
      postaviStanje("posta");
      return;
    }

    postaviStanje("slanje");
    try {
      const odgovor = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: KLJUC,
          subject: naslov,
          from_name: "DentifID sajt",
          name: polja.ime,
          email: polja.email,
          tema: polja.tema,
          message: polja.poruka,
        }),
      });
      const podaci = (await odgovor.json()) as { success?: boolean };
      postaviStanje(podaci.success ? "poslato" : "greska");
    } catch {
      postaviStanje("greska");
    }
  };

  const ispocetka = () => {
    postaviPolja({ ime: "", email: "", tema: TEME[0], poruka: "", saglasnost: false });
    postaviDodirnuto({});
    postaviStanje("unos");
  };

  return (
    <section className="sekcija" id="kontakt" data-pratilac="4.5,44">
      <div className="okvir">
        <Otkrij>
          <div className={stil.kartica}>
            <div className={stil.uvodKolona}>
              <p className="nadnaslov">Kontakt</p>
              <h2>
                Pišite <span className="istaknuto">autoru</span>
              </h2>
              <p className={`uvod ${stil.tekst}`}>
                Imate pitanje o aplikaciji, predlog ili ste primetili nešto što ne radi kako
                treba? Pišite direktno — svaka poruka pomaže da DentifID bude bolji.
              </p>

              <ul className={stil.kanali}>
                <li>
                  <span className={stil.kanalZnak} aria-hidden="true">
                    <Koverta />
                  </span>
                  <span>
                    <span className={stil.kanalNaziv}>Autor i developer</span>
                    <a href={`mailto:${KONTAKT.autor}`}>{KONTAKT.autor}</a>
                  </span>
                </li>
                <li>
                  <span className={stil.kanalZnak} aria-hidden="true">
                    <Koverta />
                  </span>
                  <span>
                    <span className={stil.kanalNaziv}>Korisnička podrška</span>
                    <a href={`mailto:${KONTAKT.korisnici}`}>{KONTAKT.korisnici}</a>
                  </span>
                </li>
              </ul>
            </div>

            <div className={stil.formaMesto}>
              <AnimatePresence mode="wait">
                {stanje === "poslato" || stanje === "posta" ? (
                  <motion.div
                    key="gotovo"
                    className={stil.gotovo}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    role="status"
                  >
                    <span className={stil.gotovoZnak} aria-hidden="true">
                      <Kvacica />
                    </span>
                    <h3>{stanje === "poslato" ? "Hvala, poruka je poslata!" : "Poruka je spremna"}</h3>
                    <p>
                      {stanje === "poslato"
                        ? "Stigla je autoru aplikacije. Odgovor će doći na adresu koju ste upisali."
                        : "Otvoren je vaš program za poštu sa već upisanom porukom — ostaje samo da je pošaljete."}
                    </p>
                    <button type="button" className={stil.sporedno} onClick={ispocetka}>
                      Nova poruka
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="forma"
                    className={stil.forma}
                    onSubmit={posalji}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={stil.red2}>
                      <Polje
                        id={`${id}-ime`}
                        oznaka="Ime i prezime"
                        greska={pokazi("ime")}
                      >
                        <input
                          id={`${id}-ime`}
                          type="text"
                          autoComplete="name"
                          placeholder=" "
                          value={polja.ime}
                          onChange={(e) => promeni("ime", e.target.value)}
                          onBlur={() => postaviDodirnuto((d) => ({ ...d, ime: true }))}
                          aria-invalid={!!pokazi("ime")}
                          aria-describedby={pokazi("ime") ? `${id}-ime-g` : undefined}
                        />
                      </Polje>
                      <Polje
                        id={`${id}-email`}
                        oznaka="Mejl adresa"
                        greska={pokazi("email")}
                      >
                        <input
                          id={`${id}-email`}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder=" "
                          value={polja.email}
                          onChange={(e) => promeni("email", e.target.value)}
                          onBlur={() => postaviDodirnuto((d) => ({ ...d, email: true }))}
                          aria-invalid={!!pokazi("email")}
                          aria-describedby={pokazi("email") ? `${id}-email-g` : undefined}
                        />
                      </Polje>
                    </div>

                    <fieldset className={stil.teme}>
                      <legend>Tema</legend>
                      <div className={stil.pilule}>
                        {TEME.map((tema) => (
                          <label
                            key={tema}
                            className={`${stil.pilula} ${polja.tema === tema ? stil.pilulaIzabrana : ""}`}
                          >
                            <input
                              type="radio"
                              name={`${id}-tema`}
                              value={tema}
                              checked={polja.tema === tema}
                              onChange={() => promeni("tema", tema)}
                            />
                            {tema}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <Polje id={`${id}-poruka`} oznaka="Vaša poruka" greska={pokazi("poruka")} visoko>
                      <textarea
                        id={`${id}-poruka`}
                        rows={5}
                        placeholder=" "
                        maxLength={NAJVISE}
                        value={polja.poruka}
                        onChange={(e) => promeni("poruka", e.target.value)}
                        onBlur={() => postaviDodirnuto((d) => ({ ...d, poruka: true }))}
                        aria-invalid={!!pokazi("poruka")}
                        aria-describedby={`${id}-poruka-brojac${pokazi("poruka") ? ` ${id}-poruka-g` : ""}`}
                      />
                      <span className={stil.brojac} id={`${id}-poruka-brojac`}>
                        {polja.poruka.length} / {NAJVISE}
                      </span>
                    </Polje>

                    {/* Zamka za robote: ljudi je ne vide, pa je ne popunjavaju. */}
                    <input
                      className={stil.zamka}
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      value={zamka}
                      onChange={(e) => postaviZamku(e.target.value)}
                    />

                    <label className={stil.saglasnost}>
                      <input
                        type="checkbox"
                        checked={polja.saglasnost}
                        onChange={(e) => promeni("saglasnost", e.target.checked)}
                        onBlur={() => postaviDodirnuto((d) => ({ ...d, saglasnost: true }))}
                        aria-invalid={!!pokazi("saglasnost")}
                      />
                      <span className={stil.kvadrat} aria-hidden="true">
                        <Kvacica />
                      </span>
                      <span>
                        Slažem se da se moje ime i mejl koriste samo za odgovor na ovu poruku.
                      </span>
                    </label>
                    {pokazi("saglasnost") ? (
                      <p className={stil.greska} role="alert">
                        {pokazi("saglasnost")}
                      </p>
                    ) : null}

                    {stanje === "greska" ? (
                      <p className={stil.greskaSlanja} role="alert">
                        Slanje nije uspelo. Pokušajte ponovo ili pišite direktno na{" "}
                        <a href={`mailto:${KONTAKT.autor}`}>{KONTAKT.autor}</a>.
                      </p>
                    ) : null}

                    <button className={stil.posalji} type="submit" disabled={stanje === "slanje"}>
                      {stanje === "slanje" ? (
                        <>
                          <span className={stil.vrteska} aria-hidden="true" />
                          Šaljem…
                        </>
                      ) : (
                        <>
                          Pošalji poruku
                          <Strelica />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Otkrij>
      </div>
    </section>
  );
}

function Polje({
  id,
  oznaka,
  greska,
  visoko,
  children,
}: {
  id: string;
  oznaka: string;
  greska?: string;
  visoko?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${stil.polje} ${visoko ? stil.visoko : ""} ${greska ? stil.pogresno : ""}`}>
      {children}
      <label htmlFor={id}>{oznaka}</label>
      {greska ? (
        <p className={stil.greska} id={`${id}-g`} role="alert">
          {greska}
        </p>
      ) : null}
    </div>
  );
}
