"""Pravi QR kod za stranu preuzimanja.

QR vodi na stranu sa uputstvom, ne pravo na fajl — tako korisnik prvo vidi
uputstvo, a adresa fajla može da se menja bez novog koda.

Upotreba:
    python alati/napravi-qr.py                       # podrazumevana adresa
    python alati/napravi-qr.py https://drugi.rs/...  # druga adresa
    python alati/napravi-qr.py https://... qr-iphone.png  # drugi fajl
"""

import sys
from pathlib import Path

import qrcode

ADRESA = "https://dentifid.rs/#preuzimanje"


def main() -> int:
    adresa = sys.argv[1] if len(sys.argv) > 1 else ADRESA
    ime = sys.argv[2] if len(sys.argv) > 2 else "qr.png"

    kod = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=3,
    )
    kod.add_data(adresa)
    kod.make(fit=True)

    # Bez naknadnog skaliranja: modul mora da ostane ostar, inace citaci grese.
    slika = kod.make_image(fill_color="#2d3436", back_color="white").convert("RGB")
    putanja = Path(__file__).resolve().parent.parent / "web" / "public" / "img" / ime
    slika.save(putanja, optimize=True)

    print(
        f"{putanja.name}: {adresa}  {slika.width}x{slika.height}  "
        f"({putanja.stat().st_size / 1024:.1f} KB)"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
