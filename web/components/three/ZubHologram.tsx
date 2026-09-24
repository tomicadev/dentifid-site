"use client";

import { useMemo } from "react";
import * as THREE from "three";

/**
 * Kutnjak kao providan hologram: telo sa sjajem na ivicama i mreža linija
 * po površini.
 *
 * Geometrija se gradi iz parametara, kao mreža redova i kolona — zato se mreža
 * linija vidi kao uredna četvorougaona mreža, bez dijagonala koje bi imala
 * mreža trouglova. Kruna ima četiri kvržice, a tri korena se sužavaju i blago
 * krive, kao kod gornjeg kutnjaka.
 */

type Tacka = [number, number, number];

// --- kruna -------------------------------------------------------------------

const A = 0.5; // polovina širine
const B = 0.45; // polovina dubine
const N_EKSP = 2.8; // oblik preseka: između elipse i zaobljenog kvadrata
const Y_JAMICA = 0.4; // sredina griznog dela
const Y_KVRZICA = 0.6;
const Y_RUB = 0.5;
const Y_VRAT = 0.02;
const V_GRIZNO = 0.3;

function poluprecnik(t: number) {
  const c = Math.abs(Math.cos(t) / A) ** N_EKSP;
  const s = Math.abs(Math.sin(t) / B) ** N_EKSP;
  return 1 / (c + s) ** (1 / N_EKSP);
}

/** 1 na uglovima (gde su kvržice), 0 između njih (gde su brazde). */
function kvrzica(t: number) {
  return ((1 - Math.cos(4 * t)) / 2) ** 1.3;
}

function tackaKrune(v: number, t: number): Tacka {
  const R = poluprecnik(t);
  const k = kvrzica(t);
  let r: number;
  let y: number;

  if (v <= V_GRIZNO) {
    const s = v / V_GRIZNO;
    r = s * R * 0.9 * (1 + 0.035 * k * s);
    const vrh = Y_KVRZICA - 0.07 * (1 - k);
    y =
      s < 0.65
        ? Y_JAMICA + (vrh - Y_JAMICA) * Math.sin((Math.PI / 2) * (s / 0.65))
        : vrh - (vrh - Y_RUB) * ((s - 0.65) / 0.35) ** 1.5;
  } else {
    const s = (v - V_GRIZNO) / (1 - V_GRIZNO);
    // Kruna je najšira oko sredine visine, pa se sužava ka vratu zuba.
    const ispupcenje = 0.9 + 0.11 * Math.sin(Math.PI * s * 0.9) - 0.16 * s ** 2.2;
    r = ispupcenje * R * (1 + 0.035 * (1 - s) * k);
    y = Y_RUB + (Y_VRAT - Y_RUB) * s;
  }
  return [r * Math.cos(t), y, r * Math.sin(t)];
}

// --- koreni ------------------------------------------------------------------

type Koren = {
  vrh: Tacka;
  kontrola: Tacka;
  kraj: Tacka;
  r0: number;
  spljosten: number;
};

const KORENI: Koren[] = [
  // dva korena sa obrazne strane i jedan, najveći, sa nepčane
  { vrh: [-0.2, 0.14, 0.1], kontrola: [-0.28, -0.35, 0.16], kraj: [-0.24, -0.78, 0.2], r0: 0.15, spljosten: 0.78 },
  { vrh: [0.2, 0.14, 0.1], kontrola: [0.3, -0.35, 0.14], kraj: [0.3, -0.76, 0.18], r0: 0.15, spljosten: 0.78 },
  { vrh: [0, 0.14, -0.17], kontrola: [0.02, -0.38, -0.3], kraj: [0.04, -0.84, -0.3], r0: 0.18, spljosten: 0.9 },
];

function tackaKorena(k: Koren, u: number, t: number): Tacka {
  // kvadratni Bezijeov put kroz sredinu korena
  const m = 1 - u;
  const c = [0, 1, 2].map((i) => m * m * k.vrh[i] + 2 * m * u * k.kontrola[i] + u * u * k.kraj[i]);
  const r = Math.max(k.r0 * (1 - u) ** 0.75 * (1 - 0.1 * u), 0.012);
  return [c[0] + r * Math.cos(t), c[1], c[2] + r * Math.sin(t) * k.spljosten];
}

