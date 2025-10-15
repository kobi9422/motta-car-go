# 📸 Guida: Come Caricare Immagini nella Dashboard Admin

## ✅ Sistema Verificato e Funzionante

Il sistema di upload è stato testato e funziona correttamente! Ecco come usarlo:

---

## 🚀 Passo per Passo

### 1. Accedi alla Dashboard Admin

1. Vai su: **http://localhost:3000/login**
2. Inserisci le credenziali:
   - **Email:** `admin@mottacarandgo.it`
   - **Password:** `Admin123!`
3. Clicca **"Accedi"**
4. Vai su: **http://localhost:3000/admin/dashboard**

---

### 2. Aggiungi una Nuova Auto

1. Clicca il pulsante **"Aggiungi Nuova Auto"** (in alto a destra)
2. Si aprirà un form modale

---

### 3. Carica l'Immagine

1. **Clicca sull'area di upload** (quella con l'icona di upload)
2. **Seleziona un'immagine** dal tuo computer
   - Formati supportati: **JPG, PNG, WEBP**
   - Dimensione massima: **5 MB**
3. Vedrai una **preview dell'immagine** con un segno di spunta verde ✓
4. Il nome del file apparirà sotto l'icona di upload

---

### 4. Compila i Campi Obbligatori

Tutti i campi con asterisco (*) sono obbligatori:

- **Marca** (es. Fiat, Toyota, Audi)
- **Modello** (es. Panda, Yaris, A3)
- **Anno** (2000 - 2026)
- **Categoria** (utilitaria, berlina, suv, van, ecc.)
- **Prezzo/Giorno** (in euro)
- **Posti** (numero di posti)
- **Trasmissione** (Manuale o Automatico)
- **Carburante** (Benzina, Diesel, Elettrico, Ibrido)
- **Descrizione** (breve descrizione dell'auto)

Campi opzionali:
- **Caratteristiche** (separate da virgola, es. "Aria condizionata, Bluetooth, Cruise control")
- **Disponibile** (checkbox - selezionato di default)

---

### 5. Salva l'Auto

1. Clicca **"Aggiungi Auto"**
2. Vedrai il messaggio: **"📤 Caricamento immagine..."** (se hai caricato una nuova immagine)
3. Poi: **"💾 Salvataggio..."**
4. Infine: **"Auto aggiunta con successo!"**

---

## 🔧 Modificare un'Auto Esistente

1. Nella tabella delle auto, clicca l'icona **matita (✏️)** sulla riga dell'auto
2. Il form si aprirà con i dati precompilati
3. **Per cambiare l'immagine:**
   - Clicca sull'area di upload
   - Seleziona una nuova immagine
   - La preview si aggiornerà automaticamente
4. Modifica i campi che vuoi cambiare
5. Clicca **"Aggiorna Auto"**

---

## ❌ Eliminare un'Auto

1. Clicca l'icona **cestino (🗑️)** sulla riga dell'auto
2. Conferma l'eliminazione
3. L'auto verrà rimossa dal database

---

## 🐛 Risoluzione Problemi

### ❌ "Devi caricare un'immagine per l'auto"
- **Causa:** Non hai selezionato un'immagine
- **Soluzione:** Clicca sull'area di upload e seleziona un'immagine

### ❌ "Errore durante l'upload dell'immagine"
- **Causa:** File troppo grande o formato non supportato
- **Soluzione:** 
  - Verifica che il file sia JPG, PNG o WEBP
  - Verifica che sia sotto i 5 MB
  - Prova a comprimere l'immagine

### ❌ L'immagine non si vede dopo il salvataggio
- **Causa:** Problema di cache del browser
- **Soluzione:** 
  - Ricarica la pagina (F5)
  - Svuota la cache del browser (Ctrl+Shift+R)

### ❌ "Non autorizzato" o "Accesso negato"
- **Causa:** Non sei loggato come admin
- **Soluzione:** 
  - Fai logout e login di nuovo
  - Verifica di usare le credenziali admin corrette

---

## 📝 Note Importanti

1. **Le immagini vengono caricate su Supabase Storage** nel bucket `car-images`
2. **Gli URL sono pubblici** e accessibili a tutti
3. **Le immagini sono ottimizzate** automaticamente da Next.js
4. **Formato consigliato:** WEBP per dimensioni ridotte
5. **Risoluzione consigliata:** 1200x800 pixel

---

## 🎯 Esempio Completo

```
Marca: Fiat
Modello: Panda
Anno: 2023
Categoria: utilitaria
Prezzo/Giorno: 30
Posti: 5
Trasmissione: Manuale
Carburante: Benzina
Descrizione: Compatta e perfetta per la città, ideale per spostamenti urbani
Caratteristiche: Aria condizionata, Bluetooth, Servosterzo
Disponibile: ✓
Immagine: fiat-panda-2023.jpg (caricata)
```

---

## 🆘 Supporto

Se continui ad avere problemi:

1. Controlla la console del browser (F12) per errori
2. Verifica che il server Next.js sia in esecuzione (`npm run dev`)
3. Verifica che le variabili d'ambiente in `.env.local` siano corrette
4. Esegui `node test-upload.js` per testare l'upload

---

## ✅ Checklist Pre-Upload

- [ ] Sei loggato come admin
- [ ] L'immagine è in formato JPG, PNG o WEBP
- [ ] L'immagine è sotto i 5 MB
- [ ] Hai compilato tutti i campi obbligatori (*)
- [ ] Hai visto la preview dell'immagine con il segno ✓

---

**Buon lavoro! 🚗✨**

