'use client'

import { useState } from 'react'
import { Car, ShoppingCart, Calendar } from 'lucide-react'
import CarManagement from './CarManagement'
import CarForSaleManagement from './CarForSaleManagement'
import BookingsManagement from './BookingsManagement'

interface AdminDashboardTabsProps {
  rentalCars: any[]
  saleCars: any[]
  bookings: any[]
}

export default function AdminDashboardTabs({ rentalCars, saleCars, bookings }: AdminDashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<'rental' | 'sale' | 'bookings'>('rental')

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('rental')}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition
                ${activeTab === 'rental'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Car className="h-5 w-5" />
              Noleggio Auto
              <span className={`
                ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                ${activeTab === 'rental'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {rentalCars.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('sale')}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition
                ${activeTab === 'sale'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <ShoppingCart className="h-5 w-5" />
              Vendita Auto
              <span className={`
                ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                ${activeTab === 'sale'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {saleCars.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition
                ${activeTab === 'bookings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Calendar className="h-5 w-5" />
              Prenotazioni
              <span className={`
                ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium
                ${activeTab === 'bookings'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
                }
              `}>
                {bookings.length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'rental' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestione Auto a Noleggio</h2>
              <p className="mt-2 text-gray-600">
                Aggiungi, modifica o elimina le auto disponibili per il noleggio
              </p>
            </div>
            <CarManagement initialCars={rentalCars} />
          </div>
        )}

        {activeTab === 'sale' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestione Auto in Vendita</h2>
              <p className="mt-2 text-gray-600">
                Aggiungi, modifica o elimina le auto disponibili per la vendita
              </p>
            </div>
            <CarForSaleManagement initialCars={saleCars} />
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestione Prenotazioni</h2>
              <p className="mt-2 text-gray-600">
                Visualizza tutte le prenotazioni e stampa i contratti
              </p>
            </div>
            <BookingsManagement initialBookings={bookings} />
          </div>
        )}
      </div>
    </div>
  )
}

