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
├── index.html          Home: hero, dove si trova, esplora la palestra, corsi ed eventi, social
├── abbonati.html        Servizi inclusi + 4 piani di abbonamento + contatti/pagamento
├── foto.html             Galleria fotografica
├── macchinari.html       Elenco macchinari filtrabile per gruppo muscolare
├── recensioni.html       Carosello recensioni Google
├── profilo.html          Area profilo: SOLO anteprima grafica, login/registrazione non funzionanti
├── css/style.css         Stile condiviso da tutte le pagine
├── js/main.js            Nav mobile, stato orari, filtro macchinari, carosello recensioni
├── img/                  Logo, foto, video ed eventuali icone
├── serve.ps1             Server statico locale per lo sviluppo (porta 8793)
└── NOTE-PLACEHOLDER.md   Checklist di cosa aggiornare prima di andare online
```

## Pagine e funzionalità principali

- **Navbar** fissa in alto, tema scuro, uguale su tutte le pagine e durante lo scroll; su mobile diventa un menu a comparsa.
- **Home**: hero con stato aperto/chiuso calcolato in tempo reale, sezione "dove si trova" con mappa e orari a comparsa (giorno corrente in evidenza, settimana completa espandibile), card verso foto/macchinari, corsi ed eventi, social.
- **Abbonati**: servizi inclusi, 4 piani (giornaliero, mensile, 6 mesi, 12 mesi), contatti (chiamaci/scrivici/paga online).
- **Macchinari**: filtro per Braccia, Gambe, Petto, Schiena, Cardio, Corpo libero.
- **Recensioni**: carosello con frecce e indicatori, ordinate per valutazione più alta.
- **Profilo**: link "Profilo" nella navbar (accanto a "Iscriviti ora") che apre un'anteprima di come sarà l'area personale (login/registrazione, stato abbonamento, pagamento, privacy). È solo dimostrativa: nessun dato viene salvato, serve un backend reale prima di attivarla (dettagli in `NOTE-PLACEHOLDER.md`).

## Prima di pubblicare

Vedi [NOTE-PLACEHOLDER.md](NOTE-PLACEHOLDER.md) per l'elenco dettagliato di contenuti segnaposto da sostituire (foto mancanti, link social reali, link di pagamento online, recensioni reali, ecc.).
