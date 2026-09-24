import * as THREE from "three";
import { DONJI_DZEP, DUGMAD, DZEP, KROJ, OKVIR_KROJA, OKVIR_REVERA } from "./mantil";

/**
 * Teksture se crtaju na platnu u pregledaču: šavovi i senke na tkanini, bluza,
 * unutrašnjost okovratnika i traka sa natpisom. Ništa se ne preuzima.
 */

function platno(sirina: number, visina: number) {
  const c = document.createElement("canvas");
  c.width = sirina;
  c.height = visina;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Platno nije dostupno");
  return { c, ctx };
}

function tekstura(c: HTMLCanvasElement, uBoji = true) {
  const t = new THREE.CanvasTexture(c);
  if (uBoji) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const STEP = "rgba(112, 134, 166, 0.6)";

function stepLinija(ctx: CanvasRenderingContext2D, debljina: number, crta: number) {
  ctx.setLineDash([crta, crta * 0.7]);
  ctx.lineWidth = debljina;
  ctx.strokeStyle = STEP;
  ctx.lineCap = "round";
}

/**
 * Šavovi i senke koje rever, kragna, džepovi i dugmad bacaju na telo mantila.
 * Gornji džep i dugmad su samo na desnoj polovini, pa i njihove senke.
 */
export function teksturaTela({ desna }: { desna: boolean }) {
  const O = OKVIR_KROJA;
  const s = 1024 / (O.x1 - O.x0);
  const { c, ctx } = platno(1024, Math.round((O.y1 - O.y0) * s));
  const px = (x: number) => (x - O.x0) * s;
  const py = (y: number) => (O.y1 - y) * s;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);

  const saSenkom = (blur: number, dx: number, dy: number, alfa: number, crtaj: () => void) => {
    ctx.save();
    ctx.shadowColor = `rgba(20, 44, 90, ${alfa})`;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = dx;
    ctx.shadowOffsetY = dy;
    ctx.fillStyle = "#ffffff";
    crtaj();
    ctx.restore();
  };

  // senka revera pada nadole i udesno, jer svetlo dolazi odozgo sleva
  saSenkom(30, 10, 14, 0.42, () => {
    ctx.beginPath();
    ctx.moveTo(px(KROJ.prednja), py(KROJ.prelom));
    ctx.lineTo(px(KROJ.reverVrh[0]), py(KROJ.reverVrh[1]));
    ctx.lineTo(px(KROJ.zarez[0]), py(KROJ.zarez[1]));
    ctx.lineTo(px(KROJ.vrat[0]), py(KROJ.vrat[1]));
    ctx.closePath();
    ctx.fill();
  });

  // kragna leži preko ramena, od zareza ka rukavu
  saSenkom(26, 8, 12, 0.34, () => {
    ctx.beginPath();
    ctx.moveTo(px(KROJ.zarez[0]), py(KROJ.zarez[1]));
    ctx.lineTo(px(KROJ.vrat[0]), py(KROJ.vrat[1]));
    ctx.lineTo(px(KROJ.rame[0] + 0.12), py(KROJ.rame[1] + 0.04));
    ctx.lineTo(px(-0.12), py(1.5));
    ctx.lineTo(px(0.0), py(1.42));
    ctx.closePath();
    ctx.fill();
  });

  for (const d of desna ? [DZEP, DONJI_DZEP] : [DONJI_DZEP]) {
    saSenkom(18, 6, 9, 0.2, () => {
      ctx.beginPath();
      ctx.roundRect(px(d.x0), py(d.gore), (d.x1 - d.x0) * s, (d.gore - d.dole) * s, [0, 0, 26, 26]);
      ctx.fill();
    });
  }

  for (const [x, y] of desna ? DUGMAD : []) {
    saSenkom(7, 3, 4, 0.28, () => {
      ctx.beginPath();
      ctx.arc(px(x), py(y), 0.036 * s, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // prošiveni prednji rub i porub
  stepLinija(ctx, 2.4, 12);
  ctx.beginPath();
  ctx.moveTo(px(KROJ.prednja - 0.04), py(KROJ.prelom - 0.02));
  ctx.lineTo(px(KROJ.prednja - 0.015), py(KROJ.dno + 0.06));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px(KROJ.bokDole + 0.02), py(KROJ.dno + 0.08));
  ctx.lineTo(px(KROJ.prednja + 0.01), py(KROJ.dno + 0.08));
  ctx.stroke();

  return tekstura(c);
}

/** Rever: šav uz spoljnu ivicu. */
export function teksturaRevera() {
  const O = OKVIR_REVERA;
  const s = 512 / (O.x1 - O.x0);
  const { c, ctx } = platno(512, Math.round((O.y1 - O.y0) * s));
  const px = (x: number) => (x - O.x0) * s;
  const py = (y: number) => (O.y1 - y) * s;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
  stepLinija(ctx, 2.2, 11);
  ctx.beginPath();
  ctx.moveTo(px(KROJ.prednja - 0.015), py(KROJ.prelom + 0.07));
  ctx.lineTo(px(KROJ.reverVrh[0] + 0.045), py(KROJ.reverVrh[1] - 0.005));
  ctx.lineTo(px(KROJ.zarez[0] + 0.035), py(KROJ.zarez[1] - 0.02));
  ctx.stroke();
  return tekstura(c);
}

/** Džep: šav sa strana i dna, dvostruki šav na porubu otvora. */
export function teksturaDzepa() {
  const { c, ctx } = platno(512, 512);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 512);
  // senka u otvoru džepa
  const otvor = ctx.createLinearGradient(0, 0, 0, 26);
  otvor.addColorStop(0, "rgba(40, 64, 110, 0.22)");
  otvor.addColorStop(1, "rgba(40, 64, 110, 0)");
  ctx.fillStyle = otvor;
  ctx.fillRect(0, 0, 512, 26);
  stepLinija(ctx, 3, 14);
  ctx.beginPath();
  ctx.moveTo(26, 58);
  ctx.lineTo(26, 470);
  ctx.quadraticCurveTo(26, 486, 60, 486);
  ctx.lineTo(452, 486);
  ctx.quadraticCurveTo(486, 486, 486, 470);
  ctx.lineTo(486, 58);
  ctx.stroke();
  for (const y of [44, 70]) {
    ctx.beginPath();
    ctx.moveTo(18, y);
    ctx.lineTo(494, y);
    ctx.stroke();
  }
  return tekstura(c);
}

/** Rukav: dvostruki šav na manžetni. */
export function teksturaRukava() {
  const { c, ctx } = platno(512, 1024);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 512, 1024);
  stepLinija(ctx, 2.6, 12);
  for (const y of [918, 952]) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }
  return tekstura(c);
}

