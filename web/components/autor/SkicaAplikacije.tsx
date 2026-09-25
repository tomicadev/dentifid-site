type Props = {
  className?: string;
};

/**
 * Nacrt aplikacije tankim linijama, kao skica na stolu dizajnera: telefon sa
 * ekranom upitnika, pomoćne linije, mere i numerisane napomene. Stoji iza
 * teksta o ulozi u aplikaciji, providno.
 */
export default function SkicaAplikacije({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 600 620" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* krug za šestar i pomoćne linije */}
        <circle cx="300" cy="300" r="270" strokeDasharray="3 9" />
        <circle cx="300" cy="300" r="214" strokeDasharray="1 7" />
        <path d="M30 40 H570 M30 560 H570 M205 10 V610 M395 10 V610" strokeDasharray="2 8" />

        {/* telefon */}
        <rect x="205" y="40" width="190" height="520" rx="34" strokeWidth="2.4" />
        <rect x="219" y="58" width="162" height="484" rx="22" />
        <rect x="278" y="66" width="44" height="10" rx="5" />

        {/* ekran upitnika */}
        <path d="M290 110 c-10 0 -16 8 -16 18 c0 12 6 28 12 28 c4 0 5 -9 8 -9 s4 9 8 9 c6 0 12 -16 12 -28 c0 -10 -6 -18 -16 -18 c-3 0 -5 2 -8 2 s-5 -2 -8 -2 z" />
        <path d="M240 186 H360 M252 204 H348" />
        <rect x="240" y="226" width="120" height="8" rx="4" />
        <rect x="240" y="226" width="54" height="8" rx="4" strokeWidth="2.6" />
        {[256, 314, 372].map((y) => (
          <g key={y}>
            <rect x="238" y={y} width="124" height="44" rx="12" />
            <circle cx="258" cy={y + 22} r="7" />
            <path d={`M274 ${y + 17} H340 M274 ${y + 28} H320`} />
          </g>
        ))}
        <rect x="238" y="470" width="124" height="40" rx="20" strokeWidth="2.4" />
        <path d="M284 490 H316 M308 483 L316 490 L308 497" />

        {/* mere */}
        <path d="M168 40 V560 M162 40 H174 M162 560 H174" />
        <path d="M205 590 H395 M205 584 V596 M395 584 V596" />

        {/* napomene */}
        <path d="M362 126 C420 118 452 102 470 84" />
        <circle cx="480" cy="76" r="14" />
        <path d="M362 278 C430 280 466 262 486 236" />
        <circle cx="494" cy="224" r="14" />
        <path d="M238 490 C176 492 140 470 118 440" />
        <circle cx="108" cy="428" r="14" />
      </g>
      <g fill="currentColor" fontFamily="Inter, system-ui, sans-serif" fontSize="15" fontWeight="600" textAnchor="middle">
        <text x="480" y="81">1</text>
        <text x="494" y="229">2</text>
        <text x="108" y="433">3</text>
      </g>
    </svg>
  );
}
