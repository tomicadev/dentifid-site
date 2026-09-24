import { useId } from "react";

type Props = {
  boja: string;
  pasta?: boolean;
  className?: string;
};

/**
 * Mala četkica za zube od providne plastike, istim postupkom kao zaglavlje:
 * matirano telo, boja jača uz donju ivicu i odsjaji iz filtera nad oblikom.
 * Glava je desno.
 */
export default function Cetkica3D({ boja, pasta = false, className }: Props) {
  const id = useId().replace(/:/g, "");
  const W = 260;
  const y0 = 44;
  const bw = 72;
  const hb = 22;
  const tl = 22;
  const hn = 12;
  const hw = 88;
  const hh = 18;
  const rb = hb / 2;
  const rh = hh / 2;
  const vratPocetak = bw + tl;
  const glavaPocetak = W - hw;
  const vratKraj = glavaPocetak - tl;
  const g = (h: number) => y0 - h / 2;
  const d = (h: number) => y0 + h / 2;

  const telo = [
    `M${rb},${g(hb)}`,
    `L${bw - 4},${g(hb)}`,
    `C${bw + tl * 0.45},${g(hb)} ${vratPocetak - tl * 0.45},${g(hn)} ${vratPocetak},${g(hn)}`,
    `L${vratKraj},${g(hn)}`,
    `C${vratKraj + tl * 0.5},${g(hn)} ${glavaPocetak - tl * 0.35},${g(hh)} ${glavaPocetak + 3},${g(hh)}`,
    `L${W - rh},${g(hh)}`,
    `A${rh},${rh} 0 0 1 ${W - rh},${d(hh)}`,
    `L${glavaPocetak + 3},${d(hh)}`,
    `C${glavaPocetak - tl * 0.35},${d(hh)} ${vratKraj + tl * 0.5},${d(hn)} ${vratKraj},${d(hn)}`,
    `L${vratPocetak},${d(hn)}`,
    `C${vratPocetak - tl * 0.45},${d(hn)} ${bw + tl * 0.45},${d(hb)} ${bw - 4},${d(hb)}`,
    `L${rb},${d(hb)}`,
    `A${rb},${rb} 0 0 1 ${rb},${g(hb)}`,
    "Z",
  ].join(" ");

  const cuperci = Array.from({ length: 9 }, (_, i) => {
    const x = glavaPocetak + 8 + i * 8.2;
    const visina = 11 - ((i * 7) % 3);
    return { x, y: g(hh) - visina, visina: visina + 3, svetao: i % 2 === 0 };
  });

  return (
    <svg className={className} viewBox={`0 0 ${W} 64`} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-obris`}>
          <path d={telo} />
        </clipPath>
        {/* matirano telo: gore skoro belo, dole propušta boju */}
        <linearGradient id={`${id}-telo`} gradientUnits="userSpaceOnUse" x1="0" y1={g(hb)} x2="0" y2={d(hb)}>
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="0.5" stopColor="#f4f8ff" stopOpacity="0.74" />
          <stop offset="1" stopColor={boja} stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id={`${id}-ton-prelaz`} gradientUnits="userSpaceOnUse" x1="0" y1={g(hb)} x2="0" y2={d(hb)}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${id}-ton-maska`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height="64">
          <rect width={W} height="64" fill={`url(#${id}-ton-prelaz)`} />
        </mask>
        <filter id={`${id}-meko`} x="-3%" y="-50%" width="106%" height="200%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <filter id={`${id}-svetlo`} x="-3%" y="-50%" width="106%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="telo" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.8" result="oblo" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="ivica" />
          <feDiffuseLighting in="telo" surfaceScale="4" diffuseConstant="1" lightingColor="#fff" result="osvetljenje">
            <feDistantLight azimuth="258" elevation="50" />
          </feDiffuseLighting>
          <feColorMatrix
            in="osvetljenje"
            type="matrix"
            values="0 0 0 0 0.04  0 0 0 0 0.16  0 0 0 0 0.42  -0.9 0 0 0 0.69"
            result="senkaOblika"
          />
          <feSpecularLighting in="oblo" surfaceScale="3" specularConstant="1.3" specularExponent="50" lightingColor="#fff" result="gore">
            <feDistantLight azimuth="258" elevation="50" />
          </feSpecularLighting>
          <feSpecularLighting in="ivica" surfaceScale="1.4" specularConstant="1.2" specularExponent="40" lightingColor="#fff" result="goreTanko">
            <feDistantLight azimuth="258" elevation="35" />
          </feSpecularLighting>
          <feSpecularLighting in="ivica" surfaceScale="1.4" specularConstant="0.9" specularExponent="40" lightingColor="#e6f3ff" result="doleTanko">
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
        <linearGradient id={`${id}-bela`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#d6e8fb" />
        </linearGradient>
        <linearGradient id={`${id}-plava`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9f1ff" />
          <stop offset="1" stopColor="#6cc4f2" />
        </linearGradient>
      </defs>

      {cuperci.map((c) => (
        <rect
          key={c.x}
          x={c.x}
          y={c.y}
          width={6}
          height={c.visina}
          rx={3}
          fill={c.svetao ? `url(#${id}-bela)` : `url(#${id}-plava)`}
        />
      ))}

      {pasta ? (
        <path
          d={`M${glavaPocetak + 10} ${g(hh) - 10} c2 -7 9 -9 14 -6 c4 -6 13 -6 17 -1 c4 -6 13 -6 17 0 c6 -3 13 0 13 6 c0 5 -4 7 -9 7 h-46 c-4 0 -7 -3 -6 -6 z`}
          fill="#fff"
          stroke="#9cc4f0"
          strokeWidth="0.8"
        />
      ) : null}

      <path d={telo} fill={`url(#${id}-telo)`} />
      <g clipPath={`url(#${id}-obris)`}>
        <path
          d={telo}
          fill="none"
          stroke={boja}
          strokeWidth="6"
          opacity="0.7"
          filter={`url(#${id}-meko)`}
          mask={`url(#${id}-ton-maska)`}
        />
      </g>
      <path d={telo} fill="#000" filter={`url(#${id}-svetlo)`} />
      <rect
        x={10}
        y={y0 - 5}
        width={bw - 22}
        height={10}
        rx={5}
        fill="#fff"
        stroke="#fff"
        strokeOpacity="0.9"
        strokeWidth="0.6"
      />
    </svg>
  );
}
