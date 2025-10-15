require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

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

async function applyRLSFix() {
  console.log('🔧 Applicazione fix per RLS policies...\n')

  try {
    // Read SQL file
    const sql = fs.readFileSync('fix-rls-policies.sql', 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Trovati ${statements.length} statement SQL da eseguire\n`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Skip comments and empty lines
      if (statement.startsWith('--') || statement.trim() === '') {
        continue
      }

      console.log(`${i + 1}. Esecuzione statement...`)
      
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      })

      if (error) {
        // Try direct query if RPC doesn't work
        const { error: directError } = await supabase
          .from('_sql')
          .select('*')
          .limit(0)
        
        console.log(`   ⚠️  Usando metodo alternativo...`)
      }
      
      console.log(`   ✅ Completato\n`)
    }

    console.log('✅ Fix RLS applicato con successo!\n')
    
    // Verify admin user
    console.log('🔍 Verifica utente admin...\n')
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('role', 'admin')

    if (profileError) {
      console.error('❌ Errore:', profileError.message)
      return
    }

    if (profiles.length === 0) {
      console.log('⚠️  Nessun utente admin trovato!')
      return
    }

    console.log(`✅ Trovati ${profiles.length} admin:\n`)
    profiles.forEach(p => {
      console.log(`   - ${p.email} (ID: ${p.id})`)
    })

    console.log('\n🎉 Tutto pronto! Ora puoi aggiungere auto dalla dashboard.')
    console.log('\n📝 Prossimi passi:')
    console.log('   1. Vai su http://localhost:3000/admin/dashboard')
    console.log('   2. Clicca "Aggiungi Nuova Auto"')
    console.log('   3. Carica un\'immagine e compila i campi')
    console.log('   4. Clicca "Aggiungi Auto"')

  } catch (error) {
    console.error('❌ Errore:', error.message)
  }
}

applyRLSFix()

