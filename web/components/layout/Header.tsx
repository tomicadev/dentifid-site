"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import stil from "./Header.module.css";

/**
 * Zaglavlje u obliku četkice za zube.
 *
 * Levo je deblji deo drške sa logom na gumenom umetku, u sredini tanak vrat
 * sa vezama, a desno glava sa čekinjama i pastom — pasta je dugme „Preuzmi".
 *
 * Drška je od providne, matirane plastike: kroz nju se nazire zamućena strana,
 * ivice su obojene kao kod prave providne četkice, a odsjaji odozgo i odozdo
 * daju oblinu. Silueta se računa iz stvarne širine, pa se krajevi nikad ne
 * razvlače. Slojevi sa odsjajima se crtaju jednom; na skrol se menjaju samo
 * boja ivica i položaj odsjaja koji klizi duž drške.
 *
 * Na telefonu je četkica niža i u jednom redu, a veze se otvaraju iz dugmeta
 * na vratu četkice.
 */

type Geometrija = {
  W: number;
  H: number;
  y0: number;
  bw: number;
  hb: number;
  tl: number;
  hn: number;
  hw: number;
  hh: number;
  cekinje: number;
  pastaH: number;
  kompaktno: boolean;
};

const VEZE = [
  { href: "/#aplikacija", tekst: "Aplikacija", opis: "Kako izgleda i šta nudi" },
  { href: "/o-autoru", tekst: "O autoru", opis: "Stomatolog koji je došao na ideju" },
];

// Boje ivica drške od vrha do dna strane. Tekst stoji na matiranoj sredini,
// pa boja ne utiče na njegovu čitljivost.
const BOJE = ["#1a6ff0", "#0a9fd8", "#4f67f0", "#1a6ff0"];

function uRgb(h: string) {
  const s = h.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}

function bojaZa(deo: number) {
  const n = BOJE.length - 1;
  const t = Math.min(Math.max(deo, 0), 1) * n;
  const i = Math.min(Math.floor(t), n - 1);
  const a = uRgb(BOJE[i]);
  const b = uRgb(BOJE[i + 1]);
  const k = t - i;
  return a.map((v, j) => Math.round(v + (b[j] - v) * k));
}

function geometrija(W: number): Geometrija {
  const kompaktno = W < 640;
  if (kompaktno) {
    // na telefonu: jedan red, niža drška; na najužim ekranima kraća i glava
    const bw = Math.min(116, Math.round(W * 0.33));
    const hw = Math.min(128, Math.round(W * 0.37));
    return { W, H: 62, y0: 41, bw, hb: 34, tl: 16, hn: 16, hw, hh: 24, cekinje: 10, pastaH: 30, kompaktno };
  }
  // Na srednjim širinama drška i glava su malo kraće, da veze stanu u vrat.
  const usko = W < 900;
  return {
    W,
    H: 100,
    y0: 72,
    bw: usko ? 172 : 200,
    hb: 54,
    tl: 44,
    hn: 32,
    hw: usko ? 196 : 214,
    hh: 36,
    cekinje: 18,
    pastaH: 44,
    kompaktno,
  };
}

