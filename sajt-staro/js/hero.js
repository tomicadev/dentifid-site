/* Demonstracija procene u hero sekciji: izbor zuba, tri odgovora i prsten
   skora. Vrednosti su iste kao u aplikaciji na snimku `04-rezultat.jpg`. */

(function () {
  "use strict";

  var demo = document.getElementById("demo");
  if (!demo) {
    return;
  }

  var zubi = Array.prototype.slice.call(demo.querySelectorAll(".zub"));
  var pilule = Array.prototype.slice.call(demo.querySelectorAll("[data-pilula]"));
  var luk = document.getElementById("prsten-luk");
  var broj = document.getElementById("prsten-broj");
  var rezultat = document.getElementById("rezultat");
  var nivo = document.getElementById("rezultat-nivo");
  var ponovo = document.getElementById("ponovo");
  var natpis = document.getElementById("natpis-zuba");
  var izvestaj = document.getElementById("demo-izvestaj");
  var uputstvo = document.getElementById("demo-uputstvo");
  var vilica = demo.querySelector(".vilica");

  var OBIM = 2 * Math.PI * 54;
  var SKOR = 7;
  var NIVO = "Pregled u što skorijem roku";

  var mirnije = window.matchMedia("(prefers-reduced-motion: reduce)");
  var tajmeri = [];
  var okvir = 0;
  var izabrani = null;

  function boja(vrednost) {
    if (vrednost <= 3) {
      return "#34c759";
    }
    if (vrednost <= 6) {
      return "#ffcc00";
    }
    if (vrednost <= 8) {
      return "#ff9500";
    }
    return "#ff3b30";
  }

  function postavi(vrednost) {
    luk.style.strokeDashoffset = OBIM * (1 - vrednost / 10);
    luk.style.stroke = boja(vrednost);
    // Na nuli bi zaobljeni kraj poteza ostavio tačku na vrhu prstena.
    luk.style.opacity = vrednost > 0.05 ? "1" : "0";
    broj.textContent = Math.round(vrednost);
  }

  function ocisti() {
    tajmeri.forEach(clearTimeout);
    tajmeri = [];
    if (okvir) {
      cancelAnimationFrame(okvir);
      okvir = 0;
    }
  }

  function kasnije(radnja, posle) {
    tajmeri.push(setTimeout(radnja, posle));
  }

  function vrati() {
    ocisti();
    zubi.forEach(function (zub) {
      zub.classList.remove("je-izabran");
    });
    pilule.forEach(function (pilula) {
      pilula.classList.remove("je-vidljiva");
    });
    rezultat.classList.remove("je-gotov");
    postavi(0);
    izvestaj.textContent = "";
  }

  function brojiDoSkora() {
    var pocetak = 0;
    var trajanje = 1100;

    function korak(sada) {
      if (!pocetak) {
        pocetak = sada;
      }
      var deo = Math.min((sada - pocetak) / trajanje, 1);
      // Usporava pred kraj, da brojka „slegne" umesto da stane naglo.
      var mekano = 1 - Math.pow(1 - deo, 3);
      postavi(SKOR * mekano);
      if (deo < 1) {
        okvir = requestAnimationFrame(korak);
      } else {
        okvir = 0;
      }
    }

    okvir = requestAnimationFrame(korak);
  }

  function krajnjeStanje(zub) {
    vrati();
    zub.classList.add("je-izabran");
    pilule.forEach(function (pilula) {
      pilula.classList.add("je-vidljiva");
    });
    postavi(SKOR);
    rezultat.classList.add("je-gotov");
    nivo.textContent = NIVO;
    javiRezultat(zub);
  }

  function javiRezultat(zub) {
    izvestaj.textContent =
      "Zub " + zub.dataset.fdi + ", " + zub.dataset.naziv + ". DentifID SCORE " + SKOR + ", " + NIVO + ".";
  }

  function pusti(zub) {
    if (mirnije.matches) {
      krajnjeStanje(zub);
      return;
    }

    vrati();
    izabrani = zub;
    zub.classList.add("je-izabran");
    nivo.textContent = NIVO;

    pilule.forEach(function (pilula, i) {
      kasnije(function () {
        pilula.classList.add("je-vidljiva");
      }, 200 + i * 120);
    });

    kasnije(brojiDoSkora, 700);
    kasnije(function () {
      // Ako je brojanje bilo pauzirano, jer je kartica bila u pozadini,
      // krajnja vrednost mora svejedno da stoji.
      if (okvir) {
        cancelAnimationFrame(okvir);
        okvir = 0;
      }
      postavi(SKOR);
      rezultat.classList.add("je-gotov");
      javiRezultat(zub);
    }, 1800);
    kasnije(function () {
      if (uputstvo) {
        uputstvo.textContent = "Probajte drugi zub — rezultat zavisi od odgovora.";
      }
    }, 2600);
  }

  function pokaziNatpis(zub) {
    if (!vilica || !natpis) {
      return;
    }
    var okvirZuba = zub.getBoundingClientRect();
    var okvirVilice = vilica.getBoundingClientRect();
    natpis.textContent = zub.dataset.fdi + " · " + zub.dataset.naziv;
    natpis.style.left = okvirZuba.left - okvirVilice.left + okvirZuba.width / 2 + "px";
    natpis.style.top = okvirZuba.top - okvirVilice.top + "px";
    natpis.classList.add("je-vidljiv");
  }

  function sakrijNatpis() {
    if (natpis) {
      natpis.classList.remove("je-vidljiv");
    }
  }

  zubi.forEach(function (zub) {
    zub.addEventListener("mouseenter", function () {
      pokaziNatpis(zub);
    });
    zub.addEventListener("mouseleave", sakrijNatpis);
    zub.addEventListener("focus", function () {
      pokaziNatpis(zub);
    });
    zub.addEventListener("blur", sakrijNatpis);
    zub.addEventListener("click", function () {
      pusti(zub);
    });
    zub.addEventListener("keydown", function (dogadjaj) {
      if (dogadjaj.key === "Enter" || dogadjaj.key === " " || dogadjaj.key === "Spacebar") {
        dogadjaj.preventDefault();
        pusti(zub);
      }
    });
  });

  if (ponovo) {
    ponovo.addEventListener("click", function () {
      vrati();
      // Fokus se vraća na zub, da korisnik tastaturom ne ostane na skrivenom
      // dugmetu kad ono nestane.
      var meta = izabrani || document.getElementById("zub-26");
      if (meta) {
        meta.focus();
      }
    });
  }

  postavi(0);

  var pocetni = document.getElementById("zub-26");
  if (pocetni) {
    if (mirnije.matches) {
      krajnjeStanje(pocetni);
    } else if ("IntersectionObserver" in window) {
      var posmatrac = new IntersectionObserver(
        function (unosi) {
          unosi.forEach(function (unos) {
            if (unos.isIntersecting) {
              posmatrac.unobserve(unos.target);
              // Kratka pauza da se strana prvo smiri, pa tek onda pokret.
              kasnije(function () {
                pusti(pocetni);
              }, 700);
            }
          });
        },
        { threshold: 0.4 }
      );
      posmatrac.observe(demo);
    } else {
      krajnjeStanje(pocetni);
    }
  }
})();
