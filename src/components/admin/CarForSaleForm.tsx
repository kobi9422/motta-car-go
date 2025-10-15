'use client'

import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'

interface CarForSale {
  id?: string
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

interface CarForSaleFormProps {
  car?: CarForSale | null
  onSave: (car: CarForSale) => void
  onCancel: () => void
}

export default function CarForSaleForm({ car, onSave, onCancel }: CarForSaleFormProps) {
  const [formData, setFormData] = useState({
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    category: car?.category || '',
    price: car?.price || 0,
    mileage: car?.mileage || 0,
    seats: car?.seats || 5,
    transmission: car?.transmission || 'Manuale',
    fuel_type: car?.fuel_type || 'Benzina',
    image_url: car?.image_url || '',
    available: car?.available ?? true,
    features: car?.features?.join(', ') || '',
    description: car?.description || '',
    condition: car?.condition || 'Usata',
    previous_owners: car?.previous_owners || 1,
    registration_date: car?.registration_date || '',
    last_service_date: car?.last_service_date || '',
  })

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Errore durante il caricamento dell\'immagine')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, image_url: data.url }))
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Errore durante il caricamento dell\'immagine')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let imageUrl = formData.image_url

      // If no image, use placeholder
      if (!imageUrl) {
        imageUrl = 'https://placehold.co/600x400/2563EB/FFFFFF/png?text=Auto'
      }

      // Prepare car data
      const carData = {
        ...formData,
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        year: Number(formData.year),
        seats: Number(formData.seats),
        previous_owners: Number(formData.previous_owners),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        image_url: imageUrl,
        registration_date: formData.registration_date || null,
        last_service_date: formData.last_service_date || null,
      }

      // Save car
      const url = car?.id ? `/api/admin/cars-for-sale/${car.id}` : '/api/admin/cars-for-sale'
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
    } catch (error: any) {
      console.error('Error saving car:', error)
      alert(error.message || 'Errore durante il salvataggio dell\'auto')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Immagine Auto
        </label>
        <div className="flex items-center gap-4">
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="Preview"
              className="h-24 w-32 object-cover rounded"
            />
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {uploading ? 'Caricamento...' : 'Carica Immagine'}
            </button>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca *
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modello *
          </label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anno *
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="1990"
            max={new Date().getFullYear() + 1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleziona categoria</option>
            <option value="Utilitaria">Utilitaria</option>
            <option value="Compatta">Compatta</option>
            <option value="Berlina">Berlina</option>
            <option value="SUV">SUV</option>
            <option value="Station Wagon">Station Wagon</option>
            <option value="Sportiva">Sportiva</option>
            <option value="Lusso">Lusso</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prezzo (€) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chilometraggio (km) *
          </label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posti *
          </label>
          <input
            type="number"
            name="seats"
            value={formData.seats}
            onChange={handleChange}
            required
            min="2"
            max="9"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cambio *
          </label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Manuale">Manuale</option>
            <option value="Automatico">Automatico</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alimentazione *
          </label>
          <select
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Benzina">Benzina</option>
            <option value="Diesel">Diesel</option>
            <option value="Elettrico">Elettrico</option>
            <option value="Ibrido">Ibrido</option>
            <option value="GPL">GPL</option>
            <option value="Metano">Metano</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condizione *
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Nuova">Nuova</option>
            <option value="Usata">Usata</option>
            <option value="Km 0">Km 0</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proprietari Precedenti *
          </label>
          <input
            type="number"
            name="previous_owners"
            value={formData.previous_owners}
            onChange={handleChange}
            required
            min="0"
            max="10"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Immatricolazione
          </label>
          <input
            type="date"
            name="registration_date"
            value={formData.registration_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Ultimo Tagliando
          </label>
          <input
            type="date"
            name="last_service_date"
            value={formData.last_service_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrizione *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Descrizione dettagliata dell'auto..."
        />
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Caratteristiche (separate da virgola)
        </label>
        <input
          type="text"
          name="features"
          value={formData.features}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="es: Climatizzatore, Cruise Control, Sensori di parcheggio"
        />
      </div>

      {/* Available */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="available"
          checked={formData.available}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Auto disponibile per la vendita
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvataggio...' : car?.id ? 'Aggiorna Auto' : 'Aggiungi Auto'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Annulla
        </button>
      </div>
    </form>
  )
}
