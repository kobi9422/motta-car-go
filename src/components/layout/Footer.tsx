import Link from 'next/link'
import { Car, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">Motta car & go</span>
                <span className="text-xs text-gray-400">srl</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Il tuo partner di fiducia per il noleggio auto. Qualità, convenienza e servizio eccellente.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link Rapidi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalogo" className="text-gray-400 hover:text-white transition">
                  Catalogo Auto
                </Link>
              </li>
              <li>
                <Link href="/come-funziona" className="text-gray-400 hover:text-white transition">
                  Come Funziona
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-gray-400 hover:text-white transition">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informazioni Legali</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/termini-condizioni" className="text-gray-400 hover:text-white transition">
                  Termini e Condizioni
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-400 hover:text-white transition">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Via Roma 123, 00100 Roma, Italia
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-400" />
                <a href="tel:+390612345678" className="text-gray-400 hover:text-white transition text-sm">
                  +39 06 1234 5678
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-400" />
                <a href="mailto:info@mottacarandgo.it" className="text-gray-400 hover:text-white transition text-sm">
                  info@mottacarandgo.it
                </a>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Motta car & go srl. Tutti i diritti riservati.</p>
          <p className="mt-2">P.IVA: 12345678901 | REA: RM-1234567</p>
        </div>
      </div>
    </footer>
  )
}

