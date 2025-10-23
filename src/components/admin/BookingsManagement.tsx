'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import { Calendar, Car, User, MapPin, Euro, FileText, Printer, Download, CheckCircle, XCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface Booking {
  id: string
  user_id: string
  car_id: string
  start_date: string
  end_date: string
  pickup_location: string
  dropoff_location: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'refunded'
  contract_url: string | null
  created_at: string
  cars: {
    brand: string
    model: string
    year: number
    image_url: string
  }
  profiles: {
    full_name: string
    email: string
    phone: string
  }
}

interface BookingsManagementProps {
  initialBookings: Booking[]
}

export default function BookingsManagement({ initialBookings }: BookingsManagementProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all')
  const [loading, setLoading] = useState(false)

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'In Attesa' },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Confermata' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancellata' },
      completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle, label: 'Completata' },
    }
    const badge = badges[status as keyof typeof badges]
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>
    )
  }

  const getPaymentBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-orange-100 text-orange-800', label: 'Da Pagare' },
      paid: { color: 'bg-green-100 text-green-800', label: 'Pagato' },
      refunded: { color: 'bg-gray-100 text-gray-800', label: 'Rimborsato' },
    }
    const badge = badges[status as keyof typeof badges]
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  const handlePrintContract = async (bookingId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/generate-contract/${bookingId}`)
      
      if (!response.ok) {
        throw new Error('Errore nella generazione del contratto')
      }

      const data = await response.json()
      
      if (data.url) {
        // Open contract in new tab for printing
        window.open(data.url, '_blank')
        toast.success('Contratto aperto in una nuova scheda')
      }
    } catch (error) {
      console.error('Error generating contract:', error)
      toast.error('Errore nella generazione del contratto')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadContract = async (bookingId: string, contractUrl: string | null) => {
    if (!contractUrl) {
      toast.error('Contratto non disponibile')
      return
    }

    try {
      window.open(contractUrl, '_blank')
      toast.success('Download del contratto avviato')
    } catch (error) {
      console.error('Error downloading contract:', error)
      toast.error('Errore nel download del contratto')
    }
  }

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <div>
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Totale</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="text-sm text-yellow-600">In Attesa</div>
          <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-sm text-green-600">Confermate</div>
          <div className="text-2xl font-bold text-green-900">{stats.confirmed}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="text-sm text-blue-600">Completate</div>
          <div className="text-2xl font-bold text-blue-900">{stats.completed}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <div className="text-sm text-red-600">Cancellate</div>
          <div className="text-2xl font-bold text-red-900">{stats.cancelled}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Tutte ({stats.total})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          In Attesa ({stats.pending})
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'confirmed'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Confermate ({stats.confirmed})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Completate ({stats.completed})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'cancelled'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Cancellate ({stats.cancelled})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nessuna prenotazione trovata</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Car Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={booking.cars.image_url || '/placeholder-car.jpg'}
                    alt={`${booking.cars.brand} ${booking.cars.model}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {booking.cars.brand} {booking.cars.model}
                    </h3>
                    <p className="text-sm text-gray-600">{booking.cars.year}</p>
                    <div className="mt-2">
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Cliente</span>
                  </div>
                  <p className="font-semibold text-gray-900">{booking.profiles.full_name}</p>
                  <p className="text-sm text-gray-600">{booking.profiles.email}</p>
                  <p className="text-sm text-gray-600">{booking.profiles.phone}</p>
                </div>

                {/* Booking Details */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Periodo</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {format(new Date(booking.start_date), 'dd MMM yyyy', { locale: it })}
                  </p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(booking.end_date), 'dd MMM yyyy', { locale: it })}
                  </p>
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.pickup_location}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Euro className="h-4 w-4 text-green-600" />
                    <span className="font-bold text-green-600">€{booking.total_price.toFixed(2)}</span>
                    {getPaymentBadge(booking.payment_status)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handlePrintContract(booking.id)}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <Printer className="h-4 w-4" />
                    Stampa Contratto
                  </button>
                  {booking.contract_url && (
                    <button
                      onClick={() => handleDownloadContract(booking.id, booking.contract_url)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Download className="h-4 w-4" />
                      Scarica PDF
                    </button>
                  )}
                  <p className="text-xs text-gray-500 text-center mt-2">
                    ID: {booking.id.substring(0, 8)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