// --- mreža -------------------------------------------------------------------

function mreza(redova: number, kolona: number, tacka: (red: number, kolona: number) => Tacka) {
  const pozicije: number[] = [];
  for (let i = 0; i <= redova; i += 1) {
    for (let j = 0; j < kolona; j += 1) {
      pozicije.push(...tacka(i, j));
    }
  }

  const trouglovi: number[] = [];
  const linije: number[] = [];
  const indeks = (i: number, j: number) => i * kolona + (j % kolona);

  for (let i = 0; i <= redova; i += 1) {
    for (let j = 0; j < kolona; j += 1) {
      // prsten u redu i
      linije.push(indeks(i, j), indeks(i, j + 1));
      if (i < redova) {
        // meridijan između redova i i i+1
        linije.push(indeks(i, j), indeks(i + 1, j));
        trouglovi.push(indeks(i, j), indeks(i + 1, j), indeks(i + 1, j + 1));
        trouglovi.push(indeks(i, j), indeks(i + 1, j + 1), indeks(i, j + 1));
      }
    }
  }

  const telo = new THREE.BufferGeometry();
  telo.setAttribute("position", new THREE.Float32BufferAttribute(pozicije, 3));
  telo.setIndex(trouglovi);
  telo.computeVertexNormals();

  const mrezaLinija = new THREE.BufferGeometry();
  mrezaLinija.setAttribute("position", new THREE.Float32BufferAttribute(pozicije, 3));
  mrezaLinija.setIndex(linije);

  return { telo, linije: mrezaLinija };
}

// --- materijali ---------------------------------------------------------------

const SENCAR_TEMENA = /* glsl */ `
  varying vec3 vNormala;
  varying vec3 vPogled;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormala = normalize(normalMatrix * normal);
    vPogled = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

// Ivice gledane „sa strane" svetle jače od površine okrenute ka nama —
// zato telo deluje kao staklo sa sjajnim obrisom.
const SENCAR_PIKSELA = /* glsl */ `
  uniform vec3 uBoja;
  uniform vec3 uRub;
  uniform float uMin;
  uniform float uMax;
  varying vec3 vNormala;
  varying vec3 vPogled;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vNormala), normalize(vPogled))), 2.2);
    gl_FragColor = vec4(mix(uBoja, uRub, f), mix(uMin, uMax, f));
  }
`;

type Props = {
  /** Na plavoj podlozi (dugme u uglu na telefonu) hologram je beo. */
  naPlavom?: boolean;
};

export default function ZubHologram({ naPlavom = false }: Props) {
  const delovi = useMemo(() => {
    const kruna = mreza(22, 44, (i, j) => tackaKrune(i / 22, (j / 44) * Math.PI * 2));
    const koreni = KORENI.map((k) =>
      mreza(14, 14, (i, j) => tackaKorena(k, i / 14, (j / 14) * Math.PI * 2)),
    );
    return [kruna, ...koreni];
  }, []);

  const materijalTela = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SENCAR_TEMENA,
        fragmentShader: SENCAR_PIKSELA,
        uniforms: {
          uBoja: { value: new THREE.Color(naPlavom ? "#ffffff" : "#dcefff") },
          uRub: { value: new THREE.Color(naPlavom ? "#ffffff" : "#2e8bff") },
          uMin: { value: naPlavom ? 0.08 : 0.06 },
          uMax: { value: naPlavom ? 0.75 : 0.62 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [naPlavom],
  );

  const materijalLinija = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: naPlavom ? "#ffffff" : "#3a8fff",
        transparent: true,
        opacity: naPlavom ? 0.6 : 0.5,
        depthWrite: false,
      }),
    [naPlavom],
  );

  return (
    <group position={[0, 0.11, 0]} scale={0.84}>
      {delovi.map((deo, i) => (
        <group key={i}>
          <mesh geometry={deo.telo} material={materijalTela} renderOrder={1} />
          <lineSegments geometry={deo.linije} material={materijalLinija} renderOrder={2} />
        </group>
      ))}
    </group>
  );
}
