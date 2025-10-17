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

    // Get file and document type from request
    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('document_type') as string

    if (!file) {
      return NextResponse.json({ message: 'Nessun file fornito' }, { status: 400 })
    }

    if (!documentType || !['license', 'id_card'].includes(documentType)) {
      return NextResponse.json({ message: 'Tipo documento non valido' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        message: 'Formato file non valido. Usa JPG, PNG o PDF.' 
      }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        message: 'Il file è troppo grande. Massimo 5MB.' 
      }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${documentType}-${Date.now()}.${fileExt}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage (documents bucket)
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return NextResponse.json({ 
        message: uploadError.message 
      }, { status: 500 })
    }

    // Get the file URL (private URL, will need signed URL to access)
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      documentType,
    })
  } catch (error: any) {
    console.error('Error in upload-document:', error)
    return NextResponse.json({ 
      message: error.message || 'Errore nel caricamento del documento' 
    }, { status: 500 })
  }
}