/** Kragna: šav uz spoljnu ivicu. */
export function teksturaKragne() {
  const { c, ctx } = platno(1024, 128);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1024, 128);
  stepLinija(ctx, 2.4, 12);
  ctx.beginPath();
  ctx.moveTo(10, 108);
  ctx.lineTo(1014, 108);
  ctx.stroke();
  return tekstura(c);
}

/**
 * Sitno tkanje kao mapa normala: tkanina tako hvata svetlo kao platno, a ne
 * kao plastika. Ponavlja se preko celog dela.
 */
export function teksturaTkanja() {
  const n = 128;
  const { c, ctx } = platno(n, n);
  const visina = new Float32Array(n * n);
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      const osnova = Math.sin((x / n) * Math.PI * 32) * Math.sin((y / n) * Math.PI * 32);
      const kosina = Math.sin(((x + y) / n) * Math.PI * 16);
      visina[y * n + x] = 0.5 + 0.35 * osnova + 0.15 * kosina;
    }
  }
  const slika = ctx.createImageData(n, n);
  const h = (x: number, y: number) => visina[((y + n) % n) * n + ((x + n) % n)];
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      const dx = (h(x - 1, y) - h(x + 1, y)) * 1.4;
      const dy = (h(x, y + 1) - h(x, y - 1)) * 1.4;
      const d = Math.hypot(dx, dy, 1);
      const k = 4 * (y * n + x);
      slika.data[k] = ((dx / d) * 0.5 + 0.5) * 255;
      slika.data[k + 1] = ((dy / d) * 0.5 + 0.5) * 255;
      slika.data[k + 2] = ((1 / d) * 0.5 + 0.5) * 255;
      slika.data[k + 3] = 255;
    }
  }
  ctx.putImageData(slika, 0, 0);
  const t = tekstura(c, false);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Plava tkana traka sa natpisom DentifID koji se ponavlja. */
