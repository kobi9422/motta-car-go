require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Errore: Variabili d\'ambiente mancanti')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setAdmin() {
  try {
    console.log('🔍 Cerco utenti nel database...\n')

    // Get all users
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('❌ Errore:', error.message)
      return
    }

    if (!profiles || profiles.length === 0) {
      console.log('⚠️  Nessun utente trovato nel database.')
      console.log('   Registrati prima su http://localhost:3000/registrati')
      return
    }

    console.log('📋 Utenti trovati:\n')
    profiles.forEach((profile, index) => {
      console.log(`${index + 1}. ${profile.email}`)
      console.log(`   Nome: ${profile.full_name}`)
      console.log(`   Ruolo: ${profile.role}`)
      console.log(`   ID: ${profile.id}\n`)
    })

    // Set first user as admin
    const firstUser = profiles[0]
    
    if (firstUser.role === 'admin') {
      console.log(`✅ L'utente ${firstUser.email} è già admin!`)
      return
    }

    console.log(`🔧 Imposto ${firstUser.email} come admin...\n`)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', firstUser.id)

    if (updateError) {
      console.error('❌ Errore durante l\'aggiornamento:', updateError.message)
      return
    }

    console.log('✅ Fatto! L\'utente è ora admin.')
    console.log(`\n🎉 Puoi accedere alla dashboard admin su:`)
    console.log('   http://localhost:3000/admin/dashboard\n')
  } catch (error) {
    console.error('❌ Errore:', error.message)
  }
}

setAdmin()

