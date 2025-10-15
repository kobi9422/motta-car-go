import { createClient } from '@/lib/supabase/server'
import AdminDashboardTabs from '@/components/admin/AdminDashboardTabs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get all rental cars
  const { data: rentalCars, error: rentalError } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  if (rentalError) {
    console.error('Error fetching rental cars:', rentalError)
  }

  // Get all cars for sale
  const { data: saleCars, error: saleError } = await supabase
    .from('cars_for_sale')
    .select('*')
    .order('created_at', { ascending: false })

  if (saleError) {
    console.error('Error fetching cars for sale:', saleError)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="mt-2 text-gray-600">
          Gestisci tutte le auto disponibili per noleggio e vendita
        </p>
      </div>

      <AdminDashboardTabs
        rentalCars={rentalCars || []}
        saleCars={saleCars || []}
      />
    </div>
  )
}

