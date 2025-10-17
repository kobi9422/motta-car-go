import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Users, Fuel, Settings, Calendar, Gauge } from 'lucide-react'

// Disable caching for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Helper function to format numbers with Italian locale (consistent on server and client)
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default async function VenditaPage() {
  const supabase = await createClient()

  // Get all available cars for sale
  const { data: cars, error } = await supabase
    .from('cars_for_sale')
    .select('*')
    .eq('available', true)
    .order('price', { ascending: true })

  if (error) {
    console.error('Error fetching cars for sale:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Auto in Vendita
          </h1>
          <p className="text-xl text-gray-600">
            Trova l'auto perfetta da acquistare
          </p>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Auto Selezionate</h3>
              <p className="text-sm text-gray-600">Tutte le auto sono controllate e certificate</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Settings className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Garanzia Inclusa</h3>
              <p className="text-sm text-gray-600">12 mesi di garanzia su tutte le auto</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Finanziamenti</h3>
              <p className="text-sm text-gray-600">Soluzioni di pagamento personalizzate</p>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {cars && cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car: any) => (
              <div
                key={car.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Car Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <Image
                    src={car.image_url || 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Auto'}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-sm font-semibold text-gray-900">
                      €{formatNumber(car.price)}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full shadow-md">
                    <span className="text-xs font-semibold">
                      {car.condition}
                    </span>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{car.category}</p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{car.year}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Gauge className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{formatNumber(car.mileage)} km</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{car.seats} posti</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Settings className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{car.transmission}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 col-span-2">
                      <Fuel className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{car.fuel_type}</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-xs text-gray-500">
                      {car.previous_owners} {car.previous_owners === 1 ? 'proprietario' : 'proprietari'}
                    </p>
                  </div>

                  {/* Features */}
                  {car.features && car.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {car.features.slice(0, 3).map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {car.features.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            +{car.features.length - 3} altro
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Link
                    href={`/contatti?auto=${car.brand}+${car.model}`}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Richiedi Informazioni
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">
              Nessuna auto disponibile al momento
            </p>
          </div>
        )}

        {/* Why Buy Section */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Perché acquistare da Motta car & go?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Auto Controllate</h3>
              <p className="text-sm text-gray-600">
                Ogni auto è sottoposta a controlli rigorosi prima della vendita
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Garanzia 12 Mesi</h3>
              <p className="text-sm text-gray-600">
                Tutte le auto includono 12 mesi di garanzia
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Finanziamenti</h3>
              <p className="text-sm text-gray-600">
                Offriamo soluzioni di finanziamento personalizzate
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gauge className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Permuta</h3>
              <p className="text-sm text-gray-600">
                Valutiamo la tua auto usata per la permuta
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Non hai trovato l'auto che cercavi?
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            Contattaci e ti aiuteremo a trovare l'auto perfetta per te
          </p>
          <Link
            href="/contatti"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Contattaci Ora
          </Link>
        </div>
      </div>
    </div>
  )
}

