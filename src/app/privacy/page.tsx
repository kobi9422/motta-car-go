import { Shield } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Informativa sul trattamento dei dati personali
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Titolare del Trattamento</h2>
              <p className="text-gray-600">
                Il Titolare del trattamento dei dati è Motta car & go srl, con sede legale in Via Roma 123, 00100 Roma, Italia.
                P.IVA: 12345678901
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Dati Raccolti</h2>
              <p className="text-gray-600 mb-4">
                Raccogliamo e trattiamo le seguenti categorie di dati personali:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Dati anagrafici (nome, cognome, data di nascita)</li>
                <li>Dati di contatto (email, telefono, indirizzo)</li>
                <li>Dati di identificazione (numero documento, patente di guida)</li>
                <li>Dati di pagamento (tramite Stripe, non conserviamo dati di carte di credito)</li>
                <li>Dati di navigazione (cookie, indirizzo IP)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalità del Trattamento</h2>
              <p className="text-gray-600 mb-4">
                I dati personali sono trattati per le seguenti finalità:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Gestione delle prenotazioni e dei contratti di noleggio</li>
                <li>Elaborazione dei pagamenti</li>
                <li>Invio di comunicazioni relative al servizio</li>
                <li>Adempimento di obblighi di legge</li>
                <li>Marketing (solo con consenso esplicito)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base Giuridica</h2>
              <p className="text-gray-600">
                Il trattamento dei dati è basato su:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Esecuzione del contratto di noleggio</li>
                <li>Adempimento di obblighi di legge</li>
                <li>Consenso dell'interessato (per marketing)</li>
                <li>Legittimo interesse del titolare</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Conservazione dei Dati</h2>
              <p className="text-gray-600">
                I dati personali sono conservati per il tempo necessario alle finalità per cui sono stati raccolti:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Dati contrattuali: 10 anni (obblighi fiscali)</li>
                <li>Dati di marketing: fino a revoca del consenso</li>
                <li>Dati di navigazione: 12 mesi</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Diritti dell'Interessato</h2>
              <p className="text-gray-600 mb-4">
                Hai il diritto di:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Accedere ai tuoi dati personali</li>
                <li>Rettificare dati inesatti</li>
                <li>Cancellare i dati (diritto all'oblio)</li>
                <li>Limitare il trattamento</li>
                <li>Opporti al trattamento</li>
                <li>Portabilità dei dati</li>
                <li>Revocare il consenso</li>
                <li>Proporre reclamo al Garante Privacy</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Comunicazione dei Dati</h2>
              <p className="text-gray-600">
                I dati possono essere comunicati a:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Fornitori di servizi di pagamento (Stripe)</li>
                <li>Fornitori di servizi IT</li>
                <li>Autorità competenti (su richiesta)</li>
                <li>Consulenti e professionisti</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sicurezza</h2>
              <p className="text-gray-600">
                Adottiamo misure di sicurezza tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati, perdita o distruzione.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookie</h2>
              <p className="text-gray-600">
                Il sito utilizza cookie tecnici e, previo consenso, cookie di profilazione. Per maggiori informazioni consulta la nostra{' '}
                <a href="/cookie-policy" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Cookie Policy
                </a>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contatti</h2>
              <p className="text-gray-600">
                Per esercitare i tuoi diritti o per qualsiasi informazione, contattaci:
              </p>
              <div className="mt-4 text-gray-600">
                <p>Email: <a href="mailto:privacy@mottacarandgo.it" className="text-blue-600 hover:text-blue-700">privacy@mottacarandgo.it</a></p>
                <p>Telefono: <a href="tel:+390612345678" className="text-blue-600 hover:text-blue-700">+39 06 1234 5678</a></p>
                <p>Indirizzo: Via Roma 123, 00100 Roma, Italia</p>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

