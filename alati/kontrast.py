"""Meri odnos kontrasta za parove boja koje sajt stvarno koristi.

Vrednosti su iz `materijal/02-dizajn.md`. Prag je 4,5:1 za običan tekst i 3:1
za veliki (24 px i više, ili 18,66 px podebljano) i za granice kontrola.

Upotreba:  python alati/kontrast.py
"""


def kanal(v: float) -> float:
    v = v / 255
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def svetlina(boja: str) -> float:
    boja = boja.lstrip("#")
    r, g, b = (int(boja[i : i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b)


def odnos(prva: str, druga: str) -> float:
    a, b = svetlina(prva), svetlina(druga)
    svetlija, tamnija = max(a, b), min(a, b)
    return (svetlija + 0.05) / (tamnija + 0.05)


# opis, boja teksta, podloga, traženi prag
PAROVI = [
    ("tekst na pozadini strane", "#2d3436", "#f5f7fa", 4.5),
    ("tekst na kartici", "#2d3436", "#ffffff", 4.5),
    ("prigušen tekst na pozadini", "#5d6874", "#f5f7fa", 4.5),
    ("prigušen tekst na kartici", "#5d6874", "#ffffff", 4.5),
    ("prigušen tekst na plavoj traci", "#545f6b", "#d3e4fa", 4.5),
    ("plavi tekst na kartici", "#006be0", "#ffffff", 4.5),
    ("plavi tekst na pozadini", "#006be0", "#f5f7fa", 4.5),
    ("plavi tekst na blagoj podlozi (značke)", "#005ec6", "#e0e7ff", 4.5),
    ("belo na glavnom dugmetu", "#ffffff", "#0e62e0", 4.5),
    ("belo na desnom kraju gradijenta", "#ffffff", "#1069e8", 4.5),
    ("crveni broj 194 na crvenoj podlozi", "#dd0c00", "#fff3f2", 4.5),
    ("tekst u napomeni na blagoj podlozi", "#2d3436", "#e0e7ff", 4.5),
    ("tekst na plavoj traci preuzimanja", "#2d3436", "#d3e4fa", 4.5),
    ("velika cifra koraka", "#818d9f", "#f5f7fa", 3.0),
    ("kontura zuba na pozadini", "#818d9f", "#f5f7fa", 3.0),
    ("prsten fokusa na pozadini", "#006be0", "#f5f7fa", 3.0),
]


def main() -> int:
    pao = 0
    for opis, tekst, podloga, prag in PAROVI:
        vrednost = odnos(tekst, podloga)
        znak = "ok  " if vrednost >= prag else "PADA"
        if vrednost < prag:
            pao += 1
        print(f"{znak} {vrednost:5.2f}:1  (prag {prag})  {opis}  {tekst} na {podloga}")

    print()
    print("Sve prolazi." if not pao else f"Ne prolazi: {pao}")
    return 1 if pao else 0


if __name__ == "__main__":
    raise SystemExit(main())
