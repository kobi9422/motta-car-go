import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 })
    }

    // Get booking data from request
    const body = await request.json()
    const {
      car_id,
      start_date,
      end_date,
      pickup_location,
      dropoff_location,
      total_price,
      documents,
    } = body

    // Validation
    if (!car_id || !start_date || !end_date || !pickup_location || !dropoff_location || !total_price) {
      return NextResponse.json({ 
        message: 'Dati mancanti' 
      }, { status: 400 })
    }

    if (!documents || documents.length < 2) {
      return NextResponse.json({ 
        message: 'Carica sia la patente che la carta d\'identità' 
      }, { status: 400 })
    }

    // Check if car exists and is available
    const { data: car, error: carError } = await supabase
      .from('cars')
      .select('*')
      .eq('id', car_id)
      .single()

    if (carError || !car) {
      return NextResponse.json({ 
        message: 'Auto non trovata' 
      }, { status: 404 })
    }

    if (!car.available) {
      return NextResponse.json({ 
        message: 'Auto non disponibile' 
      }, { status: 400 })
    }

    // Check for overlapping bookings
    const { data: overlappingBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('car_id', car_id)
      .in('status', ['pending', 'confirmed'])
      .or(`start_date.lte.${end_date},end_date.gte.${start_date}`)

    if (overlappingBookings && overlappingBookings.length > 0) {
      return NextResponse.json({ 
        message: 'Auto non disponibile per le date selezionate' 
      }, { status: 400 })
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        car_id,
        start_date,
        end_date,
        pickup_location,
        dropoff_location,
        total_price,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json({ 
        message: bookingError.message 
      }, { status: 500 })
    }

    // Save documents to database
    for (const doc of documents) {
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          booking_id: booking.id,
          document_type: doc.type,
          file_url: doc.url,
          file_name: doc.fileName,
          verified: false,
        })

      if (docError) {
        console.error('Error saving document:', docError)
        // Continue even if document save fails
      }
    }

    // Generate contract PDF
    try {
      const contractResponse = await fetch(
        `${request.nextUrl.origin}/api/generate-contract/${booking.id}`,
        {
          method: 'GET',
          headers: {
            'Cookie': request.headers.get('cookie') || '',
          },
        }
      )

      if (contractResponse.ok) {
        const contractData = await contractResponse.json()
        
        // Update booking with contract URL
        await supabase
          .from('bookings')
          .update({ contract_url: contractData.url })
          .eq('id', booking.id)
      }
    } catch (error) {
      console.error('Error generating contract:', error)
      // Continue even if contract generation fails
    }

    return NextResponse.json({
      success: true,
      booking,
      message: 'Prenotazione creata con successo',
    })
  } catch (error: any) {
    console.error('Error in bookings API:', error)
    return NextResponse.json({ 
      message: error.message || 'Errore nella creazione della prenotazione' 
    }, { status: 500 })
  }
}

// GET - List user's bookings
export async function GET() {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 })
    }

    // Get user's bookings
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        cars (
          brand,
          model,
          image_url,
          category
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json({ 
        message: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error: any) {
    console.error('Error in bookings GET:', error)
    return NextResponse.json({ 
      message: error.message || 'Errore nel recupero delle prenotazioni' 
    }, { status: 500 })
  }
}

