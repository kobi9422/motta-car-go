'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Car, Menu, X, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  // Check user session and role
  useEffect(() => {
    const supabase = createClient()

    const checkUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        setIsAdmin(profile?.role === 'admin')
      } else {
        setIsAdmin(false)
      }
    }

    checkUserAndRole()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()

        setIsAdmin(profile?.role === 'admin')
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Motta car & go</span>
              <span className="text-xs text-gray-500">srl</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/catalogo" className="text-gray-700 hover:text-blue-600 transition">
              Noleggio
            </Link>
            <Link href="/vendita" className="text-gray-700 hover:text-blue-600 transition">
              Vendita Auto
            </Link>
            <Link href="/come-funziona" className="text-gray-700 hover:text-blue-600 transition">
              Come Funziona
            </Link>
            <Link href="/contatti" className="text-gray-700 hover:text-blue-600 transition">
              Contatti
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="text-gray-700 hover:text-blue-600 transition flex items-center"
                >
                  <User className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Esci
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Accedi
                </Link>
                <Link
                  href="/registrati"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Registrati
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              href="/catalogo"
              className="block text-gray-700 hover:text-blue-600 transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Noleggio
            </Link>
            <Link
              href="/vendita"
              className="block text-gray-700 hover:text-blue-600 transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Vendita Auto
            </Link>
            <Link
              href="/come-funziona"
              className="block text-gray-700 hover:text-blue-600 transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Come Funziona
            </Link>
            <Link
              href="/contatti"
              className="block text-gray-700 hover:text-blue-600 transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contatti
            </Link>
            
            {user ? (
              <>
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="block text-gray-700 hover:text-blue-600 transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:text-red-600 transition py-2"
                >
                  Esci
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block text-gray-700 hover:text-blue-600 transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Accedi
                </Link>
                <Link
                  href="/registrati"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Registrati
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}