function putanjaTela(g: Geometrija) {
  const { W, y0, bw, hb, tl, hn, hw, hh } = g;
  const rb = hb / 2;
  const rh = hh / 2;
  const vratPocetak = bw + tl;
  const glavaPocetak = W - hw;
  const vratKraj = glavaPocetak - tl;
  const f = (n: number) => n.toFixed(1);
  const gore = (h: number) => f(y0 - h / 2);
  const dole = (h: number) => f(y0 + h / 2);

  // Drška je na sredini malo deblja, kao da je oblikovana za šaku.
  const trbuh = g.kompaktno ? 1.2 : 1.8;
  const kraj = bw - 6;
  const sredina = (rb + kraj) / 2;
  const korak = (kraj - rb) * 0.22;
  const goreT = f(y0 - hb / 2 - trbuh);
  const doleT = f(y0 + hb / 2 + trbuh);

  return [
    `M${rb},${gore(hb)}`,
    `C${f(rb + korak)},${gore(hb)} ${f(sredina - korak)},${goreT} ${f(sredina)},${goreT}`,
    `C${f(sredina + korak)},${goreT} ${f(kraj - korak)},${gore(hb)} ${kraj},${gore(hb)}`,
    `C${bw + tl * 0.45},${gore(hb)} ${vratPocetak - tl * 0.45},${gore(hn)} ${vratPocetak},${gore(hn)}`,
    `L${vratKraj},${gore(hn)}`,
    `C${vratKraj + tl * 0.5},${gore(hn)} ${glavaPocetak - tl * 0.35},${gore(hh)} ${glavaPocetak + 4},${gore(hh)}`,
    `L${W - rh},${gore(hh)}`,
    `A${rh},${rh} 0 0 1 ${W - rh},${dole(hh)}`,
    `L${glavaPocetak + 4},${dole(hh)}`,
    `C${glavaPocetak - tl * 0.35},${dole(hh)} ${vratKraj + tl * 0.5},${dole(hn)} ${vratKraj},${dole(hn)}`,
    `L${vratPocetak},${dole(hn)}`,
    `C${vratPocetak - tl * 0.45},${dole(hn)} ${bw + tl * 0.45},${dole(hb)} ${kraj},${dole(hb)}`,
    `C${f(kraj - korak)},${dole(hb)} ${f(sredina + korak)},${doleT} ${f(sredina)},${doleT}`,
    `C${f(sredina - korak)},${doleT} ${f(rb + korak)},${dole(hb)} ${rb},${dole(hb)}`,
    `A${rb},${rb} 0 0 1 ${rb},${gore(hb)}`,
    "Z",
  ].join(" ");
}

/** Čuperci čekinja na glavi; visine se malo razlikuju, kao na pravoj četkici. */
function cuperci(g: Geometrija) {
  const { W, y0, hw, hh, cekinje } = g;
  const pocetak = W - hw + (g.kompaktno ? 12 : 18);
  const kraj = W - hh / 2 - (g.kompaktno ? 4 : 6);
  const sirina = g.kompaktno ? 8 : 10;
  const razmak = g.kompaktno ? 3.2 : 4;
  const broj = Math.max(3, Math.floor((kraj - pocetak + razmak) / (sirina + razmak)));
  const vrh = y0 - hh / 2;
  return Array.from({ length: broj }, (_, i) => {
    const x = pocetak + i * (sirina + razmak);
    const visina = cekinje - ((i * 7) % 3) * 1.1;
    return { x, y: vrh - visina, sirina, visina: visina + 4, svetao: i % 2 === 0 };
  });
}

