import * as THREE from "three";

/**
 * Kroj polovine lekarskog mantila i pravila po kojima se savija i leprša.
 *
 * Vidi se desna polovina gledano od nosioca — na ekranu levo, sa prednjom
 * ivicom okrenutom ka tekstu. Kroj je ravan: x ide od bočnog šava (levo) do
 * prednje ivice (desno), y od poruba do vrata. `osnova` ga savija oko
 * zamišljenog trupa, a `vetar` dodaje lepršanje: grudi miruju, porub i
 * prednja ivica se talasaju. Svi delovi — telo, rever, džepovi, dugmad —
 * prolaze kroz iste dve funkcije, pa se pomeraju zajedno.
 */

type Par = readonly [number, number];

export const KROJ = {
  vrh: 1.75,
  dno: -1.85,
  /** Visina na kojoj se prednja ivica prelama u rever. */
  prelom: 0.3,
  /** Prednja ivica, na sredini tela. */
  prednja: 0.58,
  vrat: [0.2, 1.75] as Par,
  rame: [-0.5, 1.58] as Par,
  pazuh: [-0.62, 0.98] as Par,
  bokDole: -0.82,
  /** Vrh revera i zarez gde rever prelazi u kragnu. */
  reverVrh: [-0.02, 1.12] as Par,
  zarez: [0.12, 1.38] as Par,
};

/** Granice ravnog kroja, za šare (šavove i senke) na telu. */
export const OKVIR_KROJA = { x0: -0.9, x1: 0.7, y0: -1.9, y1: 1.8 };
/** Granice revera u kroju. */
export const OKVIR_REVERA = { x0: -0.05, x1: 0.6, y0: 0.3, y1: 1.75 };

/** Džepovi i dugmad, u koordinatama kroja. */
export const DZEP = { x0: -0.46, x1: -0.06, gore: 0.95, dole: 0.5, zaobljenje: 0.05 };
export const DONJI_DZEP = { x0: -0.6, x1: 0.06, gore: -0.66, dole: -1.2, zaobljenje: 0.06 };
export const DUGMAD: Par[] = [
  [0.47, -0.62],
  [0.47, -1.12],
  [0.47, -1.62],
];

const R = 1.7;
const DUBINA = 0.55;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function glatko(a: number) {
  const t = Math.min(Math.max(a, 0), 1);
  return t * t * (3 - 2 * t);
}

/** Leva i desna ivica tela mantila na visini y. */
export function ivicePanela(y: number): [number, number] {
  const { prednja, prelom, vrat, rame, pazuh, bokDole, dno } = KROJ;
  const desno =
    y <= prelom
      ? prednja + 0.025 * ((prelom - y) / (prelom - dno))
      : lerp(prednja, vrat[0], (y - prelom) / (vrat[1] - prelom));
  let levo: number;
  if (y >= rame[1]) {
    levo = lerp(rame[0], vrat[0], (y - rame[1]) / (vrat[1] - rame[1]));
  } else if (y >= pazuh[1]) {
    // izrez za rukav je blago uvučen
    const t = (rame[1] - y) / (rame[1] - pazuh[1]);
    levo = lerp(rame[0], pazuh[0], t) + 0.07 * Math.sin(Math.PI * t);
  } else {
    levo = lerp(pazuh[0], bokDole, (pazuh[1] - y) / (pazuh[1] - dno));
  }
  return [levo, Math.max(desno, levo + 0.004)];
}

/** Spoljna ivica revera i linija preloma, na visini y. */
export function iviceRevera(y: number): [number, number] {
  const { prednja, prelom, vrat, reverVrh, zarez } = KROJ;
  const prelomX = lerp(prednja, vrat[0], (y - prelom) / (vrat[1] - prelom));
  let spolja: number;
  if (y <= reverVrh[1]) {
    spolja = lerp(prednja, reverVrh[0], (y - prelom) / (reverVrh[1] - prelom));
  } else if (y <= zarez[1]) {
    spolja = lerp(reverVrh[0], zarez[0], (y - reverVrh[1]) / (zarez[1] - reverVrh[1]));
  } else {
    spolja = lerp(zarez[0], vrat[0], (y - zarez[1]) / (vrat[1] - zarez[1]));
  }
  return [spolja, Math.max(prelomX, spolja + 0.004)];
}

export type Mesto = { x: number; y: number; z: number; nx: number; ny: number; nz: number };

export const novoMesto = (): Mesto => ({ x: 0, y: 0, z: 0, nx: 0, ny: 0, nz: 1 });

