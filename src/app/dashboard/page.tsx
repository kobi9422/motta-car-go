import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Car, Calendar, FileText, User } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      cars (
        brand,
        model,
        image_url
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Benvenuto, {profile?.full_name || 'Utente'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Gestisci le tue prenotazioni e il tuo profilo
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-3">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prenotazioni Attive</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings?.filter(b => b.status === 'confirmed').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-lg p-3">
                <Car className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Noleggi Completati</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings?.filter(b => b.status === 'completed').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-lg p-3">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Attesa</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings?.filter(b => b.status === 'pending').length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg p-3">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Profilo</p>
                <p className="text-sm font-bold text-gray-900">
                  {profile?.role === 'admin' ? 'Admin' : 'Utente'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Azioni Rapide</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/catalogo"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Car className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-900">Noleggia un'Auto</p>
                <p className="text-sm text-gray-600">Esplora il catalogo</p>
              </div>
            </Link>

            <Link
              href="/dashboard/prenotazioni"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-900">Le Mie Prenotazioni</p>
                <p className="text-sm text-gray-600">Visualizza tutte</p>
              </div>
            </Link>

            <Link
              href="/dashboard/profilo"
              className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="font-semibold text-gray-900">Il Mio Profilo</p>
                <p className="text-sm text-gray-600">Modifica dati</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Prenotazioni Recenti</h2>
          </div>
          <div className="p-6">
            {bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-gray-200 rounded-lg w-16 h-16 flex items-center justify-center">
                        <Car className="h-8 w-8 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {booking.cars?.brand} {booking.cars?.model}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.start_date).toLocaleDateString('it-IT')} -{' '}
                          {new Date(booking.end_date).toLocaleDateString('it-IT')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.pickup_location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">€{booking.total_price}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status === 'confirmed'
                          ? 'Confermata'
                          : booking.status === 'pending'
                          ? 'In Attesa'
                          : booking.status === 'completed'
                          ? 'Completata'
                          : 'Cancellata'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Non hai ancora prenotazioni</p>
                <Link
                  href="/catalogo"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Esplora il Catalogo
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