export default function Header() {
  const okvir = useRef<HTMLDivElement>(null);
  const sjaj = useRef<HTMLDivElement>(null);
  const [W, postaviW] = useState(960);
  const [naKraju, postaviNaKraju] = useState(false);
  const putanja = (usePathname() ?? "/").replace(/(.)\/$/, "$1");

  // Aktivna veza: „O autoru" na svojoj strani, „Aplikacija" dok je njena
  // sekcija na ekranu. Na njoj miruje staklena pilula.
  const [uSekciji, postaviUSekciji] = useState(false);
  const aktivna = putanja === "/o-autoru" ? 1 : putanja === "/" && uSekciji ? 0 : -1;
  const [pokazana, postaviPokazanu] = useState<number | null>(null);
  const vezeRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pilula, postaviPilulu] = useState({ x: 0, w: 0, vidljiva: false, skok: true });
  const [meni, postaviMeni] = useState(false);
  const meniRef = useRef<HTMLElement>(null);
  const dugmeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = okvir.current;
    if (!element) return;
    const posmatrac = new ResizeObserver(([unos]) => {
      postaviW(Math.round(unos.contentRect.width));
    });
    posmatrac.observe(element);
    return () => posmatrac.disconnect();
  }, []);

  useEffect(() => {
    let kadar = 0;
    let misX: number | null = null;
    let poslednja = [-1, -1, -1];

    const osvezi = () => {
      kadar = 0;
      const element = okvir.current;
      if (!element) return;
      const visina = document.documentElement.scrollHeight - window.innerHeight;
      const deo = visina > 0 ? Math.min(Math.max(window.scrollY / visina, 0), 1) : 0;

      // Boja se upisuje tek kad se primetno promeni, pa se ivice retko prefarbavaju.
      const boja = bojaZa(deo);
      if (boja.some((v, i) => Math.abs(v - poslednja[i]) >= 3)) {
        poslednja = boja;
        element.style.setProperty("--boja", `rgb(${boja.join(" ")})`);
      }

      // Odsjaj prati miša iznad četkice; inače klizi duž drške kako strana odmiče.
      const x = misX ?? element.clientWidth * (0.22 + deo * 0.7);
      if (sjaj.current) sjaj.current.style.transform = `translate3d(${Math.round(x)}px, 0, 0)`;

      postaviNaKraju(deo > 0.985);
    };
    const zakazi = () => {
      if (!kadar) kadar = requestAnimationFrame(osvezi);
    };

    const naMis = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const element = okvir.current;
      if (!element) return;
      const r = element.getBoundingClientRect();
      const iznad = e.clientY <= r.bottom + 12 && e.clientX >= r.left && e.clientX <= r.right;
      const novo = iznad ? e.clientX - r.left : null;
      if (novo !== misX) {
        misX = novo;
        zakazi();
      }
    };
    const naIzlaz = () => {
      if (misX === null) return;
      misX = null;
      zakazi();
    };

    osvezi();
    window.addEventListener("scroll", zakazi, { passive: true });
    window.addEventListener("resize", zakazi);
    window.addEventListener("pointermove", naMis, { passive: true });
    document.documentElement.addEventListener("pointerleave", naIzlaz);
    return () => {
      cancelAnimationFrame(kadar);
      window.removeEventListener("scroll", zakazi);
      window.removeEventListener("resize", zakazi);
      window.removeEventListener("pointermove", naMis);
      document.documentElement.removeEventListener("pointerleave", naIzlaz);
    };
  }, []);

  useEffect(() => {
    if (putanja !== "/") return;
    const sekcija = document.getElementById("aplikacija");
    if (!sekcija) return;
    const posmatrac = new IntersectionObserver(([unos]) => postaviUSekciji(unos.isIntersecting), {
      rootMargin: "-45% 0px -45% 0px",
    });
    posmatrac.observe(sekcija);
    return () => {
      posmatrac.disconnect();
      postaviUSekciji(false);
    };
  }, [putanja]);

  // Pilula ide na vezu nad kojom je miš (ili fokus), a inače na aktivnu vezu.
  const cilj = pokazana ?? (aktivna >= 0 ? aktivna : null);
  useEffect(() => {
    const veza = cilj === null ? null : vezeRef.current[cilj];
    if (!veza) {
      postaviPilulu((p) => ({ ...p, vidljiva: false }));
      return;
    }
    postaviPilulu((p) => ({ x: veza.offsetLeft, w: veza.offsetWidth, vidljiva: true, skok: !p.vidljiva }));
  }, [cilj, W]);
  useEffect(() => {
    if (!pilula.skok || !pilula.vidljiva) return;
    const id = requestAnimationFrame(() => postaviPilulu((p) => ({ ...p, skok: false })));
    return () => cancelAnimationFrame(id);
  }, [pilula.skok, pilula.vidljiva]);

  // Meni na telefonu se zatvara promenom strane, tasterom Esc i dodirom van njega.
  useEffect(() => postaviMeni(false), [putanja]);
  useEffect(() => {
    if (!meni) return;
    const naTaster = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      postaviMeni(false);
      dugmeRef.current?.focus();
    };
    const naDodir = (e: PointerEvent) => {
      const meta = e.target as Node;
      if (meniRef.current?.contains(meta) || dugmeRef.current?.contains(meta)) return;
      postaviMeni(false);
    };
    document.addEventListener("keydown", naTaster);
    document.addEventListener("pointerdown", naDodir);
    return () => {
      document.removeEventListener("keydown", naTaster);
      document.removeEventListener("pointerdown", naDodir);
    };
  }, [meni]);

  const g = useMemo(() => geometrija(W), [W]);
  const telo = useMemo(() => putanjaTela(g), [g]);
  const cekinje = useMemo(() => cuperci(g), [g]);

  const k = g.kompaktno;
  const pogled = `0 0 ${g.W} ${g.H}`;
  const glavaPocetak = g.W - g.hw;
  const vratPocetak = g.bw + g.tl;
  const vratKraj = glavaPocetak - g.tl;
  const pastaVrh = g.y0 - g.hh / 2 - g.cekinje - g.pastaH + 9;

  // Veze staju u vrat tek kad je dovoljno dug; inače stoje iznad drške.
  // Na telefonu su u meniju koji se otvara dugmetom na vratu.
  const vezeUVratu = !k && vratKraj - vratPocetak > 250;
  const unutrasnjiUmetak = k ? 10 : 14;

  return (
    <header className={stil.traka}>
      <div
        ref={okvir}
        className={`${stil.cetkica} ${k ? stil.kompaktno : ""} ${naKraju ? stil.naKraju : ""}`}
        style={{ height: g.H }}
      >
        {/* senka i čekinje, iza providnog tela */}
        <svg
          className={`${stil.telo} ${stil.staticno}`}
          width={g.W}
          height={g.H}
          viewBox={pogled}
          aria-hidden="true"
        >
          <defs>
            <clipPath id="cetkica-obris">
              <path d={telo} />
            </clipPath>
            <filter id="cetkica-senka" x="-5%" y="-60%" width="110%" height="240%">
              <feGaussianBlur stdDeviation={k ? 4 : 8} />
            </filter>
            <filter id="cetkica-senka-blizu" x="-5%" y="-60%" width="110%" height="240%">
              <feGaussianBlur stdDeviation={k ? 1.8 : 2.5} />
            </filter>
            {/* Kroz providnu dršku senka se vidi samo slabo. */}
            <mask
              id="cetkica-van"
              maskUnits="userSpaceOnUse"
              x="-20"
              y="-20"
              width={g.W + 40}
              height={g.H + 60}
            >
              <rect x="-20" y="-20" width={g.W + 40} height={g.H + 60} fill="#fff" />
              <path d={telo} fill="#4d4d4d" />
            </mask>
            <linearGradient id="cekinja-bela" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#d6e8fb" />
            </linearGradient>
            <linearGradient id="cekinja-plava" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c9f1ff" />
              <stop offset="1" stopColor="#6cc4f2" />
            </linearGradient>
          </defs>

          <g mask="url(#cetkica-van)">
            <path
              d={telo}
              className={stil.senka}
              filter="url(#cetkica-senka)"
              transform={`translate(0 ${k ? 5 : 11})`}
            />
            <path
              d={telo}
              className={stil.senkaBlizu}
              filter="url(#cetkica-senka-blizu)"
              transform={`translate(0 ${k ? 2 : 4})`}
            />
          </g>

          {/* čekinje idu iza glave, pa izgledaju kao da izlaze iz nje */}
          <g className={stil.cekinje}>
            {cekinje.map((c) => (
              <rect
                key={c.x}
                x={c.x}
                y={c.y}
                width={c.sirina}
                height={c.visina}
                rx={c.sirina / 2}
                fill={c.svetao ? "url(#cekinja-bela)" : "url(#cekinja-plava)"}
              />
            ))}
          </g>
        </svg>

        {/* Providno telo: matira stranu iza sebe, a odsjaj u njemu klizi. */}
        <div
          className={stil.staklo}
          style={
            {
              width: g.W,
              height: g.H,
              clipPath: `path("${telo}")`,
              "--sredina": `${g.y0}px`,
              "--visina-sjaja": `${k ? 7 : 9}px`,
            } as CSSProperties
          }
        >
          <div ref={sjaj} className={stil.sjaj} />
        </div>

        {/* Boja ivica je u zasebnom, lakom sloju: na skrol se prefarbava samo on. */}
        <svg className={stil.telo} width={g.W} height={g.H} viewBox={pogled} aria-hidden="true">
          <defs>
            <linearGradient
              id="cetkica-ton"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={g.y0 - g.hb / 2}
              x2="0"
              y2={g.y0 + g.hb / 2}
            >
              <stop offset="0" style={{ stopColor: "var(--boja)", stopOpacity: 0.04 }} />
              <stop offset="0.5" style={{ stopColor: "var(--boja)", stopOpacity: 0.03 }} />
              <stop offset="1" style={{ stopColor: "var(--boja)", stopOpacity: 0.3 }} />
            </linearGradient>
            <filter id="cetkica-meko" x="-2%" y="-40%" width="104%" height="180%">
              <feGaussianBlur stdDeviation={k ? 2.4 : 3.2} />
            </filter>
            {/* Boja je jača uz donju ivicu, gde je svetlo prešlo najduži put
                kroz plastiku; gore je ivica skoro bela od odsjaja. */}
            <linearGradient
              id="cetkica-ton-maska-prelaz"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={g.y0 - g.hb / 2}
              x2="0"
              y2={g.y0 + g.hb / 2}
            >
              <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <mask id="cetkica-ton-maska" maskUnits="userSpaceOnUse" x="0" y="0" width={g.W} height={g.H}>
              <rect width={g.W} height={g.H} fill="url(#cetkica-ton-maska-prelaz)" />
            </mask>
          </defs>
          <g clipPath="url(#cetkica-obris)">
            <path d={telo} fill="url(#cetkica-ton)" />
            <path
              d={telo}
              className={stil.tonIvica}
              filter="url(#cetkica-meko)"
              mask="url(#cetkica-ton-maska)"
            />
          </g>

          {/* sitna rebra za palac na prelazu drške u vrat */}
          <g className={stil.rebra}>
            {(k ? [] : [0, 1, 2]).map((i) => {
              const x = vratPocetak + 10 + i * (k ? 6 : 8);
              return (
                <g key={i}>
                  <rect className={stil.rez} x={x} y={g.y0 - g.hn / 2 + 6} width="1.6" height={g.hn - 12} rx="0.8" />
                  <rect className={stil.rezSvetlo} x={x + 1.6} y={g.y0 - g.hn / 2 + 6} width="1.2" height={g.hn - 12} rx="0.6" />
                </g>
              );
            })}
          </g>
        </svg>

        {/* Odsjaji: zamućen oblik je mapa visine, pa svetlo prati oblinu svakog
            dela drške. Odozgo pada oštar beli odsjaj, a uz donju ivicu svetli
            svetlo koje je prošlo kroz providnu plastiku. */}
        <svg
          className={`${stil.telo} ${stil.staticno}`}
          width={g.W}
          height={g.H}
          viewBox={pogled}
          aria-hidden="true"
        >
          <defs>
            <filter
              id="cetkica-sjaj"
              x="-2%"
              y="-40%"
              width="104%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation={k ? 4.5 : 6.5} result="telo" />
              <feGaussianBlur in="SourceAlpha" stdDeviation={k ? 3 : 4} result="oblo" />
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="ivica" />

              {/* oblina: strana okrenuta od svetla, donja, tone u blagu senku */}
              <feDiffuseLighting
                in="telo"
                surfaceScale={k ? 5 : 7}
                diffuseConstant="1"
                lightingColor="#ffffff"
                result="osvetljenje"
              >
                <feDistantLight azimuth="258" elevation="50" />
              </feDiffuseLighting>
              <feColorMatrix
                in="osvetljenje"
                type="matrix"
                values="0 0 0 0 0.04  0 0 0 0 0.16  0 0 0 0 0.42  -0.9 0 0 0 0.69"
                result="senkaOblika"
              />

              <feSpecularLighting
                in="oblo"
                surfaceScale={k ? 4 : 5}
                specularConstant="1.3"
                specularExponent="50"
                lightingColor="#ffffff"
                result="gore"
              >
                <feDistantLight azimuth="258" elevation="50" />
              </feSpecularLighting>
              <feSpecularLighting
                in="ivica"
                surfaceScale="2.2"
                specularConstant="1.25"
                specularExponent="40"
                lightingColor="#ffffff"
                result="goreTanko"
              >
                <feDistantLight azimuth="258" elevation="35" />
              </feSpecularLighting>
              {/* svetlo koje prođe kroz plastiku zasvetli tik uz donju ivicu */}
              <feSpecularLighting
                in="ivica"
                surfaceScale="2.2"
                specularConstant="0.9"
                specularExponent="40"
                lightingColor="#e6f3ff"
                result="doleTanko"
              >
                <feDistantLight azimuth="90" elevation="35" />
              </feSpecularLighting>
              <feMerge result="svetla">
                <feMergeNode in="senkaOblika" />
                <feMergeNode in="doleTanko" />
                <feMergeNode in="gore" />
                <feMergeNode in="goreTanko" />
              </feMerge>
              <feComposite in="svetla" in2="SourceAlpha" operator="in" />
            </filter>
          </defs>
          <path d={telo} fill="#000" filter="url(#cetkica-sjaj)" />
        </svg>

        {/* gumeni umetak sa logom na debljem delu drške */}
        <Link
          href="/"
          className={stil.guma}
          aria-label="DentifID, početna strana"
          style={{
            left: k ? 9 : 12,
            top: g.y0 - (g.hb - unutrasnjiUmetak) / 2,
            width: g.bw - (k ? 26 : 34),
            height: g.hb - unutrasnjiUmetak,
          }}
        >
          <img src="/svg/logo.svg" width={284} height={97} alt="DentifID" />
        </Link>

        {k ? (
          <>
            <button
              ref={dugmeRef}
              type="button"
              className={`${stil.meniDugme} ${meni ? stil.meniOtvoren : ""}`}
              aria-label={meni ? "Zatvori meni" : "Otvori meni"}
              aria-expanded={meni}
              aria-controls="meni-telefon"
              onClick={() => postaviMeni((m) => !m)}
              style={{ left: vratPocetak + (vratKraj - vratPocetak) / 2 - 16, top: g.y0 - 16 }}
            >
              <span />
              <span />
            </button>
            <AnimatePresence>
              {meni ? (
                <motion.nav
                  ref={meniRef}
                  id="meni-telefon"
                  className={stil.meni}
                  aria-label="Glavna navigacija"
                  style={{ top: g.H + 8 }}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {VEZE.map((veza, i) => (
                    <Link
                      key={veza.href}
                      href={veza.href}
                      className={stil.meniVeza}
                      data-aktivna={aktivna === i}
                      aria-current={putanja === veza.href ? "page" : undefined}
                      onClick={() => postaviMeni(false)}
                    >
                      <span className={stil.meniZnak} aria-hidden="true">
                        {i === 0 ? <ZnakTelefona /> : <ZnakKartice />}
                      </span>
                      <span className={stil.meniTekst}>
                        {veza.tekst}
                        <small>{veza.opis}</small>
                      </span>
                      <svg className={stil.meniStrelica} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </Link>
                  ))}
                </motion.nav>
              ) : null}
            </AnimatePresence>
          </>
        ) : (
          <nav
            className={`${stil.veze} ${vezeUVratu ? "" : stil.vezeIznad}`}
            aria-label="Glavna navigacija"
            onPointerLeave={() => postaviPokazanu(null)}
            style={
              vezeUVratu
                ? {
                    left: vratPocetak + 34,
                    width: vratKraj - vratPocetak - 40,
                    top: g.y0 - g.hn / 2 + 3,
                    height: g.hn - 6,
                  }
                : { left: 8, top: 8, height: 30 }
            }
          >
            <span
              className={`${stil.pilula} ${pilula.skok ? stil.pilulaSkok : ""}`}
              aria-hidden="true"
              style={{
                width: pilula.w,
                transform: `translateX(${pilula.x}px)`,
                opacity: pilula.vidljiva ? 1 : 0,
              }}
            />
            {VEZE.map((veza, i) => (
              <Link
                key={veza.href}
                ref={(el) => {
                  vezeRef.current[i] = el;
                }}
                href={veza.href}
                className={stil.veza}
                data-istaknuta={cilj === i}
                aria-current={putanja === veza.href ? "page" : undefined}
                onPointerEnter={() => postaviPokazanu(i)}
                onFocus={() => postaviPokazanu(i)}
                onBlur={() => postaviPokazanu(null)}
              >
                {veza.tekst}
              </Link>
            ))}
          </nav>
        )}

        {/* pasta na čekinjama je dugme za preuzimanje */}
        <a
          href="/#preuzimanje"
          className={stil.pasta}
          style={{
            left: glavaPocetak + (k ? 6 : 10),
            top: pastaVrh,
            width: g.hw - (k ? 18 : 26),
            height: g.pastaH,
          }}
        >
          <svg className={stil.pastaOblik} viewBox="0 0 180 48" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="pasta-telo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.65" stopColor="#f3f8ff" />
                <stop offset="1" stopColor="#d5e7fb" />
              </linearGradient>
            </defs>
            {/* istisnuta pasta: talasast vrh od „nabora" i uvijen kraj desno */}
            <path
              className={stil.pastaTelo}
              d="M13 45 C5 45 2 38 3 31 C4 24 9 20 16 19 C19 11 28 7 36 10 C42 3 54 3 59 9 C65 2 77 2 82 9 C88 2 100 2 105 9 C111 2 123 2 128 9 C134 3 145 4 149 12 C157 10 165 12 168 18 C176 15 182 21 177 27 C173 31 169 31 167 33 C167 41 161 45 152 45 Z"
              fill="url(#pasta-telo)"
            />
            {/* pruge prate nabore, a sredina ostaje bela za natpis */}
            <path
              className={stil.prugaPlava}
              d="M17 22 C22 15 30 13 36 15 C43 9 53 9 58 14 C65 8 76 8 81 14 C88 8 99 8 104 14 C111 8 122 8 127 14 C134 9 144 10 148 16 C154 15 160 17 163 21"
            />
            <path
              className={stil.prugaCijan}
              d="M8 36 C28 33 50 38 72 35 C94 32 116 37 138 34 C148 33 156 34 162 32"
            />
            <path className={stil.pastaOdsjaj} d="M40 12 C44 8 50 8 54 11 M86 11 C90 7 97 7 100 10" />
          </svg>
          <span className={stil.pastaTekst}>Preuzmi</span>
          <span className={stil.mehurici} aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} />
            ))}
          </span>
        </a>
      </div>
    </header>
  );
}

function ZnakTelefona() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
      <path d="M10.5 18.5h3" />
    </svg>
  );
}

/** Mala identifikaciona kartica, kao ona na mantilu. */
function ZnakKartice() {
  return (
    <svg viewBox="0 0 24 24">
      <rect x="5" y="4.5" width="14" height="17" rx="2.4" />
      <path d="M10 2.5h4v3.5h-4z" />
      <circle cx="12" cy="11" r="2.3" />
      <path d="M8.6 17.5c.7-1.8 2-2.7 3.4-2.7s2.7.9 3.4 2.7" />
    </svg>
  );
}
