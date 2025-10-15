# 🔧 Fix Login Redirect - Admin Dashboard

## 📅 Data: 15 Ottobre 2025

---

## ❌ Problema

Dopo il login, **tutti gli utenti** (inclusi gli admin) venivano reindirizzati a `/dashboard` invece che alla dashboard appropriata in base al loro ruolo.

**Comportamento errato:**
```
Admin fa login → Reindirizzato a /dashboard ❌
Utente fa login → Reindirizzato a /dashboard ✓
```

**Comportamento desiderato:**
```
Admin fa login → Reindirizzato a /admin/dashboard ✓
Utente fa login → Reindirizzato a /dashboard ✓
```

---

## ✅ Soluzione

Ho modificato la funzione `handleLogin` in `src/app/login/page.tsx` per:

1. **Controllare se c'è un redirect specifico** (parametro URL `?redirect=...`)
   - Se presente, usare quello (per mantenere la funzionalità esistente)
   
2. **Altrimenti, controllare il ruolo dell'utente:**
   - Recuperare il profilo dell'utente dalla tabella `profiles`
   - Se `role === 'admin'` → Reindirizzare a `/admin/dashboard`
   - Se ruolo normale → Reindirizzare a `/dashboard`

---

## 🔧 Codice Modificato

### Prima (Riga 37):
```typescript
// Redirect to the page user was trying to access, or dashboard
const redirectTo = searchParams.get('redirect') || '/dashboard'
router.push(redirectTo)
router.refresh()
```

### Dopo (Righe 36-50):
```typescript
// Check if user has a specific redirect parameter
const specificRedirect = searchParams.get('redirect')

if (specificRedirect) {
  // If there's a specific redirect, use it
  router.push(specificRedirect)
  router.refresh()
} else {
  // Otherwise, check user role and redirect accordingly
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  // Redirect admin to admin dashboard, regular users to user dashboard
  const defaultRedirect = profile?.role === 'admin' ? '/admin/dashboard' : '/dashboard'
  router.push(defaultRedirect)
  router.refresh()
}
```

---

## 🎯 Logica di Redirect

```
┌─────────────────────────────────────────────────────────┐
│                    Login Effettuato                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ C'è parametro redirect? │
              └───────────────────────┘
                    │           │
                   Sì          No
                    │           │
                    ▼           ▼
         ┌──────────────┐  ┌──────────────┐
         │ Usa redirect │  │ Controlla    │
         │ specifico    │  │ ruolo utente │
         └──────────────┘  └──────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
            ┌──────────────┐          ┌──────────────┐
            │ role='admin' │          │ role normale │
            └──────────────┘          └──────────────┘
                    │                           │
                    ▼                           ▼
         ┌──────────────────┐      ┌──────────────────┐
         │ /admin/dashboard │      │    /dashboard    │
         └──────────────────┘      └──────────────────┘
```

---

## 🧪 Test

### Test 1: Login Admin Senza Redirect
```
1. Vai su http://localhost:3001/login
2. Login con admin@mottacarandgo.it
3. ✅ Dovresti essere reindirizzato a /admin/dashboard
4. ✅ Dovresti vedere il pannello admin con navigazione Noleggio/Vendita
```

### Test 2: Login Utente Normale Senza Redirect
```
1. Vai su http://localhost:3001/login
2. Login con un account utente normale
3. ✅ Dovresti essere reindirizzato a /dashboard
4. ✅ Dovresti vedere la dashboard utente
```

### Test 3: Login con Redirect Specifico
```
1. Vai su http://localhost:3001/login?redirect=/profilo
2. Login con qualsiasi account
3. ✅ Dovresti essere reindirizzato a /profilo
4. ✅ Il parametro redirect ha priorità sul ruolo
```

### Test 4: Admin Prova ad Accedere a Pagina Protetta
```
1. Logout
2. Vai su http://localhost:3001/admin/vendita (senza login)
3. ✅ Vieni reindirizzato a /login?redirect=/admin/vendita
4. Login come admin
5. ✅ Vieni reindirizzato a /admin/vendita (la pagina che volevi)
```

---

## 📊 Scenari di Redirect

| Scenario | URL Login | Ruolo | Redirect Finale |
|----------|-----------|-------|-----------------|
| Admin login diretto | `/login` | admin | `/admin/dashboard` ✓ |
| Utente login diretto | `/login` | user | `/dashboard` ✓ |
| Admin con redirect | `/login?redirect=/admin/vendita` | admin | `/admin/vendita` ✓ |
| Utente con redirect | `/login?redirect=/profilo` | user | `/profilo` ✓ |
| Admin accede pagina protetta | `/admin/dashboard` → `/login?redirect=/admin/dashboard` | admin | `/admin/dashboard` ✓ |

---

## ✅ Benefici

1. **✅ UX Migliorata per Admin**
   - Gli admin vanno direttamente al pannello admin
   - Non devono navigare manualmente a `/admin/dashboard`

2. **✅ Mantiene Funzionalità Esistente**
   - Il parametro `redirect` continua a funzionare
   - Gli utenti tornano alla pagina che volevano visitare

3. **✅ Logica Basata su Ruolo**
   - Ogni tipo di utente va alla sua dashboard appropriata
   - Scalabile per futuri ruoli (es: moderatore, manager)

4. **✅ Sicurezza Mantenuta**
   - Il middleware continua a proteggere le route admin
   - Anche se un utente normale prova ad accedere a `/admin/*`, viene bloccato

---

## 🔒 Sicurezza

**Nota Importante:**
Questo fix migliora solo l'UX del redirect. La **vera sicurezza** è garantita da:

1. **Middleware** (`src/middleware.ts`)
   - Blocca accesso a `/admin/*` per non-admin
   - Reindirizza a `/` se utente non è admin

2. **Layout Admin** (`src/app/admin/layout.tsx`)
   - Verifica autenticazione
   - Verifica ruolo admin
   - Doppio controllo server-side

3. **API Routes** (`src/app/api/admin/*`)
   - Verificano autenticazione
   - Verificano ruolo admin
   - Proteggono operazioni CRUD

**Il redirect è solo per comodità, non per sicurezza!**

---

## 📁 File Modificato

- ✅ `src/app/login/page.tsx` (righe 23-61)

---

## 🎉 Risultato

**Ora il login funziona correttamente!**

- ✅ Admin → `/admin/dashboard` (pannello admin)
- ✅ Utenti → `/dashboard` (dashboard utente)
- ✅ Redirect specifici rispettati
- ✅ UX migliorata
- ✅ Sicurezza mantenuta

---

**Fix implementato il 15 Ottobre 2025** 🎊

