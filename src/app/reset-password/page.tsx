'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

export default function ResetPasswordPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Errore durante il reset della password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/login" className="flex items-center justify-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Torna al Login
        </Link>
        
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Recupera Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Inserisci la tua email per ricevere il link di reset
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!success ? (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="tuo@email.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Invio in corso...' : 'Invia Link di Reset'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-start">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-green-700">
                  <p className="font-semibold mb-2">Email inviata con successo!</p>
                  <p>
                    Controlla la tua casella di posta. Ti abbiamo inviato un link per reimpostare la password.
                  </p>
                  <p className="mt-2 text-xs">
                    Se non ricevi l'email entro pochi minuti, controlla la cartella spam.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Torna al Login
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Oppure</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Non hai un account?{' '}
                <Link href="/registrati" className="font-medium text-blue-600 hover:text-blue-500">
                  Registrati ora
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

