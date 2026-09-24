/**
 * Znaci crtani u istoj liniji: 24×24, potez 1.6, zaobljeni krajevi.
 * Sve što nosi značenje ima `aria-hidden`, jer uz njih uvek stoji tekst.
 */

type Props = { className?: string };

const osnovno = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function Android({ className }: Props) {
  // Glava Android robota: jasno se čita i na 16 px, za razliku od celog robota.
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.6 9.48 19.44 6.3a.38.38 0 0 0-.66-.38l-1.87 3.23a11.43 11.43 0 0 0-9.82 0L5.22 5.92a.38.38 0 1 0-.66.38L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52ZM7 15.25a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 7 15.25Zm10 0A1.25 1.25 0 1 1 18.25 14 1.25 1.25 0 0 1 17 15.25Z" />
    </svg>
  );
}

export function Apple({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.1 12.6c0-2 1.6-3 1.7-3.1-.9-1.4-2.4-1.5-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2.1 2.5 2 1 0 1.4-.6 2.6-.6s1.5.6 2.6.6c1.1 0 1.8-1 2.4-2 .8-1.1 1.1-2.2 1.1-2.3 0 0-2.1-.8-2.1-3ZM14.3 6.6c.5-.7.9-1.6.8-2.6-.8 0-1.8.5-2.4 1.2-.5.6-1 1.6-.8 2.5.9.1 1.8-.4 2.4-1.1Z" />
    </svg>
  );
}

export function Upitnik({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <rect x="4.2" y="3.2" width="15.6" height="17.6" rx="3" />
      <path d="M9.6 9.2a2.4 2.4 0 1 1 3.2 2.3c-.6.2-1 .8-1 1.5v.4" />
      <path d="M11.8 16.6h.01" />
    </svg>
  );
}

export function VilicaZnak({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M3.6 16.4C3.2 12 5.4 6.8 12 6.8s8.8 5.2 8.4 9.6" />
      <path d="M6.3 16.8c.2-2.7 1.9-5.4 5.7-5.4s5.5 2.7 5.7 5.4" />
      <path d="M12 6.8v4.6" />
    </svg>
  );
}

export function Prsten({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M20.2 15.4a9 9 0 1 0-16.4 0" />
      <path d="M12 12.6 16.2 9" />
      <circle cx="12" cy="13.2" r="1.3" />
    </svg>
  );
}

export function Dete({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <circle cx="9" cy="7.6" r="3.1" />
      <path d="M3.4 19.4c0-3 2.5-5.2 5.6-5.2s5.6 2.2 5.6 5.2" />
      <circle cx="17.4" cy="6.1" r="2" />
      <path d="M16 12.1c1.9 0 3.4 1.3 3.4 3" />
    </svg>
  );
}

export function Istorija({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M3.6 12a8.4 8.4 0 1 0 2.5-6" />
      <path d="M3.4 3.6v3.2h3.2" />
      <path d="M12 7.6V12l2.9 1.9" />
    </svg>
  );
}

export function Karton({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <rect x="4.6" y="4.4" width="14.8" height="16" rx="2.6" />
      <path d="M9.2 2.8h5.6v3.2H9.2z" />
      <path d="M8.6 11.4h6.8M8.6 15h4.4" />
    </svg>
  );
}

export function Zvono({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M6.4 10a5.6 5.6 0 0 1 11.2 0c0 4.2 1.5 5.7 1.5 5.7H4.9s1.5-1.5 1.5-5.7Z" />
      <path d="M10 18.7a2.2 2.2 0 0 0 4 0" />
    </svg>
  );
}

export function Zub({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M12 3.6c-1.4 0-2.3 1-4 .8-2.2-.3-3.6 1.4-3.6 3.8 0 2 .6 3.3 1 4.6.5 2 1 4.8 1.9 6.2.5.9 1.6.8 2-.2.7-1.6 1.2-3.7 1.9-4.4.4-.4 1.2-.4 1.6 0 .7.7 1.2 2.8 1.9 4.4.4 1 1.5 1.1 2 .2.9-1.4 1.4-4.2 1.9-6.2.4-1.3 1-2.6 1-4.6 0-2.4-1.4-4.1-3.6-3.8-1.7.2-2.6-.8-4-.8Z" />
    </svg>
  );
}

export function Tema({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 3.8a8.2 8.2 0 0 1 0 16.4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Pazljivo({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M12 4.4 3.6 19.2h16.8L12 4.4Z" />
      <path d="M12 10.2v3.6M12 16.6h.01" />
    </svg>
  );
}

export function Strelica({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M4.8 12h14.4M13.6 6.4 19.2 12l-5.6 5.6" />
    </svg>
  );
}

export function Kvacica({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M4.8 12.6 9.6 17.4 19.2 6.6" />
    </svg>
  );
}

export function Stit({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M12 3.2 5 5.8v5.4c0 4.2 2.9 7.6 7 9.6 4.1-2 7-5.4 7-9.6V5.8L12 3.2Z" />
      <path d="M9.2 12.1 11.3 14.2 15 10.5" />
    </svg>
  );
}

export function Prst({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M10.4 11.6V5.9a1.7 1.7 0 0 1 3.4 0v6.6" />
      <path d="M13.8 10.6a1.6 1.6 0 0 1 3.2 0v1.4" />
      <path d="M17 11.6a1.6 1.6 0 0 1 3.2 0v3.2c0 3.2-2.3 5.8-5.6 5.8h-1.2c-2 0-3.2-.8-4.3-2.3l-2.6-3.6a1.6 1.6 0 0 1 2.4-2.1l1.5 1.5" />
    </svg>
  );
}

export function Poruka({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <path d="M4.4 6.6a2.6 2.6 0 0 1 2.6-2.6h10a2.6 2.6 0 0 1 2.6 2.6v7a2.6 2.6 0 0 1-2.6 2.6h-5.2l-4 3.4v-3.4H7a2.6 2.6 0 0 1-2.6-2.6v-7Z" />
      <path d="M8.6 9.2h6.8M8.6 12.2h4.2" />
    </svg>
  );
}

export function Koverta({ className }: Props) {
  return (
    <svg className={className} {...osnovno}>
      <rect x="3.4" y="5.4" width="17.2" height="13.2" rx="2.4" />
      <path d="m4.2 7 7.8 5.8L19.8 7" />
    </svg>
  );
}
