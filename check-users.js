require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkUsers() {
  console.log('🔍 Controllo utenti in Supabase Auth...\n')
  
  const { data, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('❌ Errore:', error.message)
    return
  }
  
  console.log(`Trovati ${data.users.length} utenti:\n`)
  
  data.users.forEach(user => {
    console.log(`📧 Email: ${user.email}`)
    console.log(`   ID: ${user.id}`)
    console.log(`   Confermato: ${user.email_confirmed_at ? 'Sì' : 'No'}`)
    console.log(`   Creato: ${new Date(user.created_at).toLocaleString('it-IT')}`)
    console.log('')
  })
  
  // Check profiles
  console.log('🔍 Controllo profili nel database...\n')
  
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
  
  if (profileError) {
    console.error('❌ Errore:', profileError.message)
    return
  }
  
  console.log(`Trovati ${profiles.length} profili:\n`)
  
  profiles.forEach(profile => {
    console.log(`👤 Nome: ${profile.full_name}`)
    console.log(`   Email: ${profile.email}`)
    console.log(`   Ruolo: ${profile.role}`)
    console.log(`   ID: ${profile.id}`)
    console.log('')
  })
}

checkUsers()

