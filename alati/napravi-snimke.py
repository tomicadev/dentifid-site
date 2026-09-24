"""Pretvara snimke ekrana iz `materijal/snimci/` u `.webp` za sajt.

Svaki snimak se pravi u dve širine, 540 i 1080, za `srcset`. Statusna traka na
vrhu se ne seče — ona slici daje razmeru.

Podrazumevano se prave samo snimci koje sajt stvarno prikazuje. Ako zatreba
neki drugi, ime se doda kao argument:

    python alati/napravi-snimke.py                     # samo oni koji se koriste
    python alati/napravi-snimke.py 05-karton 06-saveti # i ovi
    python alati/napravi-snimke.py sve                 # svi iz foldera
"""

import sys
from pathlib import Path

from PIL import Image

SIRINE = (540, 1080)
KVALITET = {540: 82, 1080: 80}

# Snimci koje sajt trenutno prikazuje.
U_UPOTREBI = ["02-pitanje", "03-vilica", "04-rezultat", "10-tamna-tema-saveti"]


def main() -> int:
    koren = Path(__file__).resolve().parent.parent
    izvor = koren / "materijal" / "snimci"
    odrediste = koren / "sajt" / "img"
    odrediste.mkdir(parents=True, exist_ok=True)

    argumenti = sys.argv[1:]
    if argumenti == ["sve"]:
        imena = sorted(p.stem for p in izvor.glob("*.jpg"))
    else:
        imena = U_UPOTREBI + [a for a in argumenti if a not in U_UPOTREBI]

    ukupno = 0
    for ime in imena:
        put = izvor / f"{ime}.jpg"
        if not put.exists():
            print(f"Nema snimka: {put.name}")
            return 1

        slika = Image.open(put).convert("RGB")
        for sirina in SIRINE:
            visina = round(slika.height * sirina / slika.width)
            umanjena = slika.resize((sirina, visina), Image.LANCZOS)
            izlaz = odrediste / f"{ime}-{sirina}.webp"
            umanjena.save(izlaz, "WEBP", quality=KVALITET[sirina], method=6)
            velicina = izlaz.stat().st_size / 1024
            ukupno += velicina
            print(f"{izlaz.name:34} {sirina}x{visina}  {velicina:6.1f} KB")

    print(f"\nUkupno: {ukupno:.0f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
