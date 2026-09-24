import type { ReactNode } from "react";
import Link from "next/link";
import stil from "./Dugme.module.css";

type Vrsta = "glavno" | "sporedno" | "tiho";
type Velicina = "sitno" | "normalno" | "veliko";

type Osnovno = {
  children: ReactNode;
  vrsta?: Vrsta;
  velicina?: Velicina;
  ikona?: ReactNode;
  className?: string;
};

type Props = Osnovno &
  (
    | { href: string; onClick?: never; disabled?: never; tip?: never }
    | { href?: never; onClick?: () => void; disabled?: boolean; tip?: "button" | "submit" }
  );

export default function Dugme({
  children,
  vrsta = "glavno",
  velicina = "normalno",
  ikona,
  className,
  href,
  onClick,
  disabled,
  tip = "button",
}: Props) {
  const klase = [
    stil.dugme,
    stil[vrsta],
    velicina !== "normalno" ? stil[velicina] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const sadrzaj = (
    <>
      {ikona ? (
        <span className={stil.ikona} aria-hidden="true">
          {ikona}
        </span>
      ) : null}
      <span>{children}</span>
    </>
  );

  if (href) {
    // Spoljne adrese, mejl i telefon idu kao obična veza, bez Next.js navigacije.
    const spoljna = /^(https?:|mailto:|tel:)/.test(href);
    if (spoljna) {
      return (
        <a className={klase} href={href} rel={href.startsWith("http") ? "noopener" : undefined}>
          {sadrzaj}
        </a>
      );
    }
    return (
      <Link className={klase} href={href}>
        {sadrzaj}
      </Link>
    );
  }

  return (
    <button className={klase} type={tip} onClick={onClick} disabled={disabled}>
      {sadrzaj}
    </button>
  );
}
