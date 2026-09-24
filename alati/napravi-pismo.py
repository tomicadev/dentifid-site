"""Pravi lokalni podskup pisma Inter za sajt.

Izvorni fajl je promenljivi Inter iz google/fonts:
https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf

Izlaz je jedan promenljivi `woff2` sa opsegom težina 400–700 i prikovanom
optičkom veličinom. Jedan zahtev nosi sve četiri težine koje sajt koristi i
staje u oko 80 KB; četiri statične težine bile bi 200 KB u četiri zahteva.

Podskup se radi pre instanciranja — obrnutim redom fontTools pada na tabeli
`gvar`.

Upotreba:  python alati/napravi-pismo.py putanja/do/Inter.ttf
"""

import sys
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

# Latin-ext je obavezan: bez njega nema č, ć, š, ž, đ. Uz njega idu i
# tipografski navodnici, crte i tačka-razdelnik koje sajt koristi u tekstu.
OPSEZI = [
    (0x0020, 0x007E),  # osnovna latinica
    (0x00A0, 0x00FF),  # latinica 1, tu su · × i nedeljivi razmak
    (0x0100, 0x017F),  # latin-ext A: čćšžđ ČĆŠŽĐ
    (0x2013, 0x2014),  # – —
    (0x2018, 0x201E),  # ‘ ’ „ “ ”
    (0x2022, 0x2022),  # •
    (0x2026, 0x2026),  # …
    (0x2190, 0x2193),  # ← ↑ → ↓
    (0x2212, 0x2212),  # minus
]

PROVERA = "čćšžđČĆŠŽĐ„“–—·…→"

IZLAZ = "inter-400-700.woff2"


def main() -> int:
    izvor = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("Inter.ttf")
    if not izvor.exists():
        print(f"Nema izvornog pisma: {izvor}")
        return 1

    odrediste = Path(__file__).resolve().parent.parent / "sajt" / "fonts"
    odrediste.mkdir(parents=True, exist_ok=True)

    font = TTFont(izvor)

    opcije = Options()
    opcije.flavor = "woff2"
    opcije.layout_features = ["kern", "liga", "calt", "tnum"]
    opcije.name_IDs = [1, 2, 3, 4, 6]
    # Hinting preskacu svi pregledaci koje ovaj sajt cilja.
    opcije.hinting = False

    podskup = Subsetter(options=opcije)
    podskup.populate(unicodes=[t for pocetak, kraj in OPSEZI for t in range(pocetak, kraj + 1)])
    podskup.subset(font)

    instantiateVariableFont(
        font, {"wght": (400, 700), "opsz": 16}, inplace=True, updateFontNames=True
    )

    cmap = font.getBestCmap()
    nedostaje = [z for z in PROVERA if ord(z) not in cmap]
    if nedostaje:
        print(f"Nedostaju znaci: {''.join(nedostaje)}")
        return 1

    putanja = odrediste / IZLAZ
    font.save(putanja)
    print(f"{putanja.name:22} {putanja.stat().st_size / 1024:6.1f} KB  glifova: {len(cmap)}")
    print("ose:", [(a.axisTag, a.minValue, a.maxValue) for a in font["fvar"].axes])
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
