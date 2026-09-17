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
├── recensioni.html       Stesso carosello recensioni della home, solo via URL diretto (noindex)
├── privacy.html          Privacy e Cookie Policy (bozza estesa, da far validare a un legale)
├── 404.html              Pagina per indirizzi inesistenti (GitHub Pages)
├── robots.txt            Regole per i motori di ricerca + indirizzo della sitemap
├── sitemap.xml           Elenco delle pagine da indicizzare
├── _config.yml           GitHub Pages: esclude i file interni dal sito pubblicato
├── css/style.css         Stile condiviso da tutte le pagine
├── js/main.js            Nav mobile, orari, filtro macchinari, caroselli, mappa su consenso, banner cookie
├── img/                  Logo (sorgente + versioni leggere), favicon e foto
├── serve.ps1             Server statico locale per lo sviluppo (porta 8793) — non pubblicato
└── NOTE-PLACEHOLDER.md   Checklist e note di progetto — non pubblicato
```

## Pagine e funzionalità principali

- **Navbar** fissa in alto, tema scuro, uguale su tutte le pagine e durante lo scroll; su mobile diventa un menu a comparsa.
- **Home**: hero a schermo intero con carosello di foto (scorrimento automatico, swipe touch su mobile, frecce/pallini manuali su desktop) e stato aperto/chiuso calcolato in tempo reale, sezione "dove si trova" con mappa e orari a comparsa (giorno corrente in evidenza, settimana completa espandibile), card verso foto/macchinari, social, e in fondo le recensioni (carosello con frecce/swipe e indicatori, ordinate per valutazione più alta).
- **Abbonati**: servizi inclusi (testo, senza icone), 4 piani (giornaliero, mensile, 6 mesi, 12 mesi); su mobile ogni sezione mostra prima una card in evidenza (un servizio, il piano mensile) e poi una scheda a comparsa apribile con un pulsante ("Vedi tutti i servizi"/"Vedi tutti gli abbonamenti"), su desktop restano griglie di card sempre visibili.
- **Aggiornamenti**: pagina dedicata a corsi ed eventi organizzati in palestra (in precedenza era una sezione della home).
- **Macchinari**: filtro per Braccia, Gambe, Petto, Schiena, Cardio, Corpo libero (solo testo, senza icone).
- **Privacy e Cookie**: pagina dedicata (link in fondo al footer di ogni pagina), bozza estesa da far validare prima di pubblicare. Un banner chiede al primo accesso di accettare o rifiutare: "Accetta" abilita la mappa di Google Maps, "Rifiuta" la lascia spenta. La scelta si può cambiare in ogni momento dal pulsante "Gestisci cookie" nel footer.
- **Sicurezza**: Content Security Policy su tutte le pagine (solo script, stili e immagini del sito; iframe solo da Google Maps), referrer ristretto, mappa in sandbox, nessuno stile o script inline. Regole per non romperla e controlli da fare su GitHub in `NOTE-PLACEHOLDER.md`.
- **SEO**: titoli con "Gorizia", canonical, Open Graph, dati strutturati `ExerciseGym` in home, `sitemap.xml`, `robots.txt`, `404.html`. L'indirizzo base usato è quello di GitHub Pages: se cambia dominio va aggiornato (dettagli in `NOTE-PLACEHOLDER.md`).

## Prima di pubblicare

Vedi [NOTE-PLACEHOLDER.md](NOTE-PLACEHOLDER.md) per l'elenco dettagliato di contenuti segnaposto da sostituire (foto mancanti, link social reali, link di pagamento online, recensioni reali, ecc.).
