import { Cookie } from 'lucide-react'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Cookie className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Informativa sull'utilizzo dei cookie
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cosa sono i Cookie</h2>
              <p className="text-gray-600">
                I cookie sono piccoli file di testo che i siti web visitati inviano al browser dell'utente, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva. I cookie sono utilizzati per diverse finalità, per migliorare l'efficienza del sito e per fornire informazioni ai proprietari del sito stesso.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tipologie di Cookie Utilizzati</h2>
              
              <div className="space-y-6 mt-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Cookie Tecnici (Necessari)</h3>
                  <p className="text-gray-600 mb-4">
                    Questi cookie sono essenziali per il funzionamento del sito e non possono essere disattivati. Vengono utilizzati per:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Gestione della sessione utente</li>
                    <li>Autenticazione e sicurezza</li>
                    <li>Memorizzazione delle preferenze</li>
                    <li>Funzionalità del carrello</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-4">
                    <strong>Durata:</strong> Sessione o persistenti (max 12 mesi)
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Cookie Analitici</h3>
                  <p className="text-gray-600 mb-4">
                    Utilizzati per raccogliere informazioni su come i visitatori utilizzano il sito:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Numero di visitatori</li>
                    <li>Pagine visitate</li>
                    <li>Tempo di permanenza</li>
                    <li>Sorgente del traffico</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-4">
                    <strong>Durata:</strong> 24 mesi<br />
                    <strong>Consenso:</strong> Richiesto
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Cookie di Profilazione</h3>
                  <p className="text-gray-600 mb-4">
                    Utilizzati per creare profili relativi all'utente e inviare messaggi pubblicitari in linea con le preferenze manifestate:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Pubblicità personalizzata</li>
                    <li>Remarketing</li>
                    <li>Tracciamento comportamentale</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-4">
                    <strong>Durata:</strong> 12 mesi<br />
                    <strong>Consenso:</strong> Richiesto
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Cookie di Terze Parti</h3>
                  <p className="text-gray-600 mb-4">
                    Cookie installati da servizi di terze parti:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Google Analytics (analisi traffico)</li>
                    <li>Stripe (pagamenti)</li>
                    <li>Social media (condivisione contenuti)</li>
                  </ul>
                  <p className="text-sm text-gray-500 mt-4">
                    <strong>Durata:</strong> Variabile secondo il servizio<br />
                    <strong>Consenso:</strong> Richiesto (eccetto cookie tecnici)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Utilizzati dal Sito</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durata</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scopo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">session_id</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Tecnico</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Sessione</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Gestione sessione utente</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">auth_token</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Tecnico</td>
                      <td className="px-6 py-4 text-sm text-gray-600">7 giorni</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Autenticazione</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">_ga</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Analitico</td>
                      <td className="px-6 py-4 text-sm text-gray-600">24 mesi</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Google Analytics</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm text-gray-900">cookie_consent</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Tecnico</td>
                      <td className="px-6 py-4 text-sm text-gray-600">12 mesi</td>
                      <td className="px-6 py-4 text-sm text-gray-600">Memorizza preferenze cookie</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestione dei Cookie</h2>
              <p className="text-gray-600 mb-4">
                Puoi gestire le tue preferenze sui cookie in qualsiasi momento:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Tramite il banner cookie alla prima visita</li>
                <li>Tramite le impostazioni del tuo browser</li>
                <li>Contattandoci all'indirizzo privacy@mottacarandgo.it</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Disabilitazione dei Cookie nel Browser</h2>
              <p className="text-gray-600 mb-4">
                Puoi disabilitare i cookie direttamente dal tuo browser:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
                <li><strong>Firefox:</strong> Opzioni → Privacy e sicurezza → Cookie</li>
                <li><strong>Safari:</strong> Preferenze → Privacy → Cookie</li>
                <li><strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni sito</li>
              </ul>
              <p className="text-gray-600 mt-4">
                <strong>Nota:</strong> La disabilitazione dei cookie tecnici potrebbe compromettere alcune funzionalità del sito.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Link Utili</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>
                  <a href="https://www.garanteprivacy.it/cookie" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    Garante Privacy - Cookie
                  </a>
                </li>
                <li>
                  <a href="https://www.youronlinechoices.com/it/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    Your Online Choices
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contatti</h2>
              <p className="text-gray-600">
                Per qualsiasi domanda sui cookie, contattaci:
              </p>
              <div className="mt-4 text-gray-600">
                <p>Email: <a href="mailto:privacy@mottacarandgo.it" className="text-blue-600 hover:text-blue-700">privacy@mottacarandgo.it</a></p>
                <p>Telefono: <a href="tel:+390612345678" className="text-blue-600 hover:text-blue-700">+39 06 1234 5678</a></p>
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

