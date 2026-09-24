"""Crta gornju vilicu za hero sekciju i ubacuje je u index.html.

Vilica iz aplikacije je fotorealističan render nedokumentovanog porekla, pa se
ovde crta iznova: ravan vektor u paleti brenda, svaki zub zaseban `path` sa
`id`-em po FDI numeraciji.

Kako je crtana:

* luk je elipsa uža nego dublja, pa je zakrivljenost najveća napred, kod
  sekutića, a najmanja pozadi, gde kutnjaci idu skoro pravo — kao u vilici;
* zubi se ređaju po dužini luka srazmerno stvarnoj meziodistalnoj širini u
  milimetrima, pa nisu jednaki;
* kruna je superelipsa: sekutić je skoro pravougaon i tanak, premolar i kutnjak
  zaobljeni, očnjak ima kvržicu okrenutu ka usni. Jezična strana je uvek uža.

Pogled je kao u aplikaciji: leva strana slike je desna strana korisnika.

Upotreba:  python alati/napravi-vilicu.py
"""

import math
from pathlib import Path

PO_MM = 3.6  # piksela po milimetru
A = 104.0  # poluosa elipse po širini
B = 143.0  # poluosa elipse po dubini
RAZMAK = 1.2  # razmak između susednih zuba, u pikselima
TACAKA = 22  # tačaka po kruni

# FDI broj, naziv, meziodistalna širina, bukolingvalna dubina (mm),
# eksponent superelipse (2 = elipsa, 4 = skoro pravougaonik), sužavanje
# jezične strane.
ZUBI = [
    ("11", "centralni sekutić", 8.5, 5.4, 3.6, 0.60),
    ("12", "lateralni sekutić", 6.5, 4.8, 3.4, 0.58),
    ("13", "očnjak", 7.6, 7.4, 2.6, 0.64),
    ("14", "prvi premolar", 7.1, 8.8, 2.5, 0.80),
    ("15", "drugi premolar", 6.8, 8.6, 2.5, 0.82),
    ("16", "prvi molar", 10.2, 10.8, 2.8, 0.88),
    ("17", "drugi molar", 9.4, 10.4, 2.8, 0.86),
]

STRANE = {"1": "desni", "2": "levi"}


def tacka(t: float) -> tuple[float, float]:
    """Tačka na luku; t = 0 je sredina prednjih zuba, na vrhu slike."""
    return (A * math.sin(t), -B * math.cos(t))


def tangenta(t: float) -> tuple[float, float]:
    dx, dy = A * math.cos(t), B * math.sin(t)
    duz = math.hypot(dx, dy)
    return (dx / duz, dy / duz)


def uzorkuj(korak: float = 0.0015) -> list[tuple[float, float]]:
    """Parovi (t, pređena dužina luka)."""
    uzorci, t, s = [], 0.0, 0.0
    px, py = tacka(0.0)
    while t < math.pi * 0.66:
        uzorci.append((t, s))
        t += korak
        x, y = tacka(t)
        s += math.hypot(x - px, y - py)
        px, py = x, y
    return uzorci


def t_za_duzinu(uzorci, cilj: float) -> float:
    for t, s in uzorci:
        if s >= cilj:
            return t
    return uzorci[-1][0]


def superelipsa(sirina: float, dubina: float, eksponent: float, suzenje: float):
    """Kruna u sopstvenim koordinatama: u duž luka, v ka obrazu."""
    tacke = []
    for i in range(TACAKA):
        ugao = 2 * math.pi * i / TACAKA
        c, s = math.cos(ugao), math.sin(ugao)
        u = math.copysign(abs(c) ** (2 / eksponent), c) * sirina / 2
        v = math.copysign(abs(s) ** (2 / eksponent), s) * dubina / 2
        if v < 0:  # jezična strana je uža od obrazne
            u *= suzenje + (1 - suzenje) * (1 + v / (dubina / 2))
        tacke.append((u, v))
    return tacke


