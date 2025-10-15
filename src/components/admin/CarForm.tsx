'use client'

import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'

interface Car {
  id?: string
  brand: string
  model: string
  year: number
  category: string
  price_per_day: number
  seats: number
  transmission: string
  fuel_type: string
  image_url: string
  available: boolean
  features: string[]
  description: string
}

interface CarFormProps {
  car?: Car | null
  onSave: (car: Car) => void
  onCancel: () => void
}

export default function CarForm({ car, onSave, onCancel }: CarFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(car?.image_url || '')
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    category: car?.category || 'utilitaria',
    price_per_day: car?.price_per_day || 0,
    seats: car?.seats || 5,
    transmission: car?.transmission || 'Manuale',
    fuel_type: car?.fuel_type || 'Benzina',
    available: car?.available ?? true,
    features: car?.features?.join(', ') || '',
    description: car?.description || '',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let imageUrl = car?.image_url || ''

      // Validate that we have an image
      if (!imageFile && !car?.image_url) {
        setError('Devi caricare un\'immagine per l\'auto')
        setLoading(false)
        return
      }

      // Upload image if a new one was selected
      if (imageFile) {
        setUploadingImage(true)
        const formDataImage = new FormData()
        formDataImage.append('file', imageFile)

        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formDataImage,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.message || 'Errore durante l\'upload dell\'immagine')
        }

        const { url } = await uploadResponse.json()
        imageUrl = url
        setUploadingImage(false)
      }

      // Prepare car data
      const carData = {
        ...formData,
        price_per_day: Number(formData.price_per_day),
        year: Number(formData.year),
        seats: Number(formData.seats),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        image_url: imageUrl,
      }

      // Save car
      const url = car?.id ? `/api/admin/cars/${car.id}` : '/api/admin/cars'
      const method = car?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Errore durante il salvataggio')
      }

      const savedCar = await response.json()
      onSave(savedCar)
      alert(car?.id ? 'Auto aggiornata con successo!' : 'Auto aggiunta con successo!')
    } catch (error: any) {
      console.error('Error saving car:', error)
      setError(error.message || 'Errore durante il salvataggio dell\'auto')
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Upload Status */}
      {uploadingImage && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-700">📤 Caricamento immagine in corso...</p>
        </div>
      )}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Immagine Auto *
        </label>

        {/* Preview */}
        {imagePreview && (
          <div className="mb-4">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-60 object-cover rounded-lg border-2 border-green-500"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                ✓ Immagine caricata
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Upload className="h-5 w-5" />
            {imageFile ? 'Cambia Immagine' : 'Seleziona Immagine'}
          </button>

          {imageFile && (
            <p className="text-sm text-gray-600">
              📎 File selezionato: <span className="font-medium">{imageFile.name}</span>
            </p>
          )}

          <p className="text-xs text-gray-500">
            Formati supportati: JPG, PNG, WEBP • Dimensione massima: 5 MB
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Brand and Model */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca *
          </label>
          <input
            type="text"
            required
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="es. Fiat"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Modello *
          </label>
          <input
            type="text"
            required
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="es. Panda"
          />
        </div>
      </div>

      {/* Year, Category, Price */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anno *
          </label>
          <input
            type="number"
            required
            min="2000"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="utilitaria">Utilitaria</option>
            <option value="compatta">Compatta</option>
            <option value="berlina">Berlina</option>
            <option value="suv">SUV</option>
            <option value="van">Van</option>
            <option value="pick-up">Pick-up</option>
            <option value="elettrica">Elettrica</option>
            <option value="microcar">Microcar</option>
            <option value="monovolume">Monovolume</option>
            <option value="city car">City Car</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prezzo/Giorno (€) *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.price_per_day}
            onChange={(e) => setFormData({ ...formData, price_per_day: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Seats, Transmission, Fuel Type */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Posti *
          </label>
          <input
            type="number"
            required
            min="2"
            max="9"
            value={formData.seats}
            onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trasmissione *
          </label>
          <select
            required
            value={formData.transmission}
            onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Manuale">Manuale</option>
            <option value="Automatico">Automatico</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carburante *
          </label>
          <select
            required
            value={formData.fuel_type}
            onChange={(e) => setFormData({ ...formData, fuel_type: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Benzina">Benzina</option>
            <option value="Diesel">Diesel</option>
            <option value="Elettrico">Elettrico</option>
            <option value="Ibrido">Ibrido</option>
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrizione *
        </label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descrizione dell'auto..."
        />
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caratteristiche (separate da virgola)
        </label>
        <input
          type="text"
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="es. Aria condizionata, Bluetooth, Cruise control"
        />
      </div>

      {/* Available */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="available"
          checked={formData.available}
          onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
          Auto disponibile per il noleggio
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading || uploadingImage}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadingImage ? '📤 Caricamento immagine...' : loading ? '💾 Salvataggio...' : car?.id ? 'Aggiorna Auto' : 'Aggiungi Auto'}
        </button>
      </div>
    </form>
  )
}

