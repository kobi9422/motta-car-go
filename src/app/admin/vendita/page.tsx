import { createClient } from '@/lib/supabase/server'
import CarForSaleManagement from '@/components/admin/CarForSaleManagement'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminVenditaPage() {
  const supabase = await createClient()

  // Get all cars for sale
  const { data: cars, error } = await supabase
    .from('cars_for_sale')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching cars for sale:', error)
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Gestione Auto in Vendita</h2>
        <p className="mt-2 text-gray-600">
          Aggiungi, modifica o elimina le auto disponibili per la vendita
        </p>
      </div>

      <CarForSaleManagement initialCars={cars || []} />
    </div>
  )
}

