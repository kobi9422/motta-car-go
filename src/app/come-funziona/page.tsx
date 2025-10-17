import Link from 'next/link'
import { Car, Calendar, CreditCard, FileText, CheckCircle, MapPin, Clock, Shield } from 'lucide-react'

export default function ComeFunzionaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Come Funziona il Noleggio
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Noleggiare un'auto con Motta car & go è semplice, veloce e sicuro. Segui questi 4 semplici passi!
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-10 w-10 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scegli l'Auto</h3>
              <p className="text-gray-600 mb-4">
                Esplora il nostro catalogo e seleziona il veicolo perfetto per le tue esigenze. Filtra per categoria, prezzo e caratteristiche.
              </p>
              <Link href="/catalogo" className="text-blue-600 hover:text-blue-700 font-semibold">
                Vai al Catalogo →
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Prenota Online</h3>
              <p className="text-gray-600 mb-4">
                Compila il form di prenotazione con le date di ritiro e consegna, la località e i tuoi dati personali.
              </p>
              <div className="text-sm text-gray-500">
                ✓ Prenotazione immediata<br />
                ✓ Conferma istantanea
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-10 w-10 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Paga in Sicurezza</h3>
              <p className="text-gray-600 mb-4">
                Completa il pagamento con carta di credito tramite Stripe. Tutti i pagamenti sono protetti e sicuri.
              </p>
              <div className="text-sm text-gray-500">
                ✓ Pagamento sicuro<br />
                ✓ Nessun costo nascosto
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-blue-600" />
              </div>
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ritira l'Auto</h3>
              <p className="text-gray-600 mb-4">
                Ricevi il contratto in PDF via email. Presenta i documenti richiesti e ritira la tua auto nel punto concordato.
              </p>
              <div className="text-sm text-gray-500">
                ✓ Contratto PDF<br />
                ✓ Ritiro veloce
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Documenti Necessari
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Patente di Guida</h3>
              <p className="text-gray-600">
                Patente di guida valida da almeno 1 anno. Per alcune categorie di auto potrebbero essere richiesti 2 anni.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Carta d'Identità</h3>
              <p className="text-gray-600">
                Documento d'identità valido (carta d'identità o passaporto) per la verifica dell'identità.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Carta di Credito</h3>
              <p className="text-gray-600">
                Carta di credito intestata al conducente per il deposito cauzionale (verrà sbloccato alla riconsegna).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Cosa Include il Noleggio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Assicurazione Completa</h3>
              <p className="text-sm text-gray-600">
                Kasko, furto e responsabilità civile inclusi
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Chilometraggio Illimitato</h3>
              <p className="text-sm text-gray-600">
                Guida senza limiti di chilometri
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Assistenza 24/7</h3>
              <p className="text-sm text-gray-600">
                Supporto sempre disponibile
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Contratto PDF</h3>
              <p className="text-sm text-gray-600">
                Ricevi il contratto via email
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Domande Frequenti
          </h2>
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Qual è l'età minima per noleggiare?</h3>
              <p className="text-gray-600">
                L'età minima è 21 anni con patente da almeno 1 anno. Per alcune categorie di auto (SUV, auto di lusso) l'età minima è 25 anni.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Posso modificare o cancellare la prenotazione?</h3>
              <p className="text-gray-600">
                Sì, puoi modificare o cancellare la prenotazione fino a 24 ore prima del ritiro. Cancellazioni oltre questo termine potrebbero comportare penali.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Quanto è il deposito cauzionale?</h3>
              <p className="text-gray-600">
                Il deposito varia in base alla categoria dell'auto, da €300 a €1.000. Viene bloccato sulla carta di credito e sbloccato alla riconsegna dell'auto.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Posso aggiungere un secondo conducente?</h3>
              <p className="text-gray-600">
                Sì, puoi aggiungere fino a 2 conducenti aggiuntivi. Ogni conducente deve presentare patente e documento d'identità validi.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              href="/faq"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Vedi Tutte le FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto a Noleggiare?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Inizia ora a esplorare il nostro catalogo e trova l'auto perfetta per te
          </p>
          <Link
            href="/catalogo"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition text-lg"
          >
            Esplora il Catalogo
          </Link>
        </div>
      </section>
    </div>
  )
}

