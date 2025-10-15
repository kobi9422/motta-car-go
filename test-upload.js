require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testUpload() {
  console.log('🧪 Test upload immagine su Supabase Storage...\n')
  
  // Check if bucket exists
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
  
  if (bucketsError) {
    console.error('❌ Errore:', bucketsError.message)
    return
  }
  
  const carImagesBucket = buckets.find(b => b.name === 'car-images')
  
  if (!carImagesBucket) {
    console.log('⚠️  Bucket "car-images" non trovato. Creazione...')
    
    const { error: createError } = await supabase.storage.createBucket('car-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    })
    
    if (createError) {
      console.error('❌ Errore nella creazione:', createError.message)
      return
    }
    
    console.log('✅ Bucket creato!\n')
  } else {
    console.log('✅ Bucket "car-images" trovato\n')
  }
  
  // Create a test image (1x1 pixel PNG)
  const testImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  )
  
  const fileName = `test-${Date.now()}.png`
  
  console.log(`📤 Upload file di test: ${fileName}`)
  
  const { data, error } = await supabase.storage
    .from('car-images')
    .upload(fileName, testImageBuffer, {
      contentType: 'image/png',
      upsert: false,
    })
  
  if (error) {
    console.error('❌ Errore durante l\'upload:', error.message)
    return
  }
  
  console.log('✅ Upload completato!\n')
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('car-images')
    .getPublicUrl(fileName)
  
  console.log('🔗 URL pubblico:')
  console.log(`   ${publicUrl}\n`)
  
  // Verify file exists
  const { data: files, error: listError } = await supabase.storage
    .from('car-images')
    .list()
  
  if (listError) {
    console.error('❌ Errore nel recupero dei file:', listError.message)
    return
  }
  
  const uploadedFile = files.find(f => f.name === fileName)
  
  if (uploadedFile) {
    console.log('✅ File verificato nel bucket!')
    console.log(`   Nome: ${uploadedFile.name}`)
    console.log(`   Dimensione: ${uploadedFile.metadata.size} bytes\n`)
  } else {
    console.log('⚠️  File non trovato nel bucket\n')
  }
  
  // Clean up - delete test file
  console.log('🧹 Pulizia file di test...')
  const { error: deleteError } = await supabase.storage
    .from('car-images')
    .remove([fileName])
  
  if (deleteError) {
    console.error('❌ Errore durante l\'eliminazione:', deleteError.message)
  } else {
    console.log('✅ File di test eliminato\n')
  }
  
  console.log('🎉 Test completato con successo!')
  console.log('\n📝 Istruzioni per caricare immagini dalla dashboard:')
  console.log('   1. Vai su http://localhost:3000/admin/dashboard')
  console.log('   2. Clicca "Aggiungi Nuova Auto"')
  console.log('   3. Clicca sull\'area di upload immagine')
  console.log('   4. Seleziona un\'immagine (JPG, PNG, WEBP, max 5MB)')
  console.log('   5. Compila tutti i campi obbligatori')
  console.log('   6. Clicca "Aggiungi Auto"')
}

testUpload()

