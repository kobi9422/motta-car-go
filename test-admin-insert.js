require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Errore: Variabili d\'ambiente mancanti')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAdminInsert() {
  console.log('🧪 Test inserimento auto come admin...\n')

  try {
    // 1. Login as admin
    console.log('1️⃣ Login come admin...')
    const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'admin@mottacarandgo.it',
      password: 'Admin123!',
    })

    if (loginError) {
      console.error('❌ Errore login:', loginError.message)
      return
    }

    console.log('✅ Login effettuato!')
    console.log(`   User ID: ${authData.user.id}`)
    console.log(`   Email: ${authData.user.email}\n`)

    // 2. Verify admin role
    console.log('2️⃣ Verifica ruolo admin...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('❌ Errore:', profileError.message)
      return
    }

    console.log(`✅ Ruolo: ${profile.role}\n`)

    if (profile.role !== 'admin') {
      console.error('❌ L\'utente non è admin!')
      return
    }

    // 3. Try to insert a test car
    console.log('3️⃣ Inserimento auto di test...')
    const testCar = {
      brand: 'Test',
      model: 'Auto Test',
      year: 2024,
      category: 'utilitaria',
      price_per_day: 99,
      seats: 5,
      transmission: 'Manuale',
      fuel_type: 'Benzina',
      available: true,
      features: ['Test Feature 1', 'Test Feature 2'],
      description: 'Questa è un\'auto di test',
      image_url: 'https://via.placeholder.com/400x300',
    }

    const { data: car, error: insertError } = await supabase
      .from('cars')
      .insert([testCar])
      .select()
      .single()

    if (insertError) {
      console.error('❌ Errore inserimento:', insertError.message)
      console.error('   Codice:', insertError.code)
      console.error('   Dettagli:', insertError.details)
      console.error('   Hint:', insertError.hint)
      return
    }

    console.log('✅ Auto inserita con successo!')
    console.log(`   ID: ${car.id}`)
    console.log(`   Marca: ${car.brand}`)
    console.log(`   Modello: ${car.model}\n`)

    // 4. Clean up - delete test car
    console.log('4️⃣ Pulizia - eliminazione auto di test...')
    const { error: deleteError } = await supabase
      .from('cars')
      .delete()
      .eq('id', car.id)

    if (deleteError) {
      console.error('❌ Errore eliminazione:', deleteError.message)
      console.log('⚠️  Elimina manualmente l\'auto con ID:', car.id)
      return
    }

    console.log('✅ Auto di test eliminata\n')

    console.log('🎉 TEST COMPLETATO CON SUCCESSO!')
    console.log('\n✅ L\'admin può inserire auto correttamente!')
    console.log('✅ Le policy RLS funzionano!')
    console.log('\n📝 Ora puoi usare la dashboard per aggiungere auto reali.')

  } catch (error) {
    console.error('❌ Errore:', error.message)
  } finally {
    // Logout
    await supabase.auth.signOut()
  }
}

testAdminInsert()

