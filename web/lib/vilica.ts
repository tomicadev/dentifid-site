/**
 * Crta gornju i donju vilicu kao ravan vektor.
 *
 * Luk je elipsa uža nego dublja, pa je zakrivljenost najveća napred, kod
 * sekutića, a najmanja pozadi, gde kutnjaci idu skoro pravo. Zubi se ređaju po
 * dužini luka srazmerno stvarnoj meziodistalnoj širini u milimetrima, a kruna
 * je superelipsa čija se jezična strana sužava — sekutić je klinast i tanak,
 * kutnjak pun i zaobljen.
 *
 * Pogled je kao u aplikaciji: leva strana slike je desna strana korisnika.
 * Gornji luk je otvoren nadole, donji nagore, kao u stomatološkom kartonu.
 */

const PO_MM = 3.6;
const RAZMAK = 1.2;
const TACAKA = 22;

export type TipZuba = "sekutic" | "lateralni" | "ocnjak" | "premolar" | "molar";

type Opis = {
  broj: string;
  naziv: string;
  tip: TipZuba;
  sirinaMm: number;
  dubinaMm: number;
  eksponent: number;
  suzenje: number;
};

const GORE: Opis[] = [
  { broj: "1", naziv: "centralni sekutić", tip: "sekutic", sirinaMm: 8.5, dubinaMm: 5.4, eksponent: 3.6, suzenje: 0.6 },
  { broj: "2", naziv: "lateralni sekutić", tip: "lateralni", sirinaMm: 6.5, dubinaMm: 4.8, eksponent: 3.4, suzenje: 0.58 },
  { broj: "3", naziv: "očnjak", tip: "ocnjak", sirinaMm: 7.6, dubinaMm: 7.4, eksponent: 2.6, suzenje: 0.64 },
  { broj: "4", naziv: "prvi premolar", tip: "premolar", sirinaMm: 7.1, dubinaMm: 8.8, eksponent: 2.5, suzenje: 0.8 },
  { broj: "5", naziv: "drugi premolar", tip: "premolar", sirinaMm: 6.8, dubinaMm: 8.6, eksponent: 2.5, suzenje: 0.82 },
  { broj: "6", naziv: "prvi molar", tip: "molar", sirinaMm: 10.2, dubinaMm: 10.8, eksponent: 2.8, suzenje: 0.88 },
  { broj: "7", naziv: "drugi molar", tip: "molar", sirinaMm: 9.4, dubinaMm: 10.4, eksponent: 2.8, suzenje: 0.86 },
];

const DOLE: Opis[] = [
  { broj: "1", naziv: "centralni sekutić", tip: "sekutic", sirinaMm: 5.3, dubinaMm: 4.6, eksponent: 3.6, suzenje: 0.66 },
  { broj: "2", naziv: "lateralni sekutić", tip: "lateralni", sirinaMm: 5.7, dubinaMm: 5.0, eksponent: 3.5, suzenje: 0.64 },
  { broj: "3", naziv: "očnjak", tip: "ocnjak", sirinaMm: 6.8, dubinaMm: 6.6, eksponent: 2.6, suzenje: 0.66 },
  { broj: "4", naziv: "prvi premolar", tip: "premolar", sirinaMm: 7.0, dubinaMm: 7.4, eksponent: 2.5, suzenje: 0.8 },
  { broj: "5", naziv: "drugi premolar", tip: "premolar", sirinaMm: 7.1, dubinaMm: 8.0, eksponent: 2.5, suzenje: 0.82 },
  { broj: "6", naziv: "prvi molar", tip: "molar", sirinaMm: 11.0, dubinaMm: 10.2, eksponent: 2.8, suzenje: 0.9 },
  { broj: "7", naziv: "drugi molar", tip: "molar", sirinaMm: 10.2, dubinaMm: 9.8, eksponent: 2.8, suzenje: 0.88 },
];

export type Zub = {
  fdi: string;
  naziv: string;
  puniNaziv: string;
  tip: TipZuba;
  vilica: "gornja" | "donja";
  strana: "leva" | "desna";
  d: string;
  brazde: string[];
  cx: number;
  cy: number;
  poluprecnik: number;
};

export type Luk = {
  zubi: Zub[];
  desni: string;
  nepce: string;
};

type Tacka = [number, number];

