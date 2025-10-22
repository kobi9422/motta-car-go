import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Car, Users, Fuel, Settings, CheckCircle, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Get car details
  const { data: car, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !car) {
    notFound()
  }

  // Get similar cars (same category, different car)
  const { data: similarCars } = await supabase
    .from('cars')
    .select('*')
    .eq('category', car.category)
    .eq('available', true)
    .neq('id', id)
    .limit(3)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/catalogo"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Torna al Catalogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Car Image */}
          <div>
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-4">
              <Image
                src={car.image_url || 'https://placehold.co/800x600/2563EB/FFFFFF/png?text=Auto'}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative h-24 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={car.image_url || 'https://placehold.co/300x200/2563EB/FFFFFF/png?text=Auto'}
                    alt={`${car.brand} ${car.model} - ${i}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Car Details */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {car.brand} {car.model}
              </h1>
              <p className="text-xl text-gray-600">{car.category}</p>
            </div>

            {/* Price */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-blue-600">€{car.price_per_day}</span>
                <span className="text-xl text-gray-600 ml-2">/giorno</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Assicurazione e chilometraggio illimitato inclusi
              </p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center p-4 bg-white rounded-lg shadow">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Posti</p>
                  <p className="text-lg font-semibold text-gray-900">{car.seats}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow">
                <Settings className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Trasmissione</p>
                  <p className="text-lg font-semibold text-gray-900">{car.transmission}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow">
                <Fuel className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Carburante</p>
                  <p className="text-lg font-semibold text-gray-900">{car.fuel_type}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow">
                <Car className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Anno</p>
                  <p className="text-lg font-semibold text-gray-900">{car.year}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descrizione</h2>
              <p className="text-gray-600 leading-relaxed">
                {car.description || 'Questa auto è perfetta per i tuoi viaggi. Comoda, affidabile e con tutte le caratteristiche che cerchi.'}
              </p>
            </div>

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Caratteristiche</h2>
                <div className="grid grid-cols-2 gap-3">
                  {car.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Link
                href={`/prenota/${car.id}`}
                className="block w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition text-center"
              >
                Prenota Ora
              </Link>
              <Link
                href="/contatti"
                className="block w-full bg-gray-200 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-300 transition text-center"
              >
                Richiedi Informazioni
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cosa Include il Noleggio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Assicurazione Completa</h3>
                <p className="text-sm text-gray-600">
                  Kasko, furto e responsabilità civile inclusi
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Chilometraggio Illimitato</h3>
                <p className="text-sm text-gray-600">
                  Guida senza limiti di chilometri
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Assistenza 24/7</h3>
                <p className="text-sm text-gray-600">
                  Supporto sempre disponibile
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Cars */}
        {similarCars && similarCars.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Auto Simili</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarCars.map((similarCar: any) => (
                <Link
                  key={similarCar.id}
                  href={`/catalogo/${similarCar.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition block"
                >
                  <div className="relative h-48">
                    <Image
                      src={similarCar.image_url || '/placeholder-car.jpg'}
                      alt={`${similarCar.brand} ${similarCar.model}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">
                      {similarCar.brand} {similarCar.model}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{similarCar.category}</p>
                    <p className="text-blue-600 font-semibold">€{similarCar.price_per_day}/giorno</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

