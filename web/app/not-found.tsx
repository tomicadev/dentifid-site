import Dugme from "@/components/ui/Dugme";

export default function NijeNadjeno() {
  return (
    <section className="sekcija" style={{ paddingBlock: "clamp(9rem, 16vw, 13rem)" }}>
      <div className="okvir" style={{ display: "grid", gap: "var(--r5)", justifyItems: "start" }}>
        <p className="nadnaslov">Greška 404</p>
        <h1>Ove strane nema</h1>
        <p className="uvod">
          Adresa je verovatno pogrešno prepisana ili strana više ne postoji. Sve što sajt
          nudi stoji na početnoj.
        </p>
        <Dugme href="/">Idite na početnu</Dugme>
      </div>
    </section>
  );
}
