require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkStorage() {
  console.log('🗂️  Controllo bucket Supabase Storage...\n')
  
  // List all buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
  
  if (bucketsError) {
    console.error('❌ Errore nel recupero dei bucket:', bucketsError.message)
    return
  }
  
  console.log(`Trovati ${buckets.length} bucket:\n`)
  
  buckets.forEach(bucket => {
    console.log(`📦 Nome: ${bucket.name}`)
    console.log(`   ID: ${bucket.id}`)
    console.log(`   Pubblico: ${bucket.public ? 'Sì' : 'No'}`)
    console.log(`   Creato: ${new Date(bucket.created_at).toLocaleString('it-IT')}`)
    console.log('')
  })
  
  // Check if car-images bucket exists
  const carImagesBucket = buckets.find(b => b.name === 'car-images')
  
  if (!carImagesBucket) {
    console.log('⚠️  Il bucket "car-images" non esiste!')
    console.log('   Creazione del bucket...\n')
    
    const { data, error } = await supabase.storage.createBucket('car-images', {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    })
    
    if (error) {
      console.error('❌ Errore nella creazione del bucket:', error.message)
      return
    }
    
    console.log('✅ Bucket "car-images" creato con successo!\n')
  } else {
    console.log('✅ Il bucket "car-images" esiste ed è pubblico!\n')
    
    // List files in the bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('car-images')
      .list()
    
    if (filesError) {
      console.error('❌ Errore nel recupero dei file:', filesError.message)
      return
    }
    
    console.log(`📁 File nel bucket "car-images": ${files.length}\n`)
    
    if (files.length > 0) {
      console.log('Primi 5 file:')
      files.slice(0, 5).forEach(file => {
        console.log(`   - ${file.name} (${(file.metadata.size / 1024).toFixed(2)} KB)`)
      })
      console.log('')
    }
  }
}

checkStorage()

