# Guida Setup Completa - Motta car & go srl

## 📝 Panoramica

Questa guida ti aiuterà a configurare completamente il sito di noleggio auto "Motta car & go srl" con tutte le funzionalità richieste.

## 🎯 Funzionalità Implementate

✅ **Setup Progetto Base**
- Next.js 15 con TypeScript e Tailwind CSS
- Struttura cartelle organizzata
- Configurazione Supabase per database e autenticazione
- Middleware per protezione route

✅ **Design e Layout**
- Header con logo "Motta car & go srl" e navigazione
- Footer con informazioni aziendali e link
- Homepage con sezioni hero, features, come funziona
- Design responsive per mobile e desktop

✅ **Database Schema**
- Tabella `profiles` per utenti
- Tabella `cars` per catalogo auto
- Tabella `bookings` per prenotazioni
- Tabella `documents` per upload documenti
- Row Level Security (RLS) configurato

## 🚀 Prossimi Passi

### 1. Configurare Supabase

#### A. Crea un progetto Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Clicca su "Start your project"
3. Crea un nuovo progetto:
   - Nome: `motta-car-go`
   - Database Password: (scegli una password sicura)
   - Region: `Europe (Frankfurt)` o la più vicina

#### B. Esegui lo schema SQL

1. Nel dashboard Supabase, vai su **SQL Editor**
2. Clicca su "New query"
3. Copia e incolla tutto il contenuto del file `supabase-schema.sql`
4. Clicca su "Run" per eseguire lo script
5. Verifica che tutte le tabelle siano state create in **Table Editor**

#### C. Configura Storage

1. Vai su **Storage** nel menu laterale
2. Verifica che i bucket `documents` e `car-images` siano stati creati
3. Se non esistono, creali manualmente:
   - Bucket `documents`: Private
   - Bucket `car-images`: Public

#### D. Ottieni le credenziali

1. Vai su **Settings** > **API**
2. Copia i seguenti valori:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (solo per admin)

### 2. Configurare Stripe

#### A. Crea account Stripe

1. Vai su [https://stripe.com](https://stripe.com)
2. Registrati per un account gratuito
3. Attiva la modalità "Test" (toggle in alto a destra)

#### B. Ottieni le API Keys

1. Vai su **Developers** > **API keys**
2. Copia:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

#### C. Configura Webhook (opzionale per ora)

1. Vai su **Developers** > **Webhooks**
2. Clicca "Add endpoint"
3. URL: `http://localhost:3001/api/webhooks/stripe` (per sviluppo)
4. Eventi da ascoltare:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### 3. Configurare Variabili d'Ambiente

1. Nella cartella `motta-car-go`, crea il file `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (opzionale per ora)

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

2. Salva il file

### 4. Avviare l'Applicazione

```bash
# Assicurati di essere nella cartella motta-car-go
cd motta-car-go

# Installa le dipendenze (se non già fatto)
npm install

# Avvia il server di sviluppo
npm run dev
```

Il sito sarà disponibile su: **http://localhost:3001**

### 5. Testare le Funzionalità Base

1. **Homepage**: Apri http://localhost:3001
   - Verifica che header e footer siano visibili
   - Controlla che il logo "Motta car & go srl" sia presente
   - Testa i link di navigazione

2. **Registrazione**: (da implementare nei prossimi step)
3. **Catalogo Auto**: (da implementare nei prossimi step)
4. **Prenotazione**: (da implementare nei prossimi step)

## 📋 Checklist Setup

- [ ] Progetto Supabase creato
- [ ] Schema SQL eseguito con successo
- [ ] Storage buckets configurati
- [ ] Credenziali Supabase copiate
- [ ] Account Stripe creato
- [ ] API Keys Stripe copiate
- [ ] File `.env.local` creato e configurato
- [ ] Server di sviluppo avviato
- [ ] Homepage visualizzata correttamente

## 🔜 Prossime Implementazioni

Le seguenti funzionalità saranno implementate nei prossimi step:

1. **Pagine Autenticazione**
   - Login
   - Registrazione
   - Reset password

2. **Catalogo Auto**
   - Griglia auto con immagini
   - Filtri per categoria, prezzo, caratteristiche
   - Dettaglio singola auto

3. **Sistema Prenotazione**
   - Form prenotazione con date picker
   - Calcolo prezzo dinamico
   - Selezione località ritiro/consegna

4. **Integrazione Pagamenti**
   - Checkout Stripe
   - Gestione transazioni
   - Conferme pagamento

5. **Upload Documenti**
   - Form upload patente
   - Form upload carta d'identità
   - Visualizzazione documenti caricati

6. **Generazione Contratti PDF**
   - Template contratto
   - Generazione automatica
   - Download PDF

7. **Dashboard Utente**
   - Visualizzazione prenotazioni
   - Gestione profilo
   - Storico noleggi

8. **Pannello Admin**
   - Gestione auto
   - Gestione prenotazioni
   - Verifica documenti

## 🆘 Risoluzione Problemi

### Errore: "Cannot find module '@/components/layout/Header'"

Assicurati che i file Header.tsx e Footer.tsx siano stati creati nella cartella corretta:
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`

### Errore: "Supabase client error"

Verifica che:
1. Le variabili d'ambiente in `.env.local` siano corrette
2. Il file `.env.local` sia nella root del progetto `motta-car-go`
3. Hai riavviato il server dopo aver modificato `.env.local`

### Porta 3000 già in uso

Il server usa automaticamente la porta 3001 se la 3000 è occupata. Questo è normale.

## 📞 Supporto

Per domande o problemi durante il setup, contatta il team di sviluppo.

---

**Buon lavoro con Motta car & go srl! 🚗**

