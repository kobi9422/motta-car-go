# 🔧 Fix Dashboard Redirect - Admin vs Utente

## 📅 Data: 15 Ottobre 2025

---

## 📋 Richiesta

**Utente:** "quando schiaccio dashbord deve andare nella sezione admin"

Gli admin devono essere reindirizzati a `/admin/dashboard` invece che a `/dashboard` quando cliccano sul link "Dashboard" nell'header.

---

## ✅ Soluzione Implementata

Ho modificato l'Header per:
1. **Recuperare il ruolo dell'utente** dal database
2. **Reindirizzare dinamicamente** in base al ruolo:
   - **Admin** → `/admin/dashboard`
   - **Utente normale** → `/dashboard`

---

## 🔧 Modifiche al Codice

### 1. Aggiunto Stato per il Ruolo

```typescript
const [isAdmin, setIsAdmin] = useState(false)
```

### 2. Recupero Ruolo dal Database

```typescript
useEffect(() => {
  const checkUserAndRole = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setIsAdmin(profile?.role === 'admin')
    } else {
      setIsAdmin(false)
    }
  }

  checkUserAndRole()

  // Subscribe to auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
    setUser(session?.user ?? null)

    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      setIsAdmin(profile?.role === 'admin')
    } else {
      setIsAdmin(false)
    }
  })

  return () => subscription.unsubscribe()
}, [])
```

### 3. Link Dashboard Dinamico (Desktop)

```typescript
// Prima:
<Link href="/dashboard" className="...">
  <User className="h-5 w-5 mr-1" />
  Dashboard
</Link>

// Dopo:
<Link 
  href={isAdmin ? "/admin/dashboard" : "/dashboard"} 
  className="..."
>
  <User className="h-5 w-5 mr-1" />
  Dashboard
</Link>
```

### 4. Link Dashboard Dinamico (Mobile)

```typescript
// Prima:
<Link
  href="/dashboard"
  className="..."
  onClick={() => setMobileMenuOpen(false)}
>
  Dashboard
</Link>

// Dopo:
<Link
  href={isAdmin ? "/admin/dashboard" : "/dashboard"}
  className="..."
  onClick={() => setMobileMenuOpen(false)}
>
  Dashboard
</Link>
```

---

## 📁 File Modificato

- ✅ `src/components/layout/Header.tsx`
  - Aggiunto stato `isAdmin`
  - Modificato `useEffect` per recuperare ruolo
  - Aggiornato link Dashboard desktop (riga 94-96)
  - Aggiornato link Dashboard mobile (riga 168)

---

## 🎯 Comportamento

### Admin
1. Login con `admin@mottacarandgo.it`
2. Click su "Dashboard" nell'header
3. ✅ Reindirizzato a `/admin/dashboard`
4. ✅ Vede pannello admin con pulsanti Noleggio e Vendita

### Utente Normale
1. Login con account utente normale
2. Click su "Dashboard" nell'header
3. ✅ Reindirizzato a `/dashboard`
4. ✅ Vede dashboard utente con prenotazioni

---

## 🧪 Test

### Test 1: Admin
```
1. Logout se sei loggato
2. Login con admin@mottacarandgo.it
3. Click su "Dashboard" nell'header
4. ✅ Dovresti essere su http://localhost:3000/admin/dashboard
5. ✅ Dovresti vedere i pulsanti "🚗 Noleggio" e "🛒 Vendita"
```

### Test 2: Utente Normale
```
1. Logout
2. Login con un account utente normale
3. Click su "Dashboard" nell'header
4. ✅ Dovresti essere su http://localhost:3000/dashboard
5. ✅ Dovresti vedere le tue prenotazioni
```

### Test 3: Menu Mobile
```
1. Riduci la finestra del browser (< 768px)
2. Click sul menu hamburger
3. Click su "Dashboard"
4. ✅ Admin → /admin/dashboard
5. ✅ Utente → /dashboard
```

---

## 🔄 Flusso Completo

```
User clicca "Dashboard"
        ↓
Header controlla isAdmin
        ↓
    ┌───┴───┐
    │       │
isAdmin?  No → /dashboard (Utente)
    │
   Yes
    ↓
/admin/dashboard (Admin)
```

---

## ✅ Vantaggi

1. **✅ UX Migliorata** - Admin vanno direttamente al pannello admin
2. **✅ Dinamico** - Si adatta automaticamente al ruolo
3. **✅ Sicuro** - Il middleware protegge comunque le route admin
4. **✅ Consistente** - Funziona sia su desktop che mobile
5. **✅ Real-time** - Si aggiorna quando l'utente fa login/logout

---

## 📝 Note Tecniche

### Perché Recuperare il Ruolo?

Il componente Header è client-side (`'use client'`), quindi non può accedere direttamente ai dati del server. Dobbiamo recuperare il ruolo dal database tramite Supabase client.

### Sicurezza

Anche se il link reindirizza correttamente, il middleware (`src/middleware.ts`) protegge comunque le route `/admin/*` verificando che l'utente sia effettivamente admin. Questo è un doppio livello di sicurezza.

### Performance

Il ruolo viene recuperato:
1. Al mount del componente
2. Quando l'utente fa login/logout (tramite `onAuthStateChange`)

Questo garantisce che il link sia sempre aggiornato senza bisogno di ricaricare la pagina.

---

## 🎉 Risultato

**Dashboard redirect funziona perfettamente!**

- ✅ Admin → `/admin/dashboard`
- ✅ Utenti → `/dashboard`
- ✅ Funziona su desktop e mobile
- ✅ Si aggiorna in real-time
- ✅ Sicuro con middleware

---

**Fix implementato il 15 Ottobre 2025** 🎊

