import stil from "./Prica.module.css";
import Otkrij from "@/components/ui/Otkrij";
import Dugme from "@/components/ui/Dugme";
import { Android } from "@/components/ui/Ikone";
import SijalicaZub from "./SijalicaZub";
import SkicaAplikacije from "./SkicaAplikacije";
import { AUTOR, PRICA } from "@/lib/autor";

/**
 * Priča o autoru kao list iz stomatološkog kartona: jezičak fascikle, rupe
 * za registrator i pečat u uglu. Na listu su tri unosa — biografija
 * sa fotografijom prikačenom spajalicom, ideja sa sijalicom u obliku zuba i
 * uloga u aplikaciji preko providnog nacrta aplikacije.
 */
export default function Prica() {
  return (
    <section id="prica" className={stil.prica}>
      <div className="okvir">
        <article className={stil.karton}>
          <span className={stil.jezicak}>O autoru</span>
          <span className={stil.rupe} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <Pecat />

          <section className={`${stil.unos} ${stil.biografija}`} data-pratilac="95,30" aria-labelledby="prica-biografija">
            <Otkrij className={stil.tekstKolona}>
              <p className={stil.oznaka}>
                <span>01</span>Biografija
              </p>
              <h2 id="prica-biografija" className={stil.naslov}>
                {PRICA.biografija.naslov}
              </h2>
              {PRICA.biografija.pasusi.map((pasus) => (
                <p key={pasus} className={stil.pasus}>
                  {pasus}
                </p>
              ))}
              <ol className={stil.putanja}>
                {PRICA.putanja.map((korak) => (
                  <li key={korak.godina}>
                    <span className={stil.godina}>{korak.godina}</span>
                    <span className={stil.korak}>{korak.opis}</span>
                  </li>
                ))}
              </ol>
            </Otkrij>
            <Otkrij className={stil.fotoMesto} pomeraj={34}>
              <figure className={stil.fotografija}>
                <Spajalica />
                <img src={AUTOR.portret} width={720} height={900} alt={AUTOR.ime} loading="lazy" decoding="async" />
                <figcaption>
                  {AUTOR.ime}
                  <span>{AUTOR.titula}</span>
                </figcaption>
              </figure>
            </Otkrij>
          </section>

          <section className={`${stil.unos} ${stil.ideja}`} data-pratilac="5,32" aria-labelledby="prica-ideja">
            <Otkrij className={stil.ilustracija} pomeraj={30}>
              <SijalicaZub className={stil.sijalica} />
            </Otkrij>
            <Otkrij className={stil.tekstKolona}>
              <p className={stil.oznaka}>
                <span>02</span>Ideja
              </p>
              <h2 id="prica-ideja" className={stil.naslov}>
                {PRICA.ideja.naslov}
              </h2>
              {PRICA.ideja.pasusi.map((pasus) => (
                <p key={pasus} className={stil.pasus}>
                  {pasus}
                </p>
              ))}
            </Otkrij>
          </section>

          <section className={`${stil.unos} ${stil.uloga}`} data-pratilac="95,40" aria-labelledby="prica-uloga">
            <SkicaAplikacije className={stil.skica} />
            <Otkrij className={stil.ulogaTekst}>
              <p className={stil.oznaka}>
                <span>03</span>Uloga
              </p>
              <h2 id="prica-uloga" className={stil.naslov}>
                {PRICA.uloga.naslov}
              </h2>
              <p className={stil.pasus}>{PRICA.uloga.pasus}</p>
              <p className={stil.zavrsnica}>
                <span className="istaknuto">{PRICA.uloga.istaknuto}</span> {PRICA.uloga.ostatak}
              </p>
            </Otkrij>
          </section>

          <div className={stil.radnje}>
            <Dugme href="/#preuzimanje" ikona={<Android />}>
              Preuzmi aplikaciju
            </Dugme>
            <Dugme href="/#kontakt" vrsta="sporedno">
              Pišite autoru
            </Dugme>
          </div>
        </article>
      </div>
    </section>
  );
}

/** Spajalica kojom je fotografija prikačena za karton. */
function Spajalica() {
  return (
    <svg className={stil.spajalica} viewBox="0 0 44 120" aria-hidden="true">
      <defs>
        <linearGradient id="spajalica-metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#95a4ba" />
          <stop offset="0.5" stopColor="#f4f7fb" />
          <stop offset="1" stopColor="#7b8ba3" />
        </linearGradient>
      </defs>
      <path
        d="M13 36 V92 A9 9 0 0 0 31 92 V22 A13 13 0 0 0 5 22 V98 A17 17 0 0 0 39 98 V44"
        fill="none"
        stroke="url(#spajalica-metal)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Pečat u uglu kartona, kao otisak plavog mastila. */
function Pecat() {
  return (
    <svg className={stil.pecat} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <path id="pecat-krug" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="60" cy="60" r="32" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <text fill="currentColor" fontFamily="Inter, system-ui, sans-serif" fontSize="10.5" fontWeight="700">
        <textPath href="#pecat-krug" textLength="268" lengthAdjust="spacing">
          DENTIFID · AUTOR IDEJE · DENTIFID ·
        </textPath>
      </text>
      <path
        d="M56 37 c-10 0 -16 8 -16 18 c0 12 6 28 12 28 c4 0 5 -9 8 -9 s4 9 8 9 c6 0 12 -16 12 -28 c0 -10 -6 -18 -16 -18 c-3 0 -5 2 -8 2 s-5 -2 -8 -2 z"
        fill="currentColor"
      />
    </svg>
  );
}
