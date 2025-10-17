'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    category: 'Noleggio',
    question: 'Qual è l\'età minima per noleggiare un\'auto?',
    answer: 'L\'età minima è 21 anni con patente di guida valida da almeno 1 anno. Per alcune categorie di auto (SUV, auto di lusso) l\'età minima è 25 anni con patente da almeno 2 anni.',
  },
  {
    category: 'Noleggio',
    question: 'Quali documenti sono necessari per il noleggio?',
    answer: 'Sono necessari: patente di guida valida, carta d\'identità o passaporto, e carta di credito intestata al conducente per il deposito cauzionale.',
  },
  {
    category: 'Noleggio',
    question: 'Il chilometraggio è illimitato?',
    answer: 'Sì, tutti i nostri noleggi includono chilometraggio illimitato. Puoi guidare senza preoccuparti dei limiti di chilometri.',
  },
  {
    category: 'Prenotazione',
    question: 'Posso modificare o cancellare la mia prenotazione?',
    answer: 'Sì, puoi modificare o cancellare la prenotazione fino a 24 ore prima del ritiro senza penali. Cancellazioni oltre questo termine potrebbero comportare una penale del 50% dell\'importo.',
  },
  {
    category: 'Prenotazione',
    question: 'Riceverò una conferma della prenotazione?',
    answer: 'Sì, riceverai immediatamente una email di conferma con tutti i dettagli della prenotazione e il contratto in formato PDF.',
  },
  {
    category: 'Pagamento',
    question: 'Quali metodi di pagamento accettate?',
    answer: 'Accettiamo tutte le principali carte di credito (Visa, Mastercard, American Express) tramite il nostro sistema di pagamento sicuro Stripe.',
  },
  {
    category: 'Pagamento',
    question: 'Quanto è il deposito cauzionale?',
    answer: 'Il deposito cauzionale varia in base alla categoria dell\'auto, da €300 a €1.000. Viene bloccato sulla carta di credito al momento del ritiro e sbloccato entro 7 giorni dalla riconsegna dell\'auto.',
  },
  {
    category: 'Assicurazione',
    question: 'L\'assicurazione è inclusa nel prezzo?',
    answer: 'Sì, tutti i nostri noleggi includono assicurazione kasko, furto e responsabilità civile. Non ci sono costi aggiuntivi.',
  },
  {
    category: 'Assicurazione',
    question: 'Cosa copre l\'assicurazione?',
    answer: 'L\'assicurazione copre danni al veicolo, furto, responsabilità civile verso terzi, e assistenza stradale 24/7. Sono esclusi danni intenzionali e guida in stato di ebbrezza.',
  },
  {
    category: 'Ritiro e Consegna',
    question: 'Dove posso ritirare l\'auto?',
    answer: 'Puoi ritirare l\'auto presso la nostra sede principale in Via Roma 123, Roma, o in altri punti di ritiro concordati al momento della prenotazione.',
  },
  {
    category: 'Ritiro e Consegna',
    question: 'Posso riconsegnare l\'auto in un luogo diverso?',
    answer: 'Sì, offriamo il servizio di riconsegna in località diversa con un supplemento che varia in base alla distanza.',
  },
  {
    category: 'Conducenti',
    question: 'Posso aggiungere un secondo conducente?',
    answer: 'Sì, puoi aggiungere fino a 2 conducenti aggiuntivi. Ogni conducente deve presentare patente e documento d\'identità validi e rispettare i requisiti di età.',
  },
  {
    category: 'Vendita',
    question: 'Le auto in vendita hanno garanzia?',
    answer: 'Sì, tutte le auto in vendita includono 12 mesi di garanzia. Le auto nuove hanno la garanzia del costruttore.',
  },
  {
    category: 'Vendita',
    question: 'Offrite finanziamenti?',
    answer: 'Sì, offriamo soluzioni di finanziamento personalizzate con tassi competitivi. Contattaci per maggiori informazioni.',
  },
  {
    category: 'Vendita',
    question: 'Accettate permute?',
    answer: 'Sì, valutiamo la tua auto usata per la permuta. Contattaci per una valutazione gratuita.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutte')

  const categories = ['Tutte', ...Array.from(new Set(faqs.map(faq => faq.category)))]
  const filteredFaqs = selectedCategory === 'Tutte' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HelpCircle className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Domande Frequenti
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Trova le risposte alle domande più comuni sul noleggio e la vendita di auto
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-blue-600 uppercase">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      {faq.question}
                    </h3>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0 ml-4" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Non hai trovato la risposta che cercavi?
            </h2>
            <p className="text-gray-600 mb-6">
              Il nostro team è sempre disponibile per aiutarti
            </p>
            <a
              href="/contatti"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Contattaci
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

