'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, X, Gauge, Calendar } from 'lucide-react'
import CarForSaleForm from './CarForSaleForm'

// Helper function to format numbers with Italian locale (consistent on server and client)
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

interface CarForSale {
  id: string
  brand: string
  model: string
  year: number
  category: string
  price: number
  mileage: number
  seats: number
  transmission: string
  fuel_type: string
  image_url: string
  available: boolean
  features: string[]
  description: string
  condition: 'Nuova' | 'Usata' | 'Km 0'
  previous_owners: number
  registration_date: string | null
  last_service_date: string | null
}

export default function CarForSaleManagement({ initialCars }: { initialCars: CarForSale[] }) {
  const [cars, setCars] = useState<CarForSale[]>(initialCars)
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<CarForSale | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa auto?')) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/cars-for-sale/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Errore durante l\'eliminazione')
      }

      setCars(cars.filter(car => car.id !== id))
    } catch (error) {
      console.error('Error deleting car:', error)
      alert('Errore durante l\'eliminazione dell\'auto')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (car: CarForSale) => {
    setEditingCar(car)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCar(null)
  }

  const handleCarSaved = (savedCar: CarForSale) => {
    if (editingCar) {
      // Update existing car
      setCars(cars.map(car => car.id === savedCar.id ? savedCar : car))
    } else {
      // Add new car
      setCars([savedCar, ...cars])
    }
    handleFormClose()
  }

  return (
    <div>
      {/* Add Car Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Aggiungi Nuova Auto in Vendita
        </button>
      </div>

      {/* Car Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingCar ? 'Modifica Auto in Vendita' : 'Aggiungi Nuova Auto in Vendita'}
              </h3>
              <button
                onClick={handleFormClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <CarForSaleForm
                car={editingCar}
                onSave={handleCarSaved}
                onCancel={handleFormClose}
              />
            </div>
          </div>
        </div>
      )}

      {/* Cars Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Auto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Condizione
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prezzo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Km
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Disponibilità
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={car.image_url}
                      alt={`${car.brand} ${car.model}`}
                      className="h-12 w-20 object-cover rounded"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {car.brand} {car.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {car.year} • {car.transmission} • {car.fuel_type}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    car.condition === 'Nuova' ? 'bg-green-100 text-green-800' :
                    car.condition === 'Km 0' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {car.condition}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  €{formatNumber(car.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Gauge className="h-4 w-4" />
                    {formatNumber(car.mileage)} km
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      car.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {car.available ? 'Disponibile' : 'Non disponibile'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(car)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    disabled={loading}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={loading}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nessuna auto in vendita al momento</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Totale Auto</div>
          <div className="text-2xl font-bold text-gray-900">{cars.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Disponibili</div>
          <div className="text-2xl font-bold text-green-600">
            {cars.filter(c => c.available).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Auto Nuove/Km 0</div>
          <div className="text-2xl font-bold text-blue-600">
            {cars.filter(c => c.condition === 'Nuova' || c.condition === 'Km 0').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Valore Totale</div>
          <div className="text-2xl font-bold text-gray-900">
            €{formatNumber(cars.reduce((sum, car) => sum + car.price, 0))}
          </div>
        </div>
      </div>
    </div>
  )
}

