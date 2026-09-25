type Props = {
  className?: string;
};

/** Zraci oko sijalice: od gore levo do gore desno, oko vrha zuba. */
const ZRACI = [-165, -140, -115, -90, -65, -40, -15].map((ugao) => {
  const a = (ugao * Math.PI) / 180;
  const k = (v: number) => Number(v.toFixed(1));
  return {
    x1: k(160 + Math.cos(a) * 122),
    y1: k(138 + Math.sin(a) * 122),
    x2: k(160 + Math.cos(a) * 146),
    y2: k(138 + Math.sin(a) * 146),
  };
});

/** Četvorokraka iskrica sa povijenim kracima. */
function iskra(x: number, y: number, r: number) {
  return `M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z`;
}

const ISKRE = [
  { x: 60, y: 92, r: 10 },
  { x: 266, y: 70, r: 8 },
  { x: 282, y: 196, r: 11 },
  { x: 40, y: 206, r: 7 },
  { x: 236, y: 28, r: 6 },
];

/**
 * Ideja kao sijalica u obliku zuba: staklo je kruna sa dve kvržice koja se
 * sužava u grlo sijalice, a unutra svetli nit. Oko nje trepere zraci i iskrice.
 */
export default function SijalicaZub({ className }: Props) {
  // strana ima jednu sijalicu, pa su oznake prelaza stalne
  const id = "sijalica";
  return (
    <svg className={className} viewBox="0 0 320 360" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-sjaj`} cx="50%" cy="40%" r="50%">
          <stop offset="0" stopColor="#00d4ff" stopOpacity="0.32" />
          <stop offset="0.55" stopColor="#2e90ff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#2e90ff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-staklo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dcebff" />
        </linearGradient>
        <linearGradient id={`${id}-ivica`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0e62e0" />
          <stop offset="0.6" stopColor="#2e90ff" />
          <stop offset="1" stopColor="#00d4ff" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a9b7cc" />
          <stop offset="0.45" stopColor="#f1f4f9" />
          <stop offset="1" stopColor="#8f9fb6" />
        </linearGradient>
        <filter id={`${id}-zar`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <circle cx="160" cy="146" r="150" fill={`url(#${id}-sjaj)`} />

      <g data-deo="zraci" stroke={`url(#${id}-ivica)`} strokeWidth="6" strokeLinecap="round">
        {ZRACI.map((z, i) => (
          <line key={i} {...z} />
        ))}
      </g>

      {/* staklo: kruna zuba sa dve kvržice, koja se sužava u grlo sijalice */}
      <path
        d="M132 232 C118 206 96 182 94 142 C92 102 112 76 136 80 C146 82 152 92 160 92 C168 92 174 82 184 80 C208 76 228 102 226 142 C224 182 202 206 188 232 Z"
        fill={`url(#${id}-staklo)`}
        stroke={`url(#${id}-ivica)`}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M110 118 C108 100 118 88 132 88" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" />

      {/* nit: dva nosača i mala petlja koja svetli */}
      <path d="M144 232 V186 M176 232 V186" stroke="#8ea3bf" strokeWidth="3" strokeLinecap="round" />
      <path
        data-deo="zar"
        d="M144 186 C144 164 154 156 160 170 C166 156 176 164 176 186"
        fill="none"
        stroke="#00d4ff"
        strokeWidth="9"
        strokeLinecap="round"
        filter={`url(#${id}-zar)`}
      />
      <path
        d="M144 186 C144 164 154 156 160 170 C166 156 176 164 176 186"
        fill="none"
        stroke="#0e62e0"
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* grlo sa navojem i kontakt */}
      <rect x="126" y="232" width="68" height="15" rx="7.5" fill={`url(#${id}-metal)`} />
      <rect x="130" y="249" width="60" height="13" rx="6.5" fill={`url(#${id}-metal)`} />
      <rect x="134" y="264" width="52" height="13" rx="6.5" fill={`url(#${id}-metal)`} />
      <path d="M146 279 H174 L168 293 H152 Z" fill="#5d6f88" />

      <ellipse cx="160" cy="330" rx="64" ry="9" fill="#0e2a5c" opacity="0.08" />

      <g data-deo="iskre" fill={`url(#${id}-ivica)`}>
        {ISKRE.map((s, i) => (
          <path key={i} d={iskra(s.x, s.y, s.r)} />
        ))}
      </g>
    </svg>
  );
}