/** Tačka kroja savijena oko trupa, bez vetra, sa približnom normalom. */
export function osnova(x: number, y: number, izlaz: Mesto): Mesto {
  const th = (KROJ.prednja - x) / R;
  const s = Math.sin(th);
  const c = Math.cos(th);
  const grudi = 0.08 * Math.exp(-(((y - 0.85) / 0.55) ** 2)) * Math.max(c, 0);
  // iznad grudi tkanina ide unazad, preko ramena
  const nad = Math.max(0, y - 1.3);
  // ispod pojasa tkanina pada u nekoliko mekih, uspravnih nabora
  const nabori = 0.022 * Math.sin(8.5 * x + 1.3) * glatko((0.1 - y) / 1.4);
  izlaz.x = KROJ.prednja - R * s;
  izlaz.y = y;
  izlaz.z = DUBINA * R * c + grudi - 0.9 * nad * nad + nabori;
  const nx = -DUBINA * s;
  const ny = 1.8 * nad;
  const nz = c;
  const d = Math.hypot(nx, ny, nz) || 1;
  izlaz.nx = nx / d;
  izlaz.ny = ny / d;
  izlaz.nz = nz / d;
  return izlaz;
}

/** Pomeraj od vetra: grudi miruju, a porub i prednja ivica se talasaju. */
export function vetar(x: number, y: number, t: number, snaga: number, izlaz: THREE.Vector3) {
  const k = Math.pow(glatko((0.6 - y) / 2.35), 1.35) * snaga;
  const slobodno = 0.55 + 0.45 * glatko((x + 0.7) / 1.3);
  const a = k * slobodno;
  izlaz.set(
    a * 0.06 * Math.sin(1.2 * y - 1.6 * t + 0.8),
    a * (0.035 * Math.sin(2.3 * x - 1.8 * t + 0.4) + 0.03),
    a *
      (0.15 * Math.sin(1.8 * y - 2.0 * t + 2.4 * x) +
        0.05 * Math.sin(3.9 * y - 3.1 * t - 1.7 * x + 1.1) +
        0.07 * (0.6 + 0.4 * Math.sin(0.55 * t))),
  );
  return izlaz;
}

const _m = novoMesto();
const _v = new THREE.Vector3();

/** Tačka na mantilu sa vetrom, odmaknuta od tkanine za `odmak`. */
export function tacka(x: number, y: number, t: number, snaga: number, odmak: number, izlaz: THREE.Vector3) {
  osnova(x, y, _m);
  vetar(x, y, t, snaga, _v);
  return izlaz.set(
    _m.x + _m.nx * odmak + _v.x,
    _m.y + _m.ny * odmak + _v.y,
    _m.z + _m.nz * odmak + _v.z,
  );
}

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();

/** Stvarna normala tkanine (sa vetrom), iz dve male razlike. */
export function normala(x: number, y: number, t: number, snaga: number, izlaz: THREE.Vector3) {
  tacka(x, y, t, snaga, 0, _a);
  tacka(x + 0.01, y, t, snaga, 0, _b).sub(_a);
  tacka(x, y + 0.01, t, snaga, 0, _c).sub(_a);
  return izlaz.crossVectors(_b, _c).normalize();
}

// --- delovi kroja ------------------------------------------------------------

export type Deo = {
  geometrija: THREE.BufferGeometry;
  ravno: Float32Array;
  odmak: Float32Array;
};

type Red = { y: number; x0: number; x1: number };

/**
 * Deo kroja kao mreža redova i kolona. Svaki red je vodoravan odsečak od x0
 * do x1 na visini y, pa oblik prati ivice kroja bez nazubljenja.
 */
