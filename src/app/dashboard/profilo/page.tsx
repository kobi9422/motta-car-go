'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react'
import Link from 'next/link'

export default function ProfiloPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
  })

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
          city: profileData.city || '',
          postal_code: profileData.postal_code || '',
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id)

      if (error) throw error

      alert('Profilo aggiornato con successo!')
    } catch (error: any) {
      alert('Errore durante l\'aggiornamento: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Torna alla Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Il Mio Profilo
          </h1>
          <p className="mt-2 text-gray-600">
            Gestisci le tue informazioni personali
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {profile.full_name || 'Utente'}
                </h2>
                <p className="text-sm text-gray-600 mb-4">{user?.email}</p>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  Membro da {new Date(user?.created_at).toLocaleDateString('it-IT')}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Informazioni Personali
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={profile.full_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mario Rossi"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    L'email non può essere modificata
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefono
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+39 123 456 7890"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Indirizzo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Via Roma 123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Città
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Roma"
                    />
                  </div>

                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                      CAP
                    </label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={profile.postal_code}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="00100"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {saving ? (
                      'Salvataggio...'
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Salva Modifiche
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

