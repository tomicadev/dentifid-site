import Hero from "@/components/hero/Hero";
import KakoRadi from "@/components/sections/KakoRadi";
import VilicaSekcija from "@/components/sections/VilicaSekcija";
import ProcenaSekcija from "@/components/sections/ProcenaSekcija";
import AplikacijaSekcija from "@/components/sections/AplikacijaSekcija";
import NijeDijagnoza from "@/components/sections/NijeDijagnoza";
import Mogucnosti from "@/components/sections/Mogucnosti";
import TemeSekcija from "@/components/sections/TemeSekcija";
import Preuzimanje from "@/components/sections/Preuzimanje";
import Kontakt from "@/components/sections/Kontakt";

export default function Pocetna() {
  return (
    <>
      <Hero />
      <KakoRadi />
      <VilicaSekcija />
      <ProcenaSekcija />
      <AplikacijaSekcija />
      <NijeDijagnoza />
      <Mogucnosti />
      <TemeSekcija />
      <Preuzimanje />
      <Kontakt />
    </>
  );
}