export function napraviDeo(
  redova: number,
  kolona: number,
  red: (v: number) => Red,
  odmak: (u: number, v: number) => number,
  uv: (x: number, y: number, u: number, v: number) => [number, number],
): Deo {
  const broj = (redova + 1) * (kolona + 1);
  const ravno = new Float32Array(broj * 2);
  const odmaci = new Float32Array(broj);
  const uvs = new Float32Array(broj * 2);

  for (let i = 0; i <= redova; i += 1) {
    const v = i / redova;
    const { y, x0, x1 } = red(v);
    for (let j = 0; j <= kolona; j += 1) {
      const u = j / kolona;
      const k = i * (kolona + 1) + j;
      const x = lerp(x0, x1, u);
      ravno[2 * k] = x;
      ravno[2 * k + 1] = y;
      odmaci[k] = odmak(u, v);
      const [a, b] = uv(x, y, u, v);
      uvs[2 * k] = a;
      uvs[2 * k + 1] = b;
    }
  }

  const indeksi: number[] = [];
  for (let i = 0; i < redova; i += 1) {
    for (let j = 0; j < kolona; j += 1) {
      const a = i * (kolona + 1) + j;
      const b = a + kolona + 1;
      indeksi.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometrija = new THREE.BufferGeometry();
  geometrija.setAttribute("position", new THREE.BufferAttribute(new Float32Array(broj * 3), 3));
  geometrija.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometrija.setIndex(indeksi);
  return { geometrija, ravno, odmak: odmaci };
}

const _p = new THREE.Vector3();

/** Postavlja tačke dela za trenutak t i ponovo računa normale. */
export function postaviDeo(deo: Deo, t: number, snaga: number) {
  const poz = deo.geometrija.getAttribute("position") as THREE.BufferAttribute;
  const niz = poz.array as Float32Array;
  const { ravno, odmak } = deo;
  for (let i = 0; i < odmak.length; i += 1) {
    tacka(ravno[2 * i], ravno[2 * i + 1], t, snaga, odmak[i], _p);
    niz[3 * i] = _p.x;
    niz[3 * i + 1] = _p.y;
    niz[3 * i + 2] = _p.z;
  }
  poz.needsUpdate = true;
  deo.geometrija.computeVertexNormals();
}

/** Red pravougaonog džepa, sa zaobljenim donjim uglovima. */
export function redDzepa(d: typeof DZEP) {
  return (v: number): Red => {
    const y = lerp(d.gore, d.dole, v);
    const doDna = y - d.dole;
    let skrati = 0;
    if (doDna < d.zaobljenje) {
      const k = (d.zaobljenje - doDna) / d.zaobljenje;
      skrati = d.zaobljenje * (1 - Math.sqrt(Math.max(0, 1 - k * k)));
    }
    return { y, x0: d.x0 + skrati, x1: d.x1 - skrati };
  };
}

// --- rukav ---------------------------------------------------------------------

export type Rukav = {
  geometrija: THREE.BufferGeometry;
  krug: number;
  duz: number;
  osa: THREE.Vector3[];
  b: THREE.Vector3[];
  n: THREE.Vector3[];
};

/** Rukav visi iz ramena, malo odmaknut od tela; gore je zatvoren oblom kapom. */
export function napraviRukav(krug = 30, duz = 48): Rukav {
  const kriva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, 1.46, 0.42),
    new THREE.Vector3(-0.66, 1.0, 0.44),
    new THREE.Vector3(-0.8, 0.12, 0.5),
    new THREE.Vector3(-0.9, -0.8, 0.58),
  ]);
  const napred = new THREE.Vector3(0, 0, 1);
  const osa: THREE.Vector3[] = [];
  const b: THREE.Vector3[] = [];
  const n: THREE.Vector3[] = [];
  for (let i = 0; i <= duz; i += 1) {
    const w = i / duz;
    const tangenta = kriva.getTangent(w);
    const bb = new THREE.Vector3().crossVectors(tangenta, napred).normalize();
    osa.push(kriva.getPoint(w));
    b.push(bb);
    n.push(new THREE.Vector3().crossVectors(bb, tangenta).normalize());
  }

  const broj = (duz + 1) * (krug + 1);
  const uvs = new Float32Array(broj * 2);
  for (let i = 0; i <= duz; i += 1) {
    for (let j = 0; j <= krug; j += 1) {
      const k = i * (krug + 1) + j;
      uvs[2 * k] = j / krug;
      uvs[2 * k + 1] = 1 - i / duz;
    }
  }
  const indeksi: number[] = [];
  for (let i = 0; i < duz; i += 1) {
    for (let j = 0; j < krug; j += 1) {
      const a = i * (krug + 1) + j;
      const c = a + krug + 1;
      indeksi.push(a, c, a + 1, c, c + 1, a + 1);
    }
  }
  const geometrija = new THREE.BufferGeometry();
  geometrija.setAttribute("position", new THREE.BufferAttribute(new Float32Array(broj * 3), 3));
  geometrija.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometrija.setIndex(indeksi);
  return { geometrija, krug, duz, osa, b, n };
}