function napraviLuk(
  zubi: Opis[],
  a: number,
  b: number,
  nadole: boolean,
  vilica: "gornja" | "donja",
  pomerajY: number,
  mera = 1,
): Luk {
  // Faktor mere uvećava zube jednog luka, da bi oba luka bila iste veličine.
  const mm = PO_MM * mera;
  // `nadole` znači da je luk otvoren nadole, pa su prednji zubi na vrhu slike.
  const znakY = nadole ? -1 : 1;
  const tacka = (t: number): Tacka => [a * Math.sin(t), znakY * b * Math.cos(t) + pomerajY];
  const tangenta = (t: number): Tacka => {
    const dx = a * Math.cos(t);
    const dy = -znakY * b * Math.sin(t);
    const duz = Math.hypot(dx, dy);
    return [dx / duz, dy / duz];
  };

  // Gusta tabela (parametar, pređena dužina luka).
  const uzorci: Array<[number, number]> = [];
  let t = 0;
  let s = 0;
  let [px, py] = tacka(0);
  while (t < Math.PI * 0.66) {
    uzorci.push([t, s]);
    t += 0.0015;
    const [x, y] = tacka(t);
    s += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  const tZaDuzinu = (cilj: number) => {
    for (const [tt, ss] of uzorci) if (ss >= cilj) return tt;
    return uzorci[uzorci.length - 1][0];
  };

  const ukupno = zubi.reduce((zbir, z) => zbir + z.sirinaMm * mm + RAZMAK, 0);

  const polozaj = (duz: number, strana: number) => {
    const tt = tZaDuzinu(duz);
    let [x, y] = tacka(tt);
    let [tx, ty] = tangenta(tt);
    x *= strana;
    tx *= strana;
    let nx = ty;
    let ny = -tx;
    const ka = x * nx + (y - pomerajY) * ny;
    if (ka < 0) {
      nx = -nx;
      ny = -ny;
    }
    return { x, y, tx, ty, nx, ny };
  };

  // Dubina duž luka mora da se menja glatko, inače desni dobiju stepenice.
  const cvorovi: Array<[number, number]> = [];
  let hod = 0;
  for (const z of zubi) {
    cvorovi.push([hod + (z.sirinaMm * mm) / 2, z.dubinaMm * mm]);
    hod += z.sirinaMm * mm + RAZMAK;
  }
  const dubinaNa = (duz: number) => {
    if (duz <= cvorovi[0][0]) return cvorovi[0][1];
    for (let i = 0; i < cvorovi.length - 1; i += 1) {
      const [s1, d1] = cvorovi[i];
      const [s2, d2] = cvorovi[i + 1];
      if (duz <= s2) return d1 + ((d2 - d1) * (duz - s1)) / (s2 - s1);
    }
    return cvorovi[cvorovi.length - 1][1];
  };

  const obod = (strana: number, odmak: (d: number) => number, koraka = 72): Tacka[] => {
    const tacke: Tacka[] = [];
    for (let i = 0; i <= koraka; i += 1) {
      const duz = (ukupno * i) / koraka;
      const p = polozaj(duz, strana);
      const o = odmak(duz);
      tacke.push([p.x + p.nx * o, p.y + p.ny * o]);
    }
    return tacke;
  };

  const izlaz: Zub[] = [];

  for (const strana of ["desna", "leva"] as const) {
    const znak = strana === "desna" ? -1 : 1; // leva strana slike je desna strana korisnika
    const kvadrant =
      vilica === "gornja" ? (strana === "desna" ? "1" : "2") : strana === "desna" ? "4" : "3";
    let pomeraj = 0;

    for (const opis of zubi) {
      const sirina = opis.sirinaMm * mm;
      const dubina = opis.dubinaMm * mm;
      const p = polozaj(pomeraj + sirina / 2, znak);
      pomeraj += sirina + RAZMAK;

      const lokalne: Tacka[] = [];
      for (let i = 0; i < TACAKA; i += 1) {
        const ugao = (2 * Math.PI * i) / TACAKA;
        const c = Math.cos(ugao);
        const sn = Math.sin(ugao);
        let u = Math.sign(c) * Math.abs(c) ** (2 / opis.eksponent) * (sirina / 2);
        let v = Math.sign(sn) * Math.abs(sn) ** (2 / opis.eksponent) * (dubina / 2);
        if (v < 0) u *= opis.suzenje + (1 - opis.suzenje) * (1 + v / (dubina / 2));
        if (opis.tip === "ocnjak" && v > dubina * 0.3) v *= 1.24;
        lokalne.push([u, v]);
      }

      const svetske: Tacka[] = lokalne.map(([u, v]) => [
        p.x + p.tx * u + p.nx * v,
        p.y + p.ty * u + p.ny * v,
      ]);

      const crta = (u1: number, v1: number, u2: number, v2: number) =>
        `M${(p.x + p.tx * u1 + p.nx * v1).toFixed(1)},${(p.y + p.ty * u1 + p.ny * v1).toFixed(1)}` +
        `L${(p.x + p.tx * u2 + p.nx * v2).toFixed(1)},${(p.y + p.ty * u2 + p.ny * v2).toFixed(1)}`;

      let brazde: string[];
      if (opis.tip === "molar") {
        brazde = [
          crta(-sirina * 0.22, 0, sirina * 0.22, 0),
          crta(0, -dubina * 0.16, 0, dubina * 0.16),
        ];
      } else if (opis.tip === "premolar") {
        brazde = [crta(0, -dubina * 0.2, 0, dubina * 0.2)];
      } else if (opis.tip === "ocnjak") {
        brazde = [crta(0, dubina * 0.44, 0, -dubina * 0.14)];
      } else {
        brazde = [crta(-sirina * 0.28, dubina * 0.14, sirina * 0.28, dubina * 0.14)];
      }

      izlaz.push({
        fdi: kvadrant + opis.broj,
        naziv: opis.naziv,
        puniNaziv: `${vilica === "gornja" ? "gornji" : "donji"} ${strana === "leva" ? "levi" : "desni"} ${opis.naziv}`,
        tip: opis.tip,
        vilica,
        strana,
        d: glatka(svetske),
        brazde,
        // Zaokruženo, jer server i pregledač znaju da se razlikuju u poslednjoj
        // decimali, pa bi hidratacija prijavila neslaganje.
        cx: Number(p.x.toFixed(2)),
        cy: Number(p.y.toFixed(2)),
        poluprecnik: Number((Math.min(sirina, dubina) * 0.34).toFixed(2)),
      });
    }
  }

  const spoljaL = obod(-1, (d) => dubinaNa(d) * 0.5 + 6);
  const spoljaD = obod(1, (d) => dubinaNa(d) * 0.5 + 6);
  const iznutraL = obod(-1, (d) => -(dubinaNa(d) * 0.5 + 4.5));
  const iznutraD = obod(1, (d) => -(dubinaNa(d) * 0.5 + 4.5));

  const put = (tacke: Tacka[]) =>
    `M${tacke.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L")} Z`;

  return {
    zubi: izlaz,
    desni: put([...spoljaL].reverse().concat(spoljaD, [...iznutraD].reverse(), iznutraL)),
    nepce: put([...iznutraL].reverse().concat(iznutraD)),
  };
}

function glatka(tacke: Tacka[]): string {
  const n = tacke.length;
  const delovi = [`M${tacke[0][0].toFixed(1)},${tacke[0][1].toFixed(1)}`];
  for (let i = 0; i < n; i += 1) {
    const p0 = tacke[(i - 1 + n) % n];
    const p1 = tacke[i];
    const p2 = tacke[(i + 1) % n];
    const p3 = tacke[(i + 2) % n];
    const c1: Tacka = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Tacka = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    delovi.push(
      `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`,
    );
  }
  return `${delovi.join("")}Z`;
}

const RAZMAK_VILICA = 64; // razmak između dva luka, da se ne spoje u prsten

// Donji zubi su u stvarnosti nešto uži, pa se uvećavaju tako da ukupna dužina
// donjeg luka bude jednaka gornjoj: dva luka tada izgledaju kao ogledalo.
const duzinaLuka = (zubi: Opis[]) => zubi.reduce((zbir, z) => zbir + z.sirinaMm, 0);
const MERA_DOLE = duzinaLuka(GORE) / duzinaLuka(DOLE);

export const gornjaVilica = napraviLuk(GORE, 104, 143, true, "gornja", -RAZMAK_VILICA / 2);
export const donjaVilica = napraviLuk(DOLE, 104, 143, false, "donja", RAZMAK_VILICA / 2, MERA_DOLE);
export const sviZubi: Zub[] = [...gornjaVilica.zubi, ...donjaVilica.zubi];

/** Okvir koji obuhvata oba luka, sa malo vazduha okolo. */
export const okvirVilica = (() => {
  const xs: number[] = [];
  const ys: number[] = [];
  for (const zub of sviZubi) {
    xs.push(zub.cx - 26, zub.cx + 26);
    ys.push(zub.cy - 26, zub.cy + 26);
  }
  const minX = Math.min(...xs) - 6;
  const maxX = Math.max(...xs) + 6;
  const minY = Math.min(...ys) - 6;
  const maxY = Math.max(...ys) + 6;
  return {
    x: minX,
    y: minY,
    sirina: maxX - minX,
    visina: maxY - minY,
    viewBox: `${minX.toFixed(1)} ${minY.toFixed(1)} ${(maxX - minX).toFixed(1)} ${(maxY - minY).toFixed(1)}`,
  };
})();
