# A.S.D. Revolution Sport — sito web

Landing page e sito informativo per la palestra A.S.D. Revolution Sport (Gorizia). Sito statico in HTML/CSS/JS puro, nessuna dipendenza esterna e nessuna build richiesta.

## Come aprirlo

**Opzione 1 — doppio click**
Apri `index.html` col doppio click: funziona da subito (navigazione, filtri, carosello). Solo la mappa richiede una connessione internet per caricarsi.

**Opzione 2 — server locale (consigliata durante lo sviluppo)**
```bash
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```
Poi apri [http://localhost:8793](http://localhost:8793). Il server è uno script PowerShell autonomo (nessun Node/Python richiesto).

## Struttura del progetto

```
palestra-landing/
├── index.html          Home: hero, dove si trova, esplora la palestra, social, recensioni
├── abbonati.html        Servizi inclusi + 4 piani di abbonamento
├── foto.html             Galleria fotografica
├── macchinari.html       Elenco macchinari filtrabile per gruppo muscolare
├── aggiornamenti.html    Corsi ed eventi organizzati in palestra
├── recensioni.html       Stesso carosello recensioni della home, raggiungibile solo via URL diretto
├── profilo.html          Area profilo: SOLO anteprima grafica, login/registrazione non funzionanti
├── privacy.html          Privacy e Cookie Policy (testo segnaposto, da far verificare)
├── css/style.css         Stile condiviso da tutte le pagine
├── js/main.js            Nav mobile, stato orari, filtro macchinari, carosello recensioni, banner cookie
├── img/                  Logo e foto (incluse quelle del carosello hero)
├── serve.ps1             Server statico locale per lo sviluppo (porta 8793)
└── NOTE-PLACEHOLDER.md   Checklist di cosa aggiornare prima di andare online
```

## Pagine e funzionalità principali

- **Navbar** fissa in alto, tema scuro, uguale su tutte le pagine e durante lo scroll; su mobile diventa un menu a comparsa.
- **Home**: hero a schermo intero con carosello di foto (scorrimento automatico, swipe touch su mobile, frecce/pallini manuali su desktop) e stato aperto/chiuso calcolato in tempo reale, sezione "dove si trova" con mappa e orari a comparsa (giorno corrente in evidenza, settimana completa espandibile), card verso foto/macchinari, social, e in fondo le recensioni (carosello con frecce/swipe e indicatori, ordinate per valutazione più alta).
- **Abbonati**: servizi inclusi (testo, senza icone), 4 piani (giornaliero, mensile, 6 mesi, 12 mesi); su mobile ogni sezione mostra prima una card in evidenza (un servizio, il piano mensile) e poi una scheda a comparsa apribile con un pulsante ("Vedi tutti i servizi"/"Vedi tutti gli abbonamenti"), su desktop restano griglie di card sempre visibili.
- **Aggiornamenti**: pagina dedicata a corsi ed eventi organizzati in palestra (in precedenza era una sezione della home).
- **Macchinari**: filtro per Braccia, Gambe, Petto, Schiena, Cardio, Corpo libero (solo testo, senza icone).
- **Profilo**: link "Profilo" nella navbar (accanto a "Iscriviti ora") che apre un'anteprima di come sarà l'area personale (login/registrazione, stato abbonamento, pagamento, privacy). È solo dimostrativa: nessun dato viene salvato, serve un backend reale prima di attivarla (dettagli in `NOTE-PLACEHOLDER.md`).
- **Privacy e Cookie**: pagina dedicata (link in fondo al footer di ogni pagina) con testo segnaposto da far verificare prima di pubblicare. Un banner in basso, su tutte le pagine, chiede di accettare o rifiutare i cookie al primo accesso; la scelta resta salvata nel browser e il banner non ricompare più.

## Prima di pubblicare

Vedi [NOTE-PLACEHOLDER.md](NOTE-PLACEHOLDER.md) per l'elenco dettagliato di contenuti segnaposto da sostituire (foto mancanti, link social reali, link di pagamento online, recensioni reali, ecc.).
