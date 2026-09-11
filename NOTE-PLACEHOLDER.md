# Cosa sostituire prima di pubblicare

Sito statico, nessuna build richiesta: apri `index.html` col doppio click o servilo con un qualsiasi server statico (es. `palestra-landing/serve.ps1`, porta 8793).

## Contenuti da inserire
- **Logo**: fatto — `img/logo.webp` è il logo reale, usato nell'header di ogni pagina (`<img class="brand-logo-img">`, con un disco bianco dietro per restare leggibile sulla navbar scura). Se in futuro lo sostituisci con un altro file, aggiorna il percorso `img/logo.webp` in tutte e 5 le pagine (o mantieni lo stesso nome file).
- **Video hero** (`index.html`): rimosso su richiesta. L'hero mostra ora solo lo sfondo `.hero-poster` (pattern scuro decorativo). Il tag `<video>` è pronto ma commentato in `.hero-media`: quando avrai il video reale, salvalo in `img/hero-video.mp4` e decommenta il blocco (basta togliere `<!--` e `-->`). Se il video sarà scuro, valuta di alleggerire il gradiente in `.hero::after` (in `css/style.css`) per non coprirlo troppo.
- **Foto**: in parte fatto — `img/palestra foto.webp` e `img/zona corpo libero e macchinari.webp` sono già usate nelle card "Esplora la palestra" (`index.html`), nei primi 2 riquadri di `foto.html` e come banner in `macchinari.html`. Restano 7 riquadri "Foto in arrivo" in `foto.html` da riempire con altre foto reali quando disponibili.
- **Foto macchinari** (`macchinari.html`): le singole card macchinario usano ancora emoji come icona (non abbiamo foto per ogni attrezzo specifico) — sostituirle con foto reali quando disponibili.
- **Telefono, email**: cercare `+39 000 000 0000` e `info@revolutionsport.it` in tutte le pagine.
- **Indirizzo**: già impostato su "Via Brigata Casale, 32 — 34170 Gorizia (GO)" in tutte le pagine, mappa e link indicazioni inclusi. Aggiorna se cambia.
- **Orari** (`js/main.js`, oggetto `HOURS`): impostare gli orari reali di apertura/chiusura per ogni giorno; alimentano sia il badge "Aperto/Chiuso" in hero sia la scheda espandibile orari.
- **Prezzi abbonamento**: fatto — `abbonati.html` ha 4 piani (giornaliero €10, mensile €45, 6 mesi €225, 12 mesi €345, quest'ultimo evidenziato come "Più conveniente"). Aggiorna gli importi lì se cambiano.
- **Paga online** (`abbonati.html`): il pulsante "Paga online" nella sezione finale è per ora disattivato (`class="is-disabled"`, `href="#"`) in attesa del link di pagamento sicuro. Quando lo ricevi: rimuovi `is-disabled` e `aria-disabled="true"` e imposta `href` con il link reale.
- **Recensioni** (`js/main.js`, array `REVIEWS`): sono dati segnaposto. Per recensioni reali collegare le Google Reviews (es. Google Places API, o un widget embed di terze parti) e mantenerle ordinate per valutazione più alta.
- **Social**: fatto — Facebook e Instagram collegati ai profili reali su tutte le pagine (bottoni "Segui" in home + icone footer). Resta da impostare il link "Lascia una recensione su Google" in `recensioni.html` (serve il `placeid` reale della palestra).
- **Corsi ed eventi** (`index.html`): le 3 card sono segnaposto, da aggiornare quando le attività verranno confermate.
- **Area profilo** (`profilo.html`, nuova pagina): è solo un'**anteprima grafica non funzionante** (icona persona accanto a "Iscriviti ora" nella navbar di tutte le pagine). I form di login/registrazione sono presenti ma non salvano né inviano nulla — cliccando "Accedi" o "Crea account" compare solo un messaggio di anteprima. **Prima di renderla reale serve un backend vero**: un database con password sempre salvate come hash (mai in chiaro), e per i pagamenti un processore certificato (es. Stripe, PayPal) che gestisca i dati della carta — il sito non deve mai salvare da sé numeri di carta o CVV, per motivi di sicurezza e conformità PCI-DSS. Finché questa pagina resta così, non raccoglie né espone dati reali di nessuno.

## Note tecniche
- Nessuna dipendenza esterna nel codice (niente CDN/font esterni, video incluso), coerente con l'app `focus-sprint` già presente nel progetto.
- Header: tema scuro, fisso in alto (`position: fixed`), stesso colore durante tutto lo scroll su ogni pagina; su mobile diventa un menu a comparsa (anch'esso scuro).
- Layout pensato per un riferimento desktop 1440×900 (container a 1280px); resta comunque responsive su schermi più piccoli.
- Mappa: l'iframe e il link "Ottieni indicazioni" puntano all'indirizzo esatto della palestra (nessuna API key richiesta, embed pubblico di Google Maps).
- Orari: scheda a comparsa (`<details>`), mostra solo il giorno corrente per default; cliccandoci sopra si espande con l'elenco completo della settimana e le chiusure straordinarie.
- Filtro macchinari (ora con 6 categorie: Braccia, Gambe, Petto, Schiena, Cardio, Corpo libero) e carosello recensioni sono gestiti in `js/main.js`, senza librerie esterne.
- Se in futuro serve il bilinguismo IT/SI, si può aggiungere uno switch di lingua: al momento i testi sono solo in italiano.
- Favicon: impostata su tutte le pagine (`img/logo.webp`).

## Diagnostica (11/09/2026)
Eseguito un controllo completo: link interni/anchor, percorsi immagini, ID duplicati, alt mancanti, placeholder testuali dimenticati, coerenza `target="_blank"`/`rel="noopener"`, console ed errori di rete su tutte e 5 le pagine, filtro macchinari (tutte le 6 categorie), carosello recensioni (avanti/indietro/loop), overflow orizzontale a 1440px/980px/375px. Nessun errore residuo trovato.
