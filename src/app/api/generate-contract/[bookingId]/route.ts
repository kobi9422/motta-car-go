import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const supabase = await createClient()
    const { bookingId } = await params

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 })
    }

    // Get booking details with car and user info
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        cars (
          brand,
          model,
          year,
          category,
          transmission,
          fuel_type,
          seats,
          price_per_day
        )
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ 
        message: 'Prenotazione non trovata' 
      }, { status: 404 })
    }

    // Check if user owns this booking or is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name, email, phone, address, city, postal_code')
      .eq('id', user.id)
      .single()

    if (booking.user_id !== user.id && profile?.role !== 'admin') {
      return NextResponse.json({ 
        message: 'Accesso negato' 
      }, { status: 403 })
    }

    // Generate PDF
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPos = 20

    // Helper function to add text
    const addText = (text: string, x: number, y: number, options: any = {}) => {
      pdf.setFontSize(options.fontSize || 12)
      pdf.setFont('helvetica', options.fontStyle || 'normal')
      pdf.text(text, x, y, options)
    }

    // Header
    pdf.setFillColor(37, 99, 235) // Blue
    pdf.rect(0, 0, pageWidth, 40, 'F')
    
    pdf.setTextColor(255, 255, 255)
    addText('MOTTA CAR & GO SRL', pageWidth / 2, 15, { 
      fontSize: 20, 
      fontStyle: 'bold',
      align: 'center' 
    })
    addText('Contratto di Noleggio Auto', pageWidth / 2, 28, { 
      fontSize: 14,
      align: 'center' 
    })

    pdf.setTextColor(0, 0, 0)
    yPos = 55

    // Contract Number and Date
    addText(`Contratto N°: ${booking.id.substring(0, 8).toUpperCase()}`, 20, yPos, { 
      fontSize: 10,
      fontStyle: 'bold' 
    })
    yPos += 6
    addText(`Data: ${format(new Date(), 'dd MMMM yyyy', { locale: it })}`, 20, yPos, { 
      fontSize: 10 
    })
    yPos += 15

    // Section: Customer Info
    pdf.setFillColor(240, 240, 240)
    pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F')
    addText('DATI CLIENTE', 20, yPos, { fontSize: 12, fontStyle: 'bold' })
    yPos += 12

    addText(`Nome: ${profile?.full_name || 'N/A'}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Email: ${profile?.email || 'N/A'}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Telefono: ${profile?.phone || 'N/A'}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    if (profile?.address) {
      addText(`Indirizzo: ${profile.address}, ${profile.city || ''} ${profile.postal_code || ''}`, 20, yPos, { 
        fontSize: 10 
      })
      yPos += 6
    }
    yPos += 10

    // Section: Car Info
    pdf.setFillColor(240, 240, 240)
    pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F')
    addText('VEICOLO NOLEGGIATO', 20, yPos, { fontSize: 12, fontStyle: 'bold' })
    yPos += 12

    const car = booking.cars as any
    addText(`Marca e Modello: ${car.brand} ${car.model}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Anno: ${car.year}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Categoria: ${car.category}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Trasmissione: ${car.transmission}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Carburante: ${car.fuel_type}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Posti: ${car.seats}`, 20, yPos, { fontSize: 10 })
    yPos += 10

    // Section: Rental Details
    pdf.setFillColor(240, 240, 240)
    pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F')
    addText('DETTAGLI NOLEGGIO', 20, yPos, { fontSize: 12, fontStyle: 'bold' })
    yPos += 12

    addText(`Data Ritiro: ${format(new Date(booking.start_date), 'dd MMMM yyyy', { locale: it })}`, 20, yPos, { 
      fontSize: 10 
    })
    yPos += 6
    addText(`Data Consegna: ${format(new Date(booking.end_date), 'dd MMMM yyyy', { locale: it })}`, 20, yPos, { 
      fontSize: 10 
    })
    yPos += 6
    addText(`Luogo Ritiro: ${booking.pickup_location}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Luogo Consegna: ${booking.dropoff_location}`, 20, yPos, { fontSize: 10 })
    yPos += 10

    // Section: Price
    pdf.setFillColor(240, 240, 240)
    pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F')
    addText('DETTAGLI PAGAMENTO', 20, yPos, { fontSize: 12, fontStyle: 'bold' })
    yPos += 12

    const days = Math.ceil(
      (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / 
      (1000 * 60 * 60 * 24)
    )

    addText(`Tariffa giornaliera: €${car.price_per_day.toFixed(2)}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Numero giorni: ${days}`, 20, yPos, { fontSize: 10 })
    yPos += 6
    addText(`Totale: €${booking.total_price.toFixed(2)}`, 20, yPos, { 
      fontSize: 12,
      fontStyle: 'bold' 
    })
    yPos += 15

    // Section: Terms and Conditions
    pdf.setFillColor(240, 240, 240)
    pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F')
    addText('TERMINI E CONDIZIONI', 20, yPos, { fontSize: 12, fontStyle: 'bold' })
    yPos += 12

    const terms = [
      'Art. 1 – Oggetto del contratto',
      'Il Noleggiante concede in locazione al Cliente il veicolo sopra indicato, nelle condizioni descritte nella scheda di consegna.',
      '',
      'Art. 2 – Durata del noleggio',
      'Il noleggio ha inizio e termine nelle date sopra indicate. Ogni proroga non autorizzata sarà considerata ritardo nella riconsegna.',
      '',
      'Art. 3 – Corrispettivo',
      'Il Cliente corrisponderà al Noleggiante il canone di noleggio indicato. Il pagamento avverrà anticipatamente al momento del ritiro del veicolo. Chilometraggio illimitato sul territorio italiano.',
      '',
      'Art. 4 – Uso del veicolo',
      'Il Cliente si impegna a: utilizzare il veicolo esclusivamente per uso privato lecito; non cedere a terzi la guida senza autorizzazione; rispettare le norme del Codice della Strada; restituire il veicolo nelle stesse condizioni in cui lo ha ricevuto (salvo normale usura).',
      '',
      'Art. 5 – Manutenzione e guasti',
      'In caso di guasto, il Cliente dovrà contattare immediatamente il Noleggiante al +39 351 987 6543 e non potrà far eseguire riparazioni senza consenso scritto.',
      '',
      'Art. 6 – Assicurazione e responsabilità',
      'Il veicolo è coperto da assicurazione RCA, Kasko Collisione, Furto e Incendio secondo la normativa vigente. Eventuali danni non coperti dalla polizza restano a carico del Cliente, entro i limiti della franchigia.',
      '',
      'Art. 7 – Franchigia e cauzione',
      'Il Cliente versa una cauzione di €500,00 al momento del ritiro del veicolo, tramite carta di credito intestata al conducente. La franchigia in caso di sinistro con responsabilità del conducente è di €500,00. La cauzione verrà restituita entro 14 giorni lavorativi dalla riconsegna del veicolo, previa verifica dell\'assenza di danni.',
      '',
      'Art. 8 – Riconsegna del veicolo',
      'Il veicolo dovrà essere riconsegnato nel luogo e all\'orario stabilito, con il pieno di carburante. In caso di ritardo o mancato rifornimento, saranno addebitati i relativi costi.',
      '',
      'Art. 9 – Sanzioni e multe',
      'Tutte le sanzioni amministrative o violazioni al Codice della Strada commesse durante il noleggio saranno a carico del Cliente, anche se pervenute successivamente alla riconsegna. Il Noleggiante è autorizzato a comunicare i dati del Cliente alle autorità.',
      '',
      'Art. 10 – Risoluzione e annullamento',
      'Il Noleggiante può risolvere il contratto per uso improprio o violazione delle clausole. In caso di annullamento da parte del Cliente fino a 48 ore prima del ritiro, verrà applicata una penale del 20% del totale. Oltre tale termine, la penale sarà del 50%.',
      '',
      'Art. 11 – Foro competente',
      'Per qualsiasi controversia sarà competente il Foro di Lecco. Il contratto è regolato dalla legge italiana.',
      '',
      'Art. 12 – Trattamento dati personali',
      'Il Cliente autorizza il trattamento dei propri dati personali ai sensi del Regolamento UE 2016/679 (GDPR).',
    ]

    pdf.setFontSize(9)
    terms.forEach(term => {
      if (yPos > pageHeight - 30) {
        pdf.addPage()
        yPos = 20
      }
      const lines = pdf.splitTextToSize(term, pageWidth - 40)
      pdf.text(lines, 20, yPos)
      yPos += lines.length * 5
    })

    yPos += 10

    // Signatures
    if (yPos > pageHeight - 50) {
      pdf.addPage()
      yPos = 20
    }

    addText('Firma Cliente: _____________________', 20, yPos, { fontSize: 10 })
    addText('Firma Motta Car & Go: _____________________', pageWidth / 2 + 10, yPos, { fontSize: 10 })
    yPos += 20

    // Footer
    pdf.setFontSize(8)
    pdf.setTextColor(128, 128, 128)
    const footerText = 'Motta Car & Go SRL - Via Giuseppe Parini, 5 - 23891 Barzanò (LC) - P.IVA: 03456789012 - Tel: +39 351 987 6543'
    addText(footerText, pageWidth / 2, pageHeight - 10, {
      fontSize: 8,
      align: 'center'
    })

    // Convert PDF to buffer
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    // Upload PDF to Supabase Storage
    const fileName = `contracts/${booking.id}.pdf`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('Error uploading contract:', uploadError)
      return NextResponse.json({ 
        message: 'Errore nel salvataggio del contratto' 
      }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: 'Contratto generato con successo',
    })
  } catch (error: any) {
    console.error('Error generating contract:', error)
    return NextResponse.json({ 
      message: error.message || 'Errore nella generazione del contratto' 
    }, { status: 500 })
  }
}