export function postaviRukav(r: Rukav, t: number, snaga: number) {
  const poz = r.geometrija.getAttribute("position") as THREE.BufferAttribute;
  const niz = poz.array as Float32Array;
  for (let i = 0; i <= r.duz; i += 1) {
    const w = i / r.duz;
    const osnovni = w < 0.1 ? 0.26 * Math.sqrt(Math.sin((Math.PI / 2) * (w / 0.1))) : lerp(0.26, 0.19, (w - 0.1) / 0.9);
    const k = Math.pow(w, 1.7) * snaga;
    const px = r.osa[i].x + k * 0.08 * Math.sin(1.3 * t + 0.4);
    const py = r.osa[i].y + k * 0.02 * Math.sin(1.7 * t);
    const pz = r.osa[i].z + k * 0.1 * Math.sin(1.05 * t + 1.2);
    for (let j = 0; j <= r.krug; j += 1) {
      // šav je pozadi, gde se ne vidi
      const f = 1.5 * Math.PI + (j / r.krug) * Math.PI * 2;
      // nabori oko lakta i blago talasanje ka manžetni
      const lakat = 0.035 * Math.sin(w * 34 + f) * Math.exp(-(((w - 0.52) / 0.13) ** 2));
      const pr =
        osnovni *
        (1 + 0.03 * Math.sin(6 * f + 3 * w) + lakat + 0.05 * w * snaga * Math.sin(3 * f + 2.3 * t - 5 * w));
      const cx = Math.cos(f) * pr;
      const sy = Math.sin(f) * pr;
      const idx = 3 * (i * (r.krug + 1) + j);
      niz[idx] = px + r.b[i].x * cx + r.n[i].x * sy;
      niz[idx + 1] = py + r.b[i].y * cx + r.n[i].y * sy;
      niz[idx + 2] = pz + r.b[i].z * cx + r.n[i].z * sy;
    }
  }
  poz.needsUpdate = true;
  r.geometrija.computeVertexNormals();
}

// --- kragna --------------------------------------------------------------------

/** Tačka kroja odmaknuta od tkanine, kao vektor. */
function naKroju(x: number, y: number, odmak: number) {
  const m = osnova(x, y, novoMesto());
  return new THREE.Vector3(m.x + m.nx * odmak, m.y + m.ny * odmak, m.z + m.nz * odmak);
}

/**
 * Kragna kreće od zareza na reveru, penje se do vrata i preko ramena odlazi
 * unazad. Gornja ivica je pregib uz vrat, a tkanina pada ka ramenu, pa se
 * kragna ne diže u prazno iznad mantila.
 */
export function napraviKragnu(duz = 40, sir = 8) {
  const vrat = osnova(KROJ.vrat[0], KROJ.vrat[1], novoMesto());
  const put = new THREE.CatmullRomCurve3([
    naKroju(KROJ.zarez[0], KROJ.zarez[1], 0.05),
    naKroju(0.17, 1.6, 0.05),
    new THREE.Vector3(vrat.x + 0.02, 1.79, vrat.z - 0.02),
    new THREE.Vector3(vrat.x + 0.05, 1.83, vrat.z - 0.2),
    new THREE.Vector3(vrat.x + 0.08, 1.84, vrat.z - 0.42),
  ]);
  const pravac = new THREE.Vector3(-1, -0.42, 0.12).normalize();
  const ispupcenje = new THREE.Vector3(0.15, 0.5, 0.85).normalize();

  const broj = (duz + 1) * (sir + 1);
  const pozicije = new Float32Array(broj * 3);
  const uvs = new Float32Array(broj * 2);
  for (let i = 0; i <= duz; i += 1) {
    const s = i / duz;
    const p = put.getPoint(s);
    const sirina = 0.21 * (0.5 + 0.5 * glatko(s / 0.25));
    for (let j = 0; j <= sir; j += 1) {
      const q = j / sir;
      const k = i * (sir + 1) + j;
      const obli = 0.022 * Math.sin(Math.PI * q);
      pozicije[3 * k] = p.x + pravac.x * sirina * q + ispupcenje.x * obli;
      pozicije[3 * k + 1] = p.y + pravac.y * sirina * q + ispupcenje.y * obli;
      pozicije[3 * k + 2] = p.z + pravac.z * sirina * q + ispupcenje.z * obli;
      uvs[2 * k] = s;
      uvs[2 * k + 1] = 1 - q;
    }
  }

  const indeksi: number[] = [];
  for (let i = 0; i < duz; i += 1) {
    for (let j = 0; j < sir; j += 1) {
      const a = i * (sir + 1) + j;
      const c = a + sir + 1;
      indeksi.push(a, a + 1, c, c, a + 1, c + 1);
    }
  }
  const geometrija = new THREE.BufferGeometry();
  geometrija.setAttribute("position", new THREE.BufferAttribute(pozicije, 3));
  geometrija.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometrija.setIndex(indeksi);
  geometrija.computeVertexNormals();
  return geometrija;
}

