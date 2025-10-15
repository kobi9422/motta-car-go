require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Errore: Variabili d\'ambiente mancanti')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdmin() {
  try {
    console.log('🔧 Creazione account admin...\n')

    const adminEmail = 'admin@mottacarandgo.it'
    const adminPassword = 'Admin123!'
    const adminName = 'Admin Motta'

    // Check if admin already exists
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('email, role')
      .eq('email', adminEmail)

    if (existingProfiles && existingProfiles.length > 0) {
      console.log('⚠️  Un account admin esiste già!')
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Ruolo: ${existingProfiles[0].role}\n`)
      
      if (existingProfiles[0].role === 'admin') {
        console.log('✅ L\'account è già configurato come admin.')
        console.log('\n📧 Credenziali di accesso:')
        console.log(`   Email: ${adminEmail}`)
        console.log(`   Password: ${adminPassword}`)
        console.log('\n🎉 Accedi alla dashboard admin su:')
        console.log('   http://localhost:3000/admin/dashboard\n')
        return
      }
    }

    // Create user with Supabase Auth
    console.log('1️⃣  Creazione utente in Supabase Auth...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        full_name: adminName
      }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('   ⚠️  Utente già esistente in Auth')
        
        // Get user ID
        const { data: { users } } = await supabase.auth.admin.listUsers()
        const existingUser = users.find(u => u.email === adminEmail)
        
        if (existingUser) {
          console.log('2️⃣  Aggiornamento profilo...')
          
          // Update or insert profile
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: existingUser.id,
              email: adminEmail,
              full_name: adminName,
              role: 'admin'
            })

          if (profileError) {
            console.error('   ❌ Errore:', profileError.message)
            return
          }

          console.log('   ✅ Profilo aggiornato\n')
          console.log('✅ Account admin configurato con successo!\n')
          console.log('📧 Credenziali di accesso:')
          console.log(`   Email: ${adminEmail}`)
          console.log(`   Password: ${adminPassword}`)
          console.log('\n🎉 Accedi alla dashboard admin su:')
          console.log('   http://localhost:3000/admin/dashboard\n')
          return
        }
      }
      
      console.error('   ❌ Errore:', authError.message)
      return
    }

    console.log('   ✅ Utente creato')

    // Create or update profile
    console.log('2️⃣  Creazione profilo...')
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: adminEmail,
        full_name: adminName,
        role: 'admin'
      }, {
        onConflict: 'id'
      })

    if (profileError) {
      console.error('   ❌ Errore:', profileError.message)
      return
    }

    console.log('   ✅ Profilo creato\n')

    console.log('✅ Account admin creato con successo!\n')
    console.log('📧 Credenziali di accesso:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Password: ${adminPassword}`)
    console.log('\n🎉 Accedi alla dashboard admin su:')
    console.log('   http://localhost:3000/admin/dashboard\n')

  } catch (error) {
    console.error('❌ Errore:', error.message)
  }
}

createAdmin()

