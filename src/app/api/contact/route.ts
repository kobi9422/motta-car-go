import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        message: 'Tutti i campi obbligatori devono essere compilati' 
      }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        message: 'Email non valida' 
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Save contact message to database
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone: phone || null,
        subject,
        message,
        status: 'new',
      })

    if (error) {
      console.error('Error saving contact message:', error)
      return NextResponse.json({ 
        message: 'Errore nel salvataggio del messaggio' 
      }, { status: 500 })
    }

    // TODO: Send email notification to admin
    // You can integrate with SendGrid, Resend, or other email service here

    return NextResponse.json({ 
      message: 'Messaggio inviato con successo! Ti risponderemo al più presto.' 
    }, { status: 200 })

  } catch (error) {
    console.error('Error in contact API:', error)
    return NextResponse.json({ 
      message: 'Errore del server' 
    }, { status: 500 })
  }
}