def glatka(tacke: list[tuple[float, float]]) -> str:
    """Zatvorena kriva kroz tačke, Catmull-Rom preveden u kubne Bezijeove lukove."""
    n = len(tacke)
    d = [f"M{tacke[0][0]:.1f},{tacke[0][1]:.1f}"]
    for i in range(n):
        p0 = tacke[(i - 1) % n]
        p1 = tacke[i]
        p2 = tacke[(i + 1) % n]
        p3 = tacke[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(f"C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}")
    d.append("Z")
    return "".join(d)


def napravi() -> tuple[str, tuple[float, float, float, float]]:
    uzorci = uzorkuj()
    ukupno = sum(z[2] * PO_MM + RAZMAK for z in ZUBI)
    crtezi: list[str] = []
    sve_tacke: list[tuple[float, float]] = []

    def polozaj(duz: float, strana: float):
        """Tačka, tangenta i spoljašnja normala na datoj dužini luka."""
        t = t_za_duzinu(uzorci, duz)
        x, y = tacka(t)
        tx, ty = tangenta(t)
        x *= strana
        tx *= strana
        nx, ny = ty, -tx
        if nx * x + ny * y < 0:
            nx, ny = -nx, -ny
        return (x, y), (tx, ty), (nx, ny)

    # Cvorovi (sredina zuba, dubina) za glatku promenu sirine desni duz luka.
    cvorovi = []
    hod = 0.0
    for _, _, mm_sirina, mm_dubina, _, _ in ZUBI:
        cvorovi.append((hod + mm_sirina * PO_MM / 2, mm_dubina * PO_MM))
        hod += mm_sirina * PO_MM + RAZMAK

    def dubina_na(duz: float) -> float:
        if duz <= cvorovi[0][0]:
            return cvorovi[0][1]
        for (s1, d1), (s2, d2) in zip(cvorovi, cvorovi[1:]):
            if duz <= s2:
                k = (duz - s1) / (s2 - s1)
                return d1 + (d2 - d1) * k
        return cvorovi[-1][1]

    def obod(strana: float, odmak, koraka: int = 72):
        tacke = []
        for i in range(koraka + 1):
            duz = ukupno * i / koraka
            (x, y), _, (nx, ny) = polozaj(duz, strana)
            o = odmak(duz)
            tacke.append((x + nx * o, y + ny * o))
        return tacke

    for strana_broj in ("1", "2"):
        znak = -1.0 if strana_broj == "1" else 1.0  # leva strana slike je kvadrant 1
        pomeraj = 0.0
        for broj, naziv, mm_sirina, mm_dubina, eksponent, suzenje in ZUBI:
            sirina = mm_sirina * PO_MM
            dubina = mm_dubina * PO_MM
            (x, y), (tx, ty), (nx, ny) = polozaj(pomeraj + sirina / 2, znak)
            pomeraj += sirina + RAZMAK

            tip = broj[1]
            lokalne = superelipsa(sirina, dubina, eksponent, suzenje)
            if tip == "3":
                # Očnjak: tačke najbliže obrazu izvlače se u kvržicu.
                lokalne = [(u, v * 1.24 if v > dubina * 0.3 else v) for u, v in lokalne]

            svetske = [(x + tx * u + nx * v, y + ty * u + ny * v) for u, v in lokalne]
            sve_tacke.extend(svetske)

            def crta(u1, v1, u2, v2):
                return (
                    f"M{x + tx * u1 + nx * v1:.1f},{y + ty * u1 + ny * v1:.1f}"
                    f"L{x + tx * u2 + nx * v2:.1f},{y + ty * u2 + ny * v2:.1f}"
                )

            # Brazda: kutnjaci dobijaju uzdužnu pukotinu sa dve poprečne crtice,
            # premolari jednu poprečnu, sekutići naznaku sečivne ivice.
            if tip in ("6", "7"):
                brazde = [
                    crta(-sirina * 0.22, 0, sirina * 0.22, 0),
                    crta(0, -dubina * 0.16, 0, dubina * 0.16),
                ]
            elif tip in ("4", "5"):
                brazde = [crta(0, -dubina * 0.2, 0, dubina * 0.2)]
            elif tip == "3":
                brazde = [crta(0, dubina * 0.44, 0, -dubina * 0.14)]
            else:
                brazde = [crta(-sirina * 0.28, dubina * 0.14, sirina * 0.28, dubina * 0.14)]

            fdi = strana_broj + tip
            naziv_pun = f"gornji {STRANE[strana_broj]} {naziv}"
            crtezi.append(
                f'      <g class="zub" id="zub-{fdi}" data-fdi="{fdi}" data-naziv="{naziv_pun}"\n'
                f'         role="button" tabindex="0" aria-label="Zub {fdi}, {naziv_pun}">\n'
                f'        <path class="zub__kruna" d="{glatka(svetske)}" />\n'
                + "".join(f'        <path class="zub__brazda" d="{b}" />\n' for b in brazde)
                + f'        <circle class="zub__krug" cx="{x:.1f}" cy="{y:.1f}" '
                f'r="{min(sirina, dubina) * 0.34:.1f}" />\n'
                f"      </g>"
            )

    # Desni: traka koja spolja i iznutra prelazi krune za nekoliko piksela.
    spolja_l = obod(-1.0, lambda d: dubina_na(d) * 0.5 + 6.0)
    spolja_d = obod(1.0, lambda d: dubina_na(d) * 0.5 + 6.0)
    iznutra_l = obod(-1.0, lambda d: -(dubina_na(d) * 0.5 + 4.5))
    iznutra_d = obod(1.0, lambda d: -(dubina_na(d) * 0.5 + 4.5))
    desni = list(reversed(spolja_l)) + spolja_d + list(reversed(iznutra_d)) + iznutra_l
    d_desni = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in desni) + " Z"
    sve_tacke.extend(spolja_l + spolja_d)

    # Nepce: unutrašnja granica luka, zatvorena pravom linijom pozadi.
    nepce = list(reversed(iznutra_l)) + iznutra_d
    d_nepce = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in nepce) + " Z"

    xs = [p[0] for p in sve_tacke]
    ys = [p[1] for p in sve_tacke]
    pad = 9.0
    minx, maxx = min(xs) - pad, max(xs) + pad
    miny, maxy = min(ys) - pad, max(ys) + pad

    telo = (
        f'      <path class="vilica__desni" d="{d_desni}" />\n'
        f'      <path class="vilica__nepce" d="{d_nepce}" />\n' + "\n".join(crtezi) + "\n"
    )
    return telo, (minx, miny, maxx - minx, maxy - miny)


