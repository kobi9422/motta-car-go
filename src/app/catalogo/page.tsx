'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Users, Fuel, Settings, Loader2 } from 'lucide-react'

export default function CatalogoPage() {
  const [cars, setCars] = useState<any[]>([])
  const [filteredCars, setFilteredCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    transmission: '',
    fuel_type: '',
    max_price: ''
  })

  const supabase = createClient()

  // Load cars
  useEffect(() => {
    async function loadCars() {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('available', true)
        .order('price_per_day', { ascending: true })

      if (error) {
        console.error('Error fetching cars:', error)
      } else {
        setCars(data || [])
        setFilteredCars(data || [])
      }
      setLoading(false)
    }
    loadCars()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...cars]

    if (filters.category) {
      result = result.filter(car =>
        car.category.toLowerCase() === filters.category.toLowerCase()
      )
    }

    if (filters.transmission) {
      result = result.filter(car =>
        car.transmission.toLowerCase() === filters.transmission.toLowerCase()
      )
    }

    if (filters.fuel_type) {
      result = result.filter(car =>
        car.fuel_type.toLowerCase() === filters.fuel_type.toLowerCase()
      )
    }

    if (filters.max_price) {
      result = result.filter(car =>
        car.price_per_day <= parseInt(filters.max_price)
      )
    }

    setFilteredCars(result)
  }, [filters, cars])

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    )
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
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tutte le categorie</option>
                <option value="Utilitaria">Utilitaria</option>
                <option value="Compatta">Compatta</option>
                <option value="Berlina">Berlina</option>
                <option value="SUV">SUV</option>
                <option value="Elettrica">Elettrica</option>
                <option value="Furgone">Furgone</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trasmissione
              </label>
              <select
                value={filters.transmission}
                onChange={(e) => handleFilterChange('transmission', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tutte</option>
                <option value="Manuale">Manuale</option>
                <option value="Automatico">Automatico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carburante
              </label>
              <select
                value={filters.fuel_type}
                onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tutti</option>
                <option value="Benzina">Benzina</option>
                <option value="Diesel">Diesel</option>
                <option value="Elettrico">Elettrico</option>
                <option value="Ibrido">Ibrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prezzo Max/Giorno
              </label>
              <select
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Qualsiasi</option>
                <option value="50">Fino a €50</option>
                <option value="75">Fino a €75</option>
                <option value="100">Fino a €100</option>
                <option value="150">Fino a €150</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Trovate <span className="font-semibold text-gray-900">{filteredCars.length}</span> auto
          </div>
        </div>

        {/* Cars Grid */}
        {filteredCars && filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car: any) => (
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

