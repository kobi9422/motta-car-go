import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Calendar, Car, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function PrenotazioniPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user bookings
  const { data: bookings } = await supabase
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Torna alla Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Le Mie Prenotazioni
          </h1>
          <p className="mt-2 text-gray-600">
            Visualizza e gestisci tutte le tue prenotazioni
          </p>
        </div>

        {/* Bookings List */}
        {bookings && bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking: any) => (
              <div
                key={booking.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-gray-200 rounded-lg w-24 h-24 flex items-center justify-center flex-shrink-0">
                        <Car className="h-12 w-12 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {booking.cars?.brand} {booking.cars?.model}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {booking.cars?.category}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              {new Date(booking.start_date).toLocaleDateString('it-IT')} -{' '}
                              {new Date(booking.end_date).toLocaleDateString('it-IT')}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{booking.pickup_location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>
                              Prenotato il {new Date(booking.created_at).toLocaleDateString('it-IT')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <p className="text-2xl font-bold text-gray-900 mb-2">
                        €{booking.total_price}
                      </p>
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

                  {booking.status === 'confirmed' && (
                    <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
                      <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Visualizza Dettagli
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
                        Modifica Prenotazione
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nessuna Prenotazione
            </h3>
            <p className="text-gray-600 mb-6">
              Non hai ancora effettuato prenotazioni
            </p>
            <Link
              href="/catalogo"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Esplora il Catalogo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

