import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PUT - Update car for sale
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ message: 'Accesso negato' }, { status: 403 })
    }

    // Get car data from request
    const carData = await request.json()

    // Update car in database
    const { data: car, error } = await supabase
      .from('cars_for_sale')
      .update(carData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating car for sale:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(car)
  } catch (error: any) {
    console.error('Error in PUT /api/admin/cars-for-sale/[id]:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

// DELETE - Delete car for sale
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check if user is authenticated and is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ message: 'Accesso negato' }, { status: 403 })
    }

    // Delete car from database
    const { error } = await supabase
      .from('cars_for_sale')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting car for sale:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Auto eliminata con successo' })
  } catch (error: any) {
    console.error('Error in DELETE /api/admin/cars-for-sale/[id]:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