def main() -> int:
    telo, (vx, vy, vs, vv) = napravi()
    svg = (
        f'    <svg class="vilica__crtez" viewBox="{vx:.1f} {vy:.1f} {vs:.1f} {vv:.1f}"\n'
        f'         role="group" aria-label="Gornja vilica, izaberite zub"\n'
        f'         xmlns="http://www.w3.org/2000/svg">\n{telo}    </svg>'
    )

    koren = Path(__file__).resolve().parent.parent
    cilj = koren / "sajt" / "index.html"
    pocetak, kraj = "<!-- vilica:pocetak -->", "<!-- vilica:kraj -->"
    if cilj.exists():
        tekst = cilj.read_text(encoding="utf-8")
        if pocetak in tekst and kraj in tekst:
            pre = tekst.split(pocetak)[0]
            posle = tekst.split(kraj)[1]
            cilj.write_text(f"{pre}{pocetak}\n{svg}\n    {kraj}{posle}", encoding="utf-8")
            print(f"Vilica ubacena u {cilj.name}; viewBox {vx:.1f} {vy:.1f} {vs:.1f} {vv:.1f}")
            return 0

    (koren / "sajt" / "svg" / "vilica.svg").write_text(svg, encoding="utf-8")
    print(f"Sacuvano u sajt/svg/vilica.svg; viewBox {vx:.1f} {vy:.1f} {vs:.1f} {vv:.1f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
