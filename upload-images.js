require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Service Key:', supabaseKey ? 'Found' : 'Missing')

const supabase = createClient(supabaseUrl, supabaseKey)

const carImages = [
  { file: 'fiat-topolino.jpg', brand: 'Fiat', model: 'Topolino' },
  { file: 'seat-mii.jpg', brand: 'Seat', model: 'Mii' },
  { file: 'fiat-panda.jpg', brand: 'Fiat', model: 'Panda' },
  { file: 'lancia-y.jpg', brand: 'Lancia', model: 'Y' },
  { file: 'fiat-punto.jpg', brand: 'Fiat', model: 'Punto' },
  { file: 'dacia-sandero.jpg', brand: 'Dacia', model: 'Sandero' },
  { file: 'fiat-bravo.jpg', brand: 'Fiat', model: 'Bravo' },
  { file: 'fiat-500l.jpg', brand: 'Fiat', model: '500L' },
  { file: 'vw-id3.jpg', brand: 'Volkswagen', model: 'ID.3' },
  { file: 'fiat-talento.jpg', brand: 'Fiat', model: 'Talento' },
  { file: 'audi-a3.jpg', brand: 'Audi', model: 'A3' },
  { file: 'toyota-proace.jpg', brand: 'Toyota', model: 'Proace' },
  { file: 'jeep-renegade.jpg', brand: 'Jeep', model: 'Renegade' },
  { file: 'subaru-forester.jpg', brand: 'Subaru', model: 'Forester' },
  { file: 'iveco-daily.jpg', brand: 'Iveco', model: 'Daily' },
  { file: 'ford-ranger.jpg', brand: 'Ford', model: 'Ranger' },
  { file: 'range-rover-sport.jpg', brand: 'Range Rover', model: 'Sport' },
]

async function uploadImages() {
  console.log('Starting image upload...')
  
  for (const car of carImages) {
    const filePath = path.join(__dirname, 'car-images', car.file)
    const fileBuffer = fs.readFileSync(filePath)
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('car-images')
      .upload(car.file, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })
    
    if (error) {
      console.error(`Error uploading ${car.file}:`, error)
      continue
    }
    
    console.log(`✓ Uploaded ${car.file}`)
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('car-images')
      .getPublicUrl(car.file)
    
    // Update database
    const { error: updateError } = await supabase
      .from('cars')
      .update({ image_url: publicUrl })
      .eq('brand', car.brand)
      .eq('model', car.model)
    
    if (updateError) {
      console.error(`Error updating database for ${car.brand} ${car.model}:`, updateError)
    } else {
      console.log(`✓ Updated database for ${car.brand} ${car.model}`)
    }
  }
  
  console.log('\n✅ All images uploaded and database updated!')
}

uploadImages().catch(console.error)

