/* =========================================================
   A.S.D. Revolution Sport — script condiviso
   Nav mobile, header sticky, stato orari, filtro macchinari,
   carosello recensioni.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Swipe touch (usato da carosello hero e recensioni) ---------- */
  var addSwipeSupport = function (el, onSwipeLeft, onSwipeRight) {
    if (!el) return;
    var startX = 0;
    var startY = 0;
    var tracking = false;

    el.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
    }, { passive: true });

    el.addEventListener("touchend", function (e) {
      if (!tracking) return;
      tracking = false;
      var deltaX = e.changedTouches[0].clientX - startX;
      var deltaY = e.changedTouches[0].clientY - startY;
      if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX < 0) onSwipeLeft(); else onSwipeRight();
    }, { passive: true });
  };

  /* ---------- Accordion "vedi tutti" (servizi/abbonamenti, solo mobile) ---------- */
  var mobileAccordions = document.querySelectorAll(".mobile-accordion");
  if (mobileAccordions.length) {
    var updateAccordionLabel = function (el) {
      var summary = el.querySelector(".mobile-accordion-summary");
      var label = summary ? summary.querySelector(".mobile-accordion-label") : null;
      if (!summary || !label) return;
      label.textContent = el.open ? summary.dataset.labelOpen : summary.dataset.labelClosed;
    };

    mobileAccordions.forEach(function (el) {
      el.addEventListener("toggle", function () {
        el.dataset.userToggled = "1";
        updateAccordionLabel(el);
      });
    });

    var applyAccordionState = function () {
      var isMobile = window.innerWidth <= 760;
      mobileAccordions.forEach(function (el) {
        if (isMobile) {
          if (!el.dataset.userToggled) el.open = false;
        } else {
          el.open = true;
        }
        updateAccordionLabel(el);
      });
    };

    applyAccordionState();
    window.addEventListener("resize", applyAccordionState);
  }

  /* ---------- Hero slider (scorrimento immagini) ---------- */
  var heroSlides = document.querySelectorAll(".hero-slide");
  if (heroSlides.length > 1) {
    var heroIndex = 0;
    var heroDotsWrap = document.getElementById("heroDots");
    var heroPrevBtn = document.getElementById("heroPrev");
    var heroNextBtn = document.getElementById("heroNext");
    var heroTimer;

    if (heroDotsWrap) {
      heroSlides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Vai alla foto " + (i + 1));
        dot.addEventListener("click", function () {
          goToHeroSlide(i);
          resetHeroTimer();
        });
        heroDotsWrap.appendChild(dot);
      });
    }

    var renderHero = function () {
      heroSlides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === heroIndex);
      });
      if (heroDotsWrap) {
        heroDotsWrap.querySelectorAll("button").forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === heroIndex);
        });
      }
    };

    var goToHeroSlide = function (i) {
      heroIndex = (i + heroSlides.length) % heroSlides.length;
      renderHero();
    };

    var resetHeroTimer = function () {
      clearInterval(heroTimer);
      heroTimer = setInterval(function () {
        goToHeroSlide(heroIndex + 1);
      }, 5000);
    };

    if (heroPrevBtn) heroPrevBtn.addEventListener("click", function () {
      goToHeroSlide(heroIndex - 1);
      resetHeroTimer();
    });
    if (heroNextBtn) heroNextBtn.addEventListener("click", function () {
      goToHeroSlide(heroIndex + 1);
      resetHeroTimer();
    });

    addSwipeSupport(document.querySelector(".hero"), function () {
      goToHeroSlide(heroIndex + 1);
      resetHeroTimer();
    }, function () {
      goToHeroSlide(heroIndex - 1);
      resetHeroTimer();
    });

    renderHero();
    resetHeroTimer();
  }

  /* ---------- Nav mobile ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", function (e) {
      if (!mainNav.classList.contains("is-open")) return;
      if (mainNav.contains(e.target) || navToggle.contains(e.target)) return;
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mainNav.classList.contains("is-open")) {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Orari palestra ----------
     Modifica questi orari con quelli reali della palestra.
     Formato 24h "HH:MM". null = giorno di chiusura. */
  var WEEK_LABELS = ["Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato"];
  var HOURS = [
    null,                    // Domenica: chiuso
    ["09:00", "20:30"],      // Lunedi
    ["09:00", "20:30"],      // Martedi
    ["09:00", "20:30"],      // Mercoledi
    ["09:00", "20:30"],      // Giovedi
    ["09:00", "20:30"],      // Venerdi
    ["09:00", "14:00"]       // Sabato
  ];

  function toMinutes(hhmm) {
    var parts = hhmm.split(":");
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }

  function computeStatus() {
    var now = new Date();
    var day = now.getDay();
    var nowMin = now.getHours() * 60 + now.getMinutes();
    var today = HOURS[day];

    if (today && nowMin >= toMinutes(today[0]) && nowMin < toMinutes(today[1])) {
      return { open: true, text: "Aperto ora · Chiude alle " + today[1] };
    }

    // trova la prossima apertura, scorrendo i prossimi 7 giorni
    for (var i = 0; i <= 7; i++) {
      var d = (day + i) % 7;
      var slot = HOURS[d];
      if (!slot) continue;
      if (i === 0 && nowMin >= toMinutes(slot[1])) continue;
      var label = i === 0 ? "oggi" : (i === 1 ? "domani" : WEEK_LABELS[d].toLowerCase());
      return { open: false, text: "Chiuso · Apre " + label + " alle " + slot[0] };
    }
    return { open: false, text: "Orari non disponibili" };
  }

  var statusEl = document.getElementById("gymStatus");
  if (statusEl) {
    var status = computeStatus();
    statusEl.classList.toggle("is-closed", !status.open);
    var label = statusEl.querySelector(".label");
    if (label) label.textContent = status.text;
  }

  var todayIndex = new Date().getDay();
  var todayText = document.getElementById("hoursToday");
  if (todayText) {
    var todaySlot = HOURS[todayIndex];
    todayText.textContent = WEEK_LABELS[todayIndex] + " · " + (todaySlot ? todaySlot[0] + " – " + todaySlot[1] : "Chiuso");
  }

  var hoursBody = document.getElementById("hoursTableBody");
  if (hoursBody) {
    var rows = "";
    for (var d = 1; d <= 6; d++) {
      appendRow(d);
    }
    appendRow(0);
    hoursBody.innerHTML = rows;

    function appendRow(dayIndex) {
      var slot = HOURS[dayIndex];
      var isToday = dayIndex === todayIndex;
      rows += '<tr class="' + (isToday ? "is-today" : "") + '">' +
        "<td>" + WEEK_LABELS[dayIndex] + "</td>" +
        "<td>" + (slot ? slot[0] + " – " + slot[1] : "Chiuso") + "</td>" +
        "</tr>";
    }
  }

  /* ---------- Filtro macchinari ---------- */
  var filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    var filterButtons = filterBar.querySelectorAll(".filter-btn");
    var machineCards = document.querySelectorAll(".machine-card");

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var filter = btn.getAttribute("data-filter");

        machineCards.forEach(function (card) {
          var cats = (card.getAttribute("data-category") || "").split(" ");
          var show = filter === "tutti" || cats.indexOf(filter) !== -1;
          card.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---------- Carosello recensioni ----------
     Recensioni reali fornite dal titolare. Per aggiungerne altre,
     aggiungi un nuovo oggetto {name, rating, date, text} alla lista. */
  var REVIEWS = [
    { name: "Fabio", rating: 5, date: "Recensione Google", text: "La migliore palestra di Gorizia. Divisa su tre livelli: appena entri trovi la prima sala pesi, al piano inferiore un'altra sala pesi e al piano superiore la sala cardio. Locale climatizzato, personale simpatico e disponibile. Spogliatoi con armadietti muniti di lucchetto per chi ne avesse bisogno." },
    { name: "Pierpaolo", rating: 5, date: "Recensione Google", text: "Fantastica palestra in via Brigata Casale a Gorizia. Sviluppata su tre piani, offre ogni tipo di attività: dai programmi cardio fitness, alla ginnastica, al bodybuilding e molto altro. Vivace e dinamica anche grazie ai molti iscritti, offre un clima giovane ed empatico. I titolari sono gentili, preparati e molto legati alla propria clientela. La palestra offre molte convenzioni. Consigliatissima." },
    { name: "Mauro", rating: 5, date: "Recensione Google", text: "Peccato aver avuto qualche difficoltà quando ho scoperto questa palestra a Gorizia, ma spero di poterci tornare un giorno. Le persone che ci lavorano sono cordiali, buone panche per allenarsi. Sulle attrezzature farei forse scelte diverse, ma niente che renda impossibile l'allenamento: anzi, è un'ottima palestra in generale, con gli spazi divisi in stanze diverse, per me un punto molto positivo. Preferibile rispetto ad allenarsi in una grande catena: anche se i prezzi sono più bassi, preferisco comunque pagare qualcosa in più per un'ASD." },
    { name: "Giulio", rating: 5, date: "Recensione Google", text: "Ottimo ambiente, palestra con tutto quello che serve. Staff simpatico." },
    { name: "Giuseppe", rating: 5, date: "Recensione Google", text: "Ottima palestra, consiglio a tutti." }
  ].sort(function (a, b) { return b.rating - a.rating; });

  var reviewTrack = document.getElementById("reviewTrack");
  if (reviewTrack) {
    var dotsWrap = document.getElementById("reviewDots");
    var prevBtn = document.getElementById("reviewPrev");
    var nextBtn = document.getElementById("reviewNext");
    var current = 0;

    function initials(name) {
      return name.split(" ").map(function (p) { return p.charAt(0); }).join("").slice(0, 2).toUpperCase();
    }

    REVIEWS.forEach(function (r, i) {
      var card = document.createElement("div");
      card.className = "review-card" + (i === 0 ? " is-active" : "");
      card.innerHTML =
        '<div class="review-stars">' + "★".repeat(r.rating) + "☆".repeat(5 - r.rating) + "</div>" +
        '<p class="review-text">“' + r.text + '”</p>' +
        '<div class="review-author">' +
        '<span class="review-avatar">' + initials(r.name) + "</span>" +
        "<span><strong>" + r.name + "</strong><span>" + r.date + "</span></span>" +
        "</div>";
      reviewTrack.appendChild(card);
    });

    var reviewCards = reviewTrack.querySelectorAll(".review-card");

    /* Transizione con scorrimento direzionale (avanti/indietro), stessa tecnica del carosello hero
       ma con offset laterale così le card sembrano scorrere invece di apparire di scatto. */
    var goToReview = function (index) {
      var next = (index + REVIEWS.length) % REVIEWS.length;
      if (next === current) return;

      var distanceForward = (next - current + REVIEWS.length) % REVIEWS.length;
      var forward = distanceForward <= REVIEWS.length / 2;

      var oldCard = reviewCards[current];
      var newCard = reviewCards[next];

      newCard.style.transition = "none";
      newCard.style.transform = "translateX(" + (forward ? "26px" : "-26px") + ")";
      newCard.getBoundingClientRect();
      newCard.style.transition = "";

      oldCard.classList.remove("is-active");
      oldCard.style.transform = "translateX(" + (forward ? "-26px" : "26px") + ")";

      newCard.classList.add("is-active");
      newCard.style.transform = "translateX(0)";
      newCard.scrollTop = 0;

      current = next;

      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
        });
      }
    };

    if (dotsWrap) {
      REVIEWS.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Vai alla recensione " + (i + 1));
        if (i === 0) dot.classList.add("is-active");
        dot.addEventListener("click", function () { goToReview(i); });
        dotsWrap.appendChild(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goToReview(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goToReview(current + 1); });

    addSwipeSupport(document.querySelector(".review-carousel"), function () {
      goToReview(current + 1);
    }, function () {
      goToReview(current - 1);
    });
  }

  /* ---------- Area profilo (demo, non funzionante) ----------
     Anteprima UI: nessun dato viene salvato o inviato da nessuna parte. */
  var authTabs = document.querySelectorAll(".auth-tab");
  if (authTabs.length) {
    var loginForm = document.getElementById("loginForm");
    var registerForm = document.getElementById("registerForm");
    var authNote = document.getElementById("authFormNote");

    authTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        authTabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        var isLogin = tab.dataset.tab === "login";
        if (loginForm) loginForm.classList.toggle("is-hidden", !isLogin);
        if (registerForm) registerForm.classList.toggle("is-hidden", isLogin);
        if (authNote) authNote.textContent = "";
      });
    });

    [loginForm, registerForm].forEach(function (form) {
      if (!form) return;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (authNote) authNote.textContent = "Anteprima dimostrativa: nessun dato è stato salvato.";
      });
    });
  }

  /* ---------- Lightbox foto ---------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lightboxImg = document.getElementById("lightboxImg");
    var lightboxClose = document.getElementById("lightboxClose");

    var openLightbox = function (src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    var closeLightbox = function () {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".photo-item img").forEach(function (img) {
      img.addEventListener("click", function () {
        // Su mobile la foto ingrandita avrebbe la stessa dimensione della copertina: nessun beneficio, si disattiva.
        if (window.innerWidth <= 760) return;
        openLightbox(img.src, img.alt);
      });
    });

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }

  /* ---------- Banner cookie ---------- */
  var cookieBanner = document.getElementById("cookieBanner");
  if (cookieBanner) {
    var COOKIE_CONSENT_KEY = "revolutionSportCookieConsent";
    var storedConsent = null;
    try {
      storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    } catch (e) {}

    if (!storedConsent) {
      setTimeout(function () {
        cookieBanner.classList.add("is-visible");
      }, 400);
    }

    var setCookieConsent = function (value) {
      try {
        localStorage.setItem(COOKIE_CONSENT_KEY, value);
      } catch (e) {}
      cookieBanner.classList.remove("is-visible");
    };

    var cookieAcceptBtn = document.getElementById("cookieAccept");
    var cookieRejectBtn = document.getElementById("cookieReject");
    if (cookieAcceptBtn) cookieAcceptBtn.addEventListener("click", function () {
      setCookieConsent("accepted");
    });
    if (cookieRejectBtn) cookieRejectBtn.addEventListener("click", function () {
      setCookieConsent("rejected");
    });
  }
})();
