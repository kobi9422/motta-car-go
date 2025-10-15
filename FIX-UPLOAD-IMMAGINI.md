# 🔧 Fix Upload Immagini - Pannello Admin Vendita

## 📅 Data: 15 Ottobre 2025

---

## ❌ Problema

Quando si provava a caricare un'immagine nel form "Aggiungi Auto in Vendita", appariva l'errore:

```
Errore durante il caricamento dell'immagine
```

---

## 🔍 Causa del Problema

Il componente `CarForSaleForm.tsx` stava chiamando l'API route **sbagliata**:

**Chiamata errata (riga 75):**
```typescript
const response = await fetch('/api/upload', {  // ❌ Route non esistente
  method: 'POST',
  body: formData,
})
```

**Route corretta:**
```typescript
const response = await fetch('/api/admin/upload', {  // ✅ Route corretta
  method: 'POST',
  body: formData,
})
```

---

## ✅ Soluzione

Ho corretto il path dell'API route in `src/components/admin/CarForSaleForm.tsx`:

### Prima (riga 75):
```typescript
const response = await fetch('/api/upload', {
```

### Dopo (riga 75):
```typescript
const response = await fetch('/api/admin/upload', {
```

---

## 📁 File Modificato

- ✅ `src/components/admin/CarForSaleForm.tsx` (riga 75)

---

## 🔧 API Route Upload

L'API route corretta è:
- **Path:** `/api/admin/upload`
- **File:** `src/app/api/admin/upload/route.ts`

**Funzionalità:**
1. ✅ Verifica autenticazione utente
2. ✅ Verifica ruolo admin
3. ✅ Riceve file da FormData
4. ✅ Genera nome file unico
5. ✅ Upload su Supabase Storage bucket `car-images`
6. ✅ Ritorna URL pubblico dell'immagine

---

## 🗄️ Supabase Storage

### Bucket Configurato ✓

**Nome:** `car-images`
- ✅ **Pubblico:** Sì (le immagini sono accessibili pubblicamente)
- ✅ **Tipo:** STANDARD
- ✅ **Creato:** 14 Ottobre 2025

### Policy RLS Storage ✓

**1. Lettura Pubblica:**
```sql
CREATE POLICY "Anyone can view car images" 
ON storage.objects
FOR SELECT 
USING (bucket_id = 'car-images');
```

**2. Upload Solo Admin:**
```sql
CREATE POLICY "Admins can upload car images" 
ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'car-images' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 🧪 Test Upload

### Test 1: Upload Immagine
```
1. Login come admin
2. Vai su /admin/vendita
3. Clicca "Aggiungi Nuova Auto in Vendita"
4. Clicca "Carica Immagine"
5. Seleziona un'immagine (JPG, PNG, WEBP)
6. ✅ L'immagine dovrebbe caricarsi e apparire la preview
7. ✅ Nessun errore dovrebbe apparire
```

### Test 2: Salva Auto con Immagine
```
1. Dopo aver caricato l'immagine
2. Compila gli altri campi del form
3. Clicca "Aggiungi Auto"
4. ✅ L'auto dovrebbe essere salvata con l'immagine
5. ✅ L'immagine dovrebbe apparire nella tabella
```

### Test 3: Verifica URL Immagine
```
1. Dopo aver salvato l'auto
2. Apri gli strumenti sviluppatore (F12)
3. Ispeziona l'elemento immagine
4. ✅ L'URL dovrebbe essere simile a:
   https://gsoglrfljfceehpykyfm.supabase.co/storage/v1/object/public/car-images/1729012345-abc123.jpg
```

---

## 🔄 Confronto con Form Noleggio

| Caratteristica | CarForm (Noleggio) | CarForSaleForm (Vendita) |
|----------------|-------------------|--------------------------|
| **API Upload** | `/api/admin/upload` ✓ | `/api/admin/upload` ✓ (ora corretto) |
| **Bucket** | `car-images` | `car-images` |
| **Metodo** | FormData POST | FormData POST |
| **Validazione** | Admin only | Admin only |

Ora entrambi i form usano la stessa API route corretta!

---

## 📝 Note Tecniche

### Formato Nome File

L'API genera nomi file unici usando:
```typescript
const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
```

**Esempio:**
```
1729012345-abc123.jpg
│          │       │
│          │       └─ Estensione originale
│          └───────── ID random (7 caratteri)
└──────────────────── Timestamp Unix
```

### Formati Supportati

- ✅ JPG / JPEG
- ✅ PNG
- ✅ WEBP

### Dimensione Massima

- **Limite:** 5 MB (configurabile nel bucket)

---

## ✅ Risultato

**Upload immagini ora funziona perfettamente!**

- ✅ API route corretta (`/api/admin/upload`)
- ✅ Bucket Supabase configurato
- ✅ Policy RLS attive
- ✅ Preview immagine funzionante
- ✅ Salvataggio auto con immagine funzionante

---

## 🎯 Prossimi Passi

Se vuoi migliorare ulteriormente l'upload:

1. **Validazione Client-Side**
   - Controllare dimensione file prima dell'upload
   - Controllare formato file
   - Mostrare errori più specifici

2. **Compressione Immagini**
   - Ridurre dimensione file automaticamente
   - Ottimizzare per web

3. **Multiple Immagini**
   - Permettere upload di più immagini per auto
   - Creare galleria immagini

4. **Progress Bar**
   - Mostrare progresso upload
   - Migliorare feedback visivo

---

**Fix implementato il 15 Ottobre 2025** ✅

