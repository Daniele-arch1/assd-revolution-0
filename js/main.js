/* =========================================================
   A.S.D. Revolution Sport — script condiviso
   Nav mobile, header sticky, stato orari, filtro macchinari,
   carosello recensioni.
   ========================================================= */
(function () {
  "use strict";

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
     Dati segnaposto: sostituisci con le recensioni reali
     (es. tramite Google Places API o un widget di terze parti),
     ordinate per valutazione piu alta. */
  var REVIEWS = [
    { name: "Marco B.", rating: 5, date: "2 settimane fa", text: "Palestra pulitissima e staff sempre disponibile. Gli attrezzi sono nuovi e ben tenuti." },
    { name: "Sara K.", rating: 5, date: "1 mese fa", text: "Ambiente accogliente sia per chi parla italiano che sloveno. Il personal trainer mi ha seguita passo passo." },
    { name: "Luka N.", rating: 5, date: "1 mese fa", text: "Ottimo rapporto qualita prezzo, sala pesi completa e mai troppo affollata." },
    { name: "Elena T.", rating: 4, date: "2 mesi fa", text: "Corsi molto validi, spogliatoi puliti. Consigliata a chi cerca serieta." },
    { name: "Davide P.", rating: 4, date: "3 mesi fa", text: "Struttura curata nei minimi dettagli, parcheggio comodo vicino all'ingresso." }
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

    function render() {
      var r = REVIEWS[current];
      var stars = "★★★★★☆☆☆☆☆".slice(5 - r.rating, 10 - r.rating);
      reviewTrack.innerHTML =
        '<div class="review-stars">' + "★".repeat(r.rating) + "☆".repeat(5 - r.rating) + "</div>" +
        '<p class="review-text">“' + r.text + '”</p>' +
        '<div class="review-author">' +
        '<span class="review-avatar">' + initials(r.name) + "</span>" +
        "<span><strong>" + r.name + "</strong><span>" + r.date + "</span></span>" +
        "</div>";

      if (dotsWrap) {
        dotsWrap.querySelectorAll("button").forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
        });
      }
    }

    if (dotsWrap) {
      REVIEWS.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Vai alla recensione " + (i + 1));
        dot.addEventListener("click", function () { current = i; render(); });
        dotsWrap.appendChild(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", function () {
      current = (current - 1 + REVIEWS.length) % REVIEWS.length;
      render();
    });
    if (nextBtn) nextBtn.addEventListener("click", function () {
      current = (current + 1) % REVIEWS.length;
      render();
    });

    render();
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
})();
