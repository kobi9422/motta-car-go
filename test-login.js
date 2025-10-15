require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  console.log('🔐 Test login con credenziali admin...\n')
  
  const email = 'admin@mottacarandgo.it'
  const password = 'Admin123!'
  
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}\n`)
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.error('❌ Errore durante il login:')
    console.error(`   ${error.message}\n`)
    
    // Try to get more details
    if (error.status === 400) {
      console.log('💡 Suggerimento: Verifica che email e password siano corretti')
    }
    return
  }
  
  console.log('✅ Login riuscito!\n')
  console.log(`👤 Utente: ${data.user.email}`)
  console.log(`   ID: ${data.user.id}`)
  console.log(`   Token: ${data.session.access_token.substring(0, 20)}...`)
  console.log('\n🎉 Le credenziali funzionano correttamente!')
}

testLogin()