export function teksturaTrake() {
  const { c, ctx } = platno(1024, 96);
  const preliv = ctx.createLinearGradient(0, 0, 0, 96);
  preliv.addColorStop(0, "#2a7bf4");
  preliv.addColorStop(0.5, "#1461de");
  preliv.addColorStop(1, "#0d4fc0");
  ctx.fillStyle = preliv;
  ctx.fillRect(0, 0, 1024, 96);
  // tkani rubovi
  ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
  ctx.fillRect(0, 6, 1024, 3);
  ctx.fillRect(0, 87, 1024, 3);
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.font = "700 40px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let x = 128; x < 1024; x += 256) {
    ctx.fillText("DentifID", x, 50);
  }
  const t = tekstura(c);
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

/** Meka senka na podu ispod mantila. */
export function teksturaSenke() {
  const { c, ctx } = platno(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(14, 42, 92, 0.55)");
  g.addColorStop(0.45, "rgba(14, 42, 92, 0.22)");
  g.addColorStop(1, "rgba(14, 42, 92, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return tekstura(c);
}

/** Tamnoplava bluza sa rebrastim rubom oko izreza. */
export function teksturaBluze() {
  const { c, ctx } = platno(512, 512);
  const osnova = ctx.createLinearGradient(0, 0, 0, 512);
  osnova.addColorStop(0, "#27447a");
  osnova.addColorStop(1, "#1d3563");
  ctx.fillStyle = osnova;
  ctx.fillRect(0, 0, 512, 512);
  // rebrasti rub izreza: gornjih 0,055 jedinica od ukupno 1,5
  const rub = Math.round((0.055 / 1.5) * 512);
  ctx.fillStyle = "#1a2f59";
  ctx.fillRect(0, 0, 512, rub);
  ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
  for (let x = 0; x < 512; x += 4) ctx.fillRect(x, 0, 1.5, rub);
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fillRect(0, rub, 512, 2);
  return tekstura(c);
}

/**
 * Unutrašnjost oko vrata: dole zadnji deo bluze sa rebrastim rubom, gore
 * unutrašnja strana kragne. Sve je malo tamnije, jer je u senci.
 */
export function teksturaUnutrasnjosti() {
  const W = 512;
  const H = 256;
  const { c, ctx } = platno(W, H);
  // v ide od y 1,42 (dole) do 1,97 (gore); na platnu je gore y 1,97
  const py = (y: number) => ((1.97 - y) / 0.55) * H;

  const bluza = ctx.createLinearGradient(0, py(1.72), 0, H);
  bluza.addColorStop(0, "#1f3a6c");
  bluza.addColorStop(1, "#11213f");
  ctx.fillStyle = bluza;
  ctx.fillRect(0, py(1.72), W, H - py(1.72));

  ctx.fillStyle = "#18305c";
  ctx.fillRect(0, py(1.745), W, py(1.705) - py(1.745));
  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  for (let x = 0; x < W; x += 4) ctx.fillRect(x, py(1.745), 1.5, py(1.705) - py(1.745));

  const kragna = ctx.createLinearGradient(0, 0, 0, py(1.745));
  kragna.addColorStop(0, "#f4f7fb");
  kragna.addColorStop(1, "#d9e1ec");
  ctx.fillStyle = kragna;
  ctx.fillRect(0, 0, W, py(1.745));

  stepLinija(ctx, 2, 10);
  ctx.beginPath();
  ctx.moveTo(0, py(1.93));
  ctx.lineTo(W, py(1.93));
  ctx.stroke();

  // bočni delovi su dublje u senci
  const strane = ctx.createLinearGradient(0, 0, W, 0);
  strane.addColorStop(0, "rgba(10, 24, 50, 0.3)");
  strane.addColorStop(0.25, "rgba(10, 24, 50, 0)");
  strane.addColorStop(0.75, "rgba(10, 24, 50, 0)");
  strane.addColorStop(1, "rgba(10, 24, 50, 0.3)");
  ctx.fillStyle = strane;
  ctx.fillRect(0, 0, W, H);
  return tekstura(c);
}
