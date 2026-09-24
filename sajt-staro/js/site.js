/* Sitnice zajedničke stranama: otkrivanje na skrol, smena snimaka u
   demonstraciji toka, kopiranje kontrolne sume i blagi nagib kartice. */

(function () {
  "use strict";

  var mirnije = window.matchMedia("(prefers-reduced-motion: reduce)");
  var imaIO = "IntersectionObserver" in window;

  /* ---------- otkrivanje na skrol, jednom ---------------------------------- */

  var zaOtkrivanje = document.querySelectorAll("[data-otkrij], [data-koraci]");

  if (!imaIO || mirnije.matches) {
    Array.prototype.forEach.call(zaOtkrivanje, function (element) {
      element.classList.add("vidljivo");
    });
  } else {
    var otkrivac = new IntersectionObserver(
      function (unosi) {
        unosi.forEach(function (unos) {
          if (unos.isIntersecting) {
            unos.target.classList.add("vidljivo");
            otkrivac.unobserve(unos.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    Array.prototype.forEach.call(zaOtkrivanje, function (element) {
      otkrivac.observe(element);
    });
  }

  /* ---------- demonstracija toka ------------------------------------------ */

  var blokovi = Array.prototype.slice.call(document.querySelectorAll("[data-tok]"));
  var slike = Array.prototype.slice.call(document.querySelectorAll("[data-slika]"));
  var tackice = Array.prototype.slice.call(document.querySelectorAll("#tackice li"));
  var ekran = document.querySelector(".tok__telefon .telefon__ekran");
  var siroko = window.matchMedia("(min-width: 60rem)");
  var pratilacTeksta = null;
  var pratilacSlika = null;

  function prikazi(indeks) {
    slike.forEach(function (slika, i) {
      slika.classList.toggle("je-aktivna", i === indeks);
    });
    blokovi.forEach(function (blok, i) {
      blok.classList.toggle("je-aktivan", i === indeks);
    });
    tackice.forEach(function (tacka, i) {
      tacka.classList.toggle("je-aktivna", i === indeks);
    });
  }

  function ugasiPratioce() {
    if (pratilacTeksta) {
      pratilacTeksta.disconnect();
      pratilacTeksta = null;
    }
    if (pratilacSlika) {
      pratilacSlika.disconnect();
      pratilacSlika = null;
    }
  }

  function postaviTok() {
    if (!imaIO || !blokovi.length || !slike.length) {
      return;
    }
    ugasiPratioce();

    if (siroko.matches) {
      // Na širokom ekranu telefon stoji, a tekst koji je na sredini ekrana
      // bira koji se snimak vidi.
      pratilacTeksta = new IntersectionObserver(
        function (unosi) {
          unosi.forEach(function (unos) {
            if (unos.isIntersecting) {
              prikazi(Number(unos.target.dataset.tok));
            }
          });
        },
        { rootMargin: "-50% 0px -50% 0px" }
      );
      blokovi.forEach(function (blok) {
        pratilacTeksta.observe(blok);
      });
      prikazi(0);
    } else if (ekran) {
      // Na uskom ekranu se prevlači prstom, a tačkice prate položaj.
      pratilacSlika = new IntersectionObserver(
        function (unosi) {
          unosi.forEach(function (unos) {
            if (unos.isIntersecting) {
              var indeks = Number(unos.target.dataset.slika);
              tackice.forEach(function (tacka, i) {
                tacka.classList.toggle("je-aktivna", i === indeks);
              });
            }
          });
        },
        { root: ekran, threshold: 0.6 }
      );
      slike.forEach(function (slika) {
        pratilacSlika.observe(slika);
      });
    }
  }

  postaviTok();

  if (siroko.addEventListener) {
    siroko.addEventListener("change", postaviTok);
  }

  /* ---------- kopiranje kontrolne sume ------------------------------------- */

  Array.prototype.forEach.call(document.querySelectorAll("[data-kopiraj]"), function (dugme) {
    var izvor = document.querySelector(dugme.dataset.kopiraj);
    if (!izvor) {
      return;
    }

    dugme.addEventListener("click", function () {
      var tekst = izvor.textContent.trim();
      var pocetni = dugme.dataset.natpis || dugme.textContent.trim();
      dugme.dataset.natpis = pocetni;

      function potvrdi() {
        dugme.textContent = "Kopirano";
        setTimeout(function () {
          dugme.textContent = pocetni;
        }, 900);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(tekst).then(potvrdi, rezerva);
      } else {
        rezerva();
      }

      // Rezerva za pregledače bez pristupa ostavi; polje se ne vidi.
      function rezerva() {
        var polje = document.createElement("textarea");
        polje.value = tekst;
        polje.setAttribute("readonly", "");
        polje.style.position = "absolute";
        polje.style.left = "-9999px";
        document.body.appendChild(polje);
        polje.select();
        try {
          document.execCommand("copy");
          potvrdi();
        } catch (greska) {
          dugme.textContent = "Kopirajte ručno";
        }
        document.body.removeChild(polje);
      }
    });
  });

  /* ---------- blagi nagib kartice sa snimkom ------------------------------- */

  var finiPokazivac = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (finiPokazivac.matches && !mirnije.matches) {
    Array.prototype.forEach.call(document.querySelectorAll("[data-nagib]"), function (karta) {
      var NAJVISE = 4; // stepeni; više od toga deluje kao igračka

      karta.addEventListener("pointerenter", function () {
        karta.style.willChange = "transform";
      });

      karta.addEventListener("pointermove", function (dogadjaj) {
        var okvir = karta.getBoundingClientRect();
        var x = (dogadjaj.clientX - okvir.left) / okvir.width - 0.5;
        var y = (dogadjaj.clientY - okvir.top) / okvir.height - 0.5;
        karta.style.transform =
          "perspective(900px) rotateY(" + x * NAJVISE * 2 + "deg) rotateX(" + -y * NAJVISE * 2 + "deg)";
      });

      karta.addEventListener("pointerleave", function () {
        karta.style.transform = "";
        karta.style.willChange = "";
      });
    });
  }
})();
