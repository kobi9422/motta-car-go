import { FileText } from 'lucide-react'

export default function TerminiCondizioniPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Termini e Condizioni
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Condizioni generali di noleggio e vendita
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Oggetto del Contratto</h2>
              <p className="text-gray-600">
                Le presenti condizioni generali regolano il rapporto contrattuale tra Motta car & go srl (di seguito "Società") e il Cliente per il noleggio e la vendita di autoveicoli.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Requisiti del Conducente</h2>
              <p className="text-gray-600 mb-4">
                Per noleggiare un veicolo è necessario:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Avere almeno 21 anni (25 per alcune categorie)</li>
                <li>Possedere patente di guida valida da almeno 1 anno (2 per alcune categorie)</li>
                <li>Presentare documento d'identità valido</li>
                <li>Disporre di carta di credito intestata al conducente</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Prenotazione e Pagamento</h2>
              <p className="text-gray-600 mb-4">
                La prenotazione si considera confermata al ricevimento del pagamento. Il Cliente riceverà:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Email di conferma con numero prenotazione</li>
                <li>Contratto di noleggio in formato PDF</li>
                <li>Ricevuta di pagamento</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Deposito Cauzionale</h2>
              <p className="text-gray-600">
                Al momento del ritiro viene richiesto un deposito cauzionale tramite blocco su carta di credito. L'importo varia da €300 a €1.000 in base alla categoria del veicolo. Il deposito viene sbloccato entro 7 giorni dalla riconsegna del veicolo in condizioni conformi.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Assicurazione</h2>
              <p className="text-gray-600 mb-4">
                Il noleggio include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Assicurazione RCA (Responsabilità Civile Auto)</li>
                <li>Assicurazione Kasko con franchigia</li>
                <li>Furto e incendio</li>
                <li>Assistenza stradale 24/7</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Sono esclusi dalla copertura: danni intenzionali, guida in stato di ebbrezza, violazione del codice della strada.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Utilizzo del Veicolo</h2>
              <p className="text-gray-600 mb-4">
                Il Cliente si impegna a:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Utilizzare il veicolo in conformità al codice della strada</li>
                <li>Non cedere il veicolo a terzi non autorizzati</li>
                <li>Non utilizzare il veicolo per scopi illeciti</li>
                <li>Mantenere il veicolo in buone condizioni</li>
                <li>Segnalare immediatamente eventuali danni o malfunzionamenti</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Riconsegna del Veicolo</h2>
              <p className="text-gray-600">
                Il veicolo deve essere riconsegnato nella data e ora concordate, nello stesso stato in cui è stato ritirato. Ritardi nella riconsegna comportano addebiti supplementari. Il veicolo deve essere riconsegnato con lo stesso livello di carburante del ritiro.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifiche e Cancellazioni</h2>
              <p className="text-gray-600 mb-4">
                Modifiche e cancellazioni sono possibili secondo le seguenti condizioni:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Cancellazione gratuita fino a 24 ore prima del ritiro</li>
                <li>Cancellazione entro 24 ore: penale del 50%</li>
                <li>Mancato ritiro (no-show): addebito del 100%</li>
                <li>Modifiche gratuite fino a 24 ore prima del ritiro</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Responsabilità</h2>
              <p className="text-gray-600">
                Il Cliente è responsabile per tutti i danni al veicolo, multe, pedaggi e violazioni del codice della strada durante il periodo di noleggio. La Società non è responsabile per oggetti lasciati nel veicolo.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Vendita Auto</h2>
              <p className="text-gray-600">
                Per l'acquisto di auto usate, la Società garantisce:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
                <li>Controllo tecnico completo</li>
                <li>Garanzia di 12 mesi</li>
                <li>Documentazione completa</li>
                <li>Possibilità di finanziamento</li>
                <li>Valutazione permuta</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Protezione Dati</h2>
              <p className="text-gray-600">
                I dati personali sono trattati in conformità al GDPR. Per maggiori informazioni consulta la nostra{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Privacy Policy
                </a>.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Foro Competente</h2>
              <p className="text-gray-600">
                Per qualsiasi controversia è competente il Foro di Roma. Si applica la legge italiana.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contatti</h2>
              <div className="text-gray-600">
                <p>Motta car & go srl</p>
                <p>Via Roma 123, 00100 Roma, Italia</p>
                <p>P.IVA: 12345678901</p>
                <p>Email: <a href="mailto:info@mottacarandgo.it" className="text-blue-600 hover:text-blue-700">info@mottacarandgo.it</a></p>
                <p>Tel: <a href="tel:+390612345678" className="text-blue-600 hover:text-blue-700">+39 06 1234 5678</a></p>
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

