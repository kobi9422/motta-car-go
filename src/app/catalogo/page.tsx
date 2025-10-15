import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Users, Fuel, Settings } from 'lucide-react'

// Disable caching for this page
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CatalogoPage() {
  const supabase = await createClient()

  // Get all available cars
  const { data: cars, error } = await supabase
    .from('cars')
    .select('*')
    .eq('available', true)
    .order('price_per_day', { ascending: true })

  if (error) {
    console.error('Error fetching cars:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Catalogo Auto
          </h1>
          <p className="text-xl text-gray-600">
            Scegli l'auto perfetta per il tuo viaggio
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tutte le categorie</option>
                <option value="utilitaria">Utilitaria</option>
                <option value="compatta">Compatta</option>
                <option value="berlina">Berlina</option>
                <option value="suv">SUV</option>
                <option value="elettrica">Elettrica</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trasmissione
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tutte</option>
                <option value="manuale">Manuale</option>
                <option value="automatico">Automatico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carburante
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tutti</option>
                <option value="benzina">Benzina</option>
                <option value="diesel">Diesel</option>
                <option value="elettrico">Elettrico</option>
                <option value="ibrido">Ibrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prezzo Max/Giorno
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Qualsiasi</option>
                <option value="50">Fino a €50</option>
                <option value="75">Fino a €75</option>
                <option value="100">Fino a €100</option>
              </select>
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
                      €{car.price_per_day}/giorno
                    </span>
                  </div>
                </div>

                {/* Car Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-gray-600">{car.category}</p>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {car.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {car.seats} posti
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Settings className="h-4 w-4 mr-2" />
                      {car.transmission}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Fuel className="h-4 w-4 mr-2" />
                      {car.fuel_type}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Car className="h-4 w-4 mr-2" />
                      {car.year}
                    </div>
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
                    href={`/catalogo/${car.id}`}
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Prenota Ora
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

        {/* Info Section */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Perché scegliere Motta car & go?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                ✓
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Prezzi Trasparenti</h3>
              <p className="text-sm text-gray-600">
                Nessun costo nascosto, tutto incluso nel prezzo
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                ✓
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assicurazione Completa</h3>
              <p className="text-sm text-gray-600">
                Tutte le auto includono assicurazione kasko
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                ✓
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assistenza 24/7</h3>
              <p className="text-sm text-gray-600">
                Supporto sempre disponibile per qualsiasi necessità
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

