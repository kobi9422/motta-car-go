'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Upload, FileText, Loader2, CheckCircle } from 'lucide-react'
import { format, differenceInDays, addDays } from 'date-fns'
import toast from 'react-hot-toast'

interface Car {
  id: string
  brand: string
  model: string
  category: string
  price_per_day: number
  image_url: string
  seats: number
  transmission: string
  fuel_type: string
}

interface BookingFormData {
  start_date: string
  end_date: string
  pickup_location: string
  dropoff_location: string
}

interface UploadedDocument {
  type: 'license' | 'id_card'
  file: File
  preview: string
}

export default function BookingPage({ params }: { params: Promise<{ carId: string }> }) {
  const router = useRouter()
  const supabase = createClient()

  const [car, setCar] = useState<Car | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingDocs, setUploadingDocs] = useState(false)
  const [carId, setCarId] = useState<string>('')

  const [formData, setFormData] = useState<BookingFormData>({
    start_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    end_date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    pickup_location: 'Roma - Sede Centrale',
    dropoff_location: 'Roma - Sede Centrale',
  })

  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const licenseInputRef = useRef<HTMLInputElement>(null)
  const idCardInputRef = useRef<HTMLInputElement>(null)

  // Load car and user data
  useEffect(() => {
    async function loadData() {
      try {
        // Await params
        const resolvedParams = await params
        const id = resolvedParams.carId
        setCarId(id)

        // Check authentication
        const { data: { user: authUser } } = await supabase.auth.getUser()
        if (!authUser) {
          router.push(`/login?redirect=/prenota/${id}`)
          return
        }
        setUser(authUser)

        // Load car details
        const { data: carData, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !carData) {
          toast.error('Auto non trovata')
          router.push('/catalogo')
          return
        }

        setCar(carData)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Errore nel caricamento dei dati')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params, router, supabase])

  // Calculate total price
  const calculateTotalPrice = () => {
    if (!car || !formData.start_date || !formData.end_date) return 0
    
    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)
    const days = differenceInDays(end, start)
    
    if (days <= 0) return 0
    
    return days * car.price_per_day
  }

  const totalPrice = calculateTotalPrice()
  const rentalDays = formData.start_date && formData.end_date 
    ? differenceInDays(new Date(formData.end_date), new Date(formData.start_date))
    : 0

  // Handle document upload
  const handleDocumentUpload = (type: 'license' | 'id_card', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      toast.error('Formato file non valido. Usa JPG, PNG o PDF.')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Il file è troppo grande. Massimo 5MB.')
      return
    }

    // Create preview
    const preview = URL.createObjectURL(file)

    // Remove existing document of same type
    setDocuments(prev => prev.filter(doc => doc.type !== type))

    // Add new document
    setDocuments(prev => [...prev, { type, file, preview }])
  }

  // Remove document
  const removeDocument = (type: 'license' | 'id_card') => {
    setDocuments(prev => prev.filter(doc => doc.type !== type))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.start_date || !formData.end_date) {
      toast.error('Seleziona le date di noleggio')
      return
    }

    if (rentalDays <= 0) {
      toast.error('La data di fine deve essere successiva alla data di inizio')
      return
    }

    if (!formData.pickup_location || !formData.dropoff_location) {
      toast.error('Seleziona le località di ritiro e consegna')
      return
    }

    // Check documents
    const hasLicense = documents.some(doc => doc.type === 'license')
    const hasIdCard = documents.some(doc => doc.type === 'id_card')

    if (!hasLicense || !hasIdCard) {
      toast.error('Carica sia la patente che la carta d\'identità')
      return
    }

    setSubmitting(true)

    try {
      // 1. Upload documents
      setUploadingDocs(true)
      const uploadedDocUrls: { type: string; url: string; fileName: string }[] = []

      for (const doc of documents) {
        const formData = new FormData()
        formData.append('file', doc.file)
        formData.append('document_type', doc.type)

        const response = await fetch('/api/upload-document', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Errore nel caricamento dei documenti')
        }

        const data = await response.json()
        uploadedDocUrls.push({
          type: doc.type,
          url: data.url,
          fileName: doc.file.name,
        })
      }
      setUploadingDocs(false)

      // 2. Create booking
      const bookingData = {
        car_id: car!.id,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        total_price: totalPrice,
        documents: uploadedDocUrls,
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Errore nella creazione della prenotazione')
      }

      await response.json()

      // 3. Redirect to success page
      toast.success('Prenotazione creata con successo! Il contratto è stato generato.')
      setTimeout(() => {
        router.push(`/dashboard/prenotazioni`)
      }, 1500)
    } catch (error: any) {
      console.error('Error creating booking:', error)
      toast.error(error.message || 'Errore nella creazione della prenotazione')
    } finally {
      setSubmitting(false)
      setUploadingDocs(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (!car) {
    return null
  }

  const licenseDoc = documents.find(doc => doc.type === 'license')
  const idCardDoc = documents.find(doc => doc.type === 'id_card')

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href={`/catalogo/${car.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Torna ai Dettagli
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Prenota la tua Auto</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Dates Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                  Date di Noleggio
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Ritiro *
                    </label>
                    <input
                      type="date"
                      required
                      min={format(new Date(), 'yyyy-MM-dd')}
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Consegna *
                    </label>
                    <input
                      type="date"
                      required
                      min={formData.start_date || format(new Date(), 'yyyy-MM-dd')}
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {rentalDays > 0 && (
                  <p className="mt-4 text-sm text-gray-600">
                    Durata noleggio: <span className="font-semibold">{rentalDays} {rentalDays === 1 ? 'giorno' : 'giorni'}</span>
                  </p>
                )}
              </div>

              {/* Location Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                  Località
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Luogo di Ritiro *
                    </label>
                    <select
                      required
                      value={formData.pickup_location}
                      onChange={(e) => setFormData(prev => ({ ...prev, pickup_location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Roma - Sede Centrale">Roma - Sede Centrale</option>
                      <option value="Roma - Aeroporto Fiumicino">Roma - Aeroporto Fiumicino</option>
                      <option value="Roma - Stazione Termini">Roma - Stazione Termini</option>
                      <option value="Milano - Sede">Milano - Sede</option>
                      <option value="Milano - Aeroporto Malpensa">Milano - Aeroporto Malpensa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Luogo di Consegna *
                    </label>
                    <select
                      required
                      value={formData.dropoff_location}
                      onChange={(e) => setFormData(prev => ({ ...prev, dropoff_location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Roma - Sede Centrale">Roma - Sede Centrale</option>
                      <option value="Roma - Aeroporto Fiumicino">Roma - Aeroporto Fiumicino</option>
                      <option value="Roma - Stazione Termini">Roma - Stazione Termini</option>
                      <option value="Milano - Sede">Milano - Sede</option>
                      <option value="Milano - Aeroporto Malpensa">Milano - Aeroporto Malpensa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-blue-600" />
                  Documenti Richiesti
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Carica la tua patente di guida e carta d'identità. Formati accettati: JPG, PNG, PDF (max 5MB)
                </p>

                <div className="space-y-6">
                  {/* License Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patente di Guida *
                    </label>
                    {!licenseDoc ? (
                      <div>
                        <input
                          ref={licenseInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,application/pdf"
                          onChange={(e) => handleDocumentUpload('license', e)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => licenseInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition flex flex-col items-center justify-center"
                        >
                          <Upload className="h-12 w-12 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Clicca per caricare la patente</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{licenseDoc.file.name}</p>
                            <p className="text-sm text-gray-600">
                              {(licenseDoc.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument('license')}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Rimuovi
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ID Card Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carta d'Identità *
                    </label>
                    {!idCardDoc ? (
                      <div>
                        <input
                          ref={idCardInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,application/pdf"
                          onChange={(e) => handleDocumentUpload('id_card', e)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => idCardInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition flex flex-col items-center justify-center"
                        >
                          <Upload className="h-12 w-12 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Clicca per caricare la carta d'identità</span>
                        </button>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{idCardDoc.file.name}</p>
                            <p className="text-sm text-gray-600">
                              {(idCardDoc.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument('id_card')}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Rimuovi
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || uploadingDocs || !licenseDoc || !idCardDoc}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {uploadingDocs ? 'Caricamento documenti...' : 'Creazione prenotazione...'}
                  </>
                ) : (
                  'Conferma Prenotazione'
                )}
              </button>
            </form>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Riepilogo</h3>

              {/* Car Info */}
              <div className="mb-6">
                <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden mb-3">
                  <Image
                    src={car.image_url || 'https://placehold.co/400x300/2563EB/FFFFFF/png?text=Auto'}
                    alt={`${car.brand} ${car.model}`}
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                </div>
                <h4 className="font-bold text-gray-900">{car.brand} {car.model}</h4>
                <p className="text-sm text-gray-600">{car.category}</p>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prezzo al giorno</span>
                  <span className="font-medium">€{car.price_per_day.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Numero giorni</span>
                  <span className="font-medium">{rentalDays > 0 ? rentalDays : '-'}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Totale</span>
                  <span className="font-bold text-blue-600 text-xl">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Included */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-3">Incluso nel prezzo:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Assicurazione completa</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Chilometraggio illimitato</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Assistenza 24/7</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Contratto PDF automatico</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