// --- traka oko vrata -----------------------------------------------------------

/** Mesto na kome kartica visi o traci, u prostoru mantila. */
export function mestoKopce() {
  return naKroju(0.3, 0.62, 0.09);
}

/**
 * Traka ide od kopče uz grudi, preko revera do vrata, pa se preko ramena gubi
 * ispod kragne. Pljosnata je, pa je lice trake uvek okrenuto od tela.
 */
export function napraviTraku(sirina = 0.08, koraka = 90) {
  const m = novoMesto();
  const vrat = osnova(KROJ.vrat[0], KROJ.vrat[1], novoMesto());
  const tacke: THREE.Vector3[] = [];
  const normale: THREE.Vector3[] = [];
  const dodaj = (x: number, y: number, odmak: number) => {
    osnova(x, y, m);
    tacke.push(new THREE.Vector3(m.x + m.nx * odmak, m.y + m.ny * odmak, m.z + m.nz * odmak));
    normale.push(new THREE.Vector3(m.nx, m.ny, m.nz));
  };

  tacke.push(mestoKopce().add(new THREE.Vector3(0, 0.05, 0)));
  normale.push(new THREE.Vector3(-0.09, 0, 1).normalize());
  dodaj(0.32, 0.95, 0.075);
  dodaj(0.28, 1.28, 0.07);
  dodaj(0.22, 1.56, 0.045);
  // preko ramena traka ide unazad i nestaje iza mantila, oko vrata
  tacke.push(new THREE.Vector3(vrat.x - 0.02, 1.74, vrat.z - 0.04));
  normale.push(new THREE.Vector3(-0.2, 0.7, 0.7).normalize());
  tacke.push(new THREE.Vector3(vrat.x - 0.06, 1.67, vrat.z - 0.22));
  normale.push(new THREE.Vector3(-0.3, 1, 0.1).normalize());
  tacke.push(new THREE.Vector3(vrat.x - 0.1, 1.38, vrat.z - 0.42));
  normale.push(new THREE.Vector3(-0.3, 0.6, -0.7).normalize());

  const kriva = new THREE.CatmullRomCurve3(tacke);
  const duzina = kriva.getLength();
  const pozicije = new Float32Array((koraka + 1) * 2 * 3);
  const uvs = new Float32Array((koraka + 1) * 2 * 2);
  const bok = new THREE.Vector3();
  const lice = new THREE.Vector3();

  for (let i = 0; i <= koraka; i += 1) {
    const s = i / koraka;
    const p = kriva.getPointAt(s);
    const t = kriva.getTangentAt(s);
    const f = s * (normale.length - 1);
    const i0 = Math.min(Math.floor(f), normale.length - 2);
    lice.copy(normale[i0]).lerp(normale[i0 + 1], f - i0).normalize();
    bok.crossVectors(t, lice).normalize();
    for (let j = 0; j < 2; j += 1) {
      const strana = j === 0 ? -0.5 : 0.5;
      const k = i * 2 + j;
      pozicije[3 * k] = p.x + bok.x * sirina * strana;
      pozicije[3 * k + 1] = p.y + bok.y * sirina * strana;
      pozicije[3 * k + 2] = p.z + bok.z * sirina * strana;
      uvs[2 * k] = (s * duzina) / 0.9;
      uvs[2 * k + 1] = j;
    }
  }

  const indeksi: number[] = [];
  for (let i = 0; i < koraka; i += 1) {
    const a = i * 2;
    indeksi.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
  }
  const geometrija = new THREE.BufferGeometry();
  geometrija.setAttribute("position", new THREE.BufferAttribute(pozicije, 3));
  geometrija.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometrija.setIndex(indeksi);
  geometrija.computeVertexNormals();
  return geometrija;
}

// --- olovka u džepu --------------------------------------------------------------

/** Olovka stoji u gornjem džepu: telo iza prednjeg dela džepa, vrh iznad njega. */
export function mestoOlovke() {
  const m = osnova(-0.3, 1.0, novoMesto());
  return {
    polozaj: new THREE.Vector3(m.x + m.nx * 0.035, m.y, m.z + m.nz * 0.035),
    normala: new THREE.Vector3(m.nx, m.ny, m.nz),
  };
}
