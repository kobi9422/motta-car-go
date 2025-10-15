import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST - Create new car
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

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

    // Insert car into database
    const { data: car, error } = await supabase
      .from('cars')
      .insert([carData])
      .select()
      .single()

    if (error) {
      console.error('Error creating car:', error)
      return NextResponse.json({ message: error.message }, { status: 500 })
    }

    return NextResponse.json(car, { status: 201 })
  } catch (error: any) {
    console.error('Error in POST /api/admin/cars:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

