// Script per generare un contratto PDF di test
const { jsPDF } = require('jspdf');
const fs = require('fs');

// Dati della prenotazione
const booking = {
  id: 'fded9222-312a-4bfa-909b-410385f487ff',
  start_date: '2025-10-24T00:00:00.000Z',
  end_date: '2025-10-26T00:00:00.000Z',
  pickup_location: 'Barzanò (LC) - Sede Centrale',
  dropoff_location: 'Barzanò (LC) - Sede Centrale',
  total_price: 60.00,
};

const car = {
  brand: 'Fiat',
  model: 'Panda',
  year: 2023,
  category: 'utilitaria',
  transmission: 'Manuale',
  fuel_type: 'Benzina',
  seats: 5,
  price_per_day: 30.00,
};

const profile = {
  full_name: 'Mario Rossi',
  email: 'test.cliente@mottacarandgo.it',
  phone: '+39 333 123 4567',
  address: 'Via Roma 123',
  city: 'Milano',
  postal_code: '20100',
};

// Genera PDF
const pdf = new jsPDF();
const pageWidth = pdf.internal.pageSize.getWidth();
const pageHeight = pdf.internal.pageSize.getHeight();
let yPos = 20;

// Helper function
const addText = (text, x, y, options = {}) => {
  pdf.setFontSize(options.fontSize || 12);
  pdf.setFont('helvetica', options.fontStyle || 'normal');
  pdf.text(text, x, y, options);
};

// Header
pdf.setFillColor(37, 99, 235);
pdf.rect(0, 0, pageWidth, 40, 'F');

pdf.setTextColor(255, 255, 255);
addText('MOTTA CAR & GO SRL', pageWidth / 2, 15, { 
  fontSize: 20, 
  fontStyle: 'bold',
  align: 'center' 
});
addText('Contratto di Noleggio Auto', pageWidth / 2, 28, { 
  fontSize: 14,
  align: 'center' 
});

pdf.setTextColor(0, 0, 0);
yPos = 55;

// Contract Number and Date
addText(`Contratto N°: ${booking.id.substring(0, 8).toUpperCase()}`, 20, yPos, { 
  fontSize: 10,
  fontStyle: 'bold' 
});
yPos += 6;
addText(`Data: 23 ottobre 2025`, 20, yPos, { 
  fontSize: 10 
});
yPos += 15;

// Section: Customer Info
pdf.setFillColor(240, 240, 240);
pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
addText('DATI CLIENTE', 20, yPos, { fontSize: 12, fontStyle: 'bold' });
yPos += 12;

addText(`Nome: ${profile.full_name}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Email: ${profile.email}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Telefono: ${profile.phone}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Indirizzo: ${profile.address}, ${profile.city} ${profile.postal_code}`, 20, yPos, { 
  fontSize: 10 
});
yPos += 10;

// Section: Car Info
pdf.setFillColor(240, 240, 240);
pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
addText('VEICOLO NOLEGGIATO', 20, yPos, { fontSize: 12, fontStyle: 'bold' });
yPos += 12;

addText(`Marca e Modello: ${car.brand} ${car.model}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Anno: ${car.year}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Categoria: ${car.category}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Trasmissione: ${car.transmission}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Carburante: ${car.fuel_type}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Posti: ${car.seats}`, 20, yPos, { fontSize: 10 });
yPos += 10;

// Section: Rental Details
pdf.setFillColor(240, 240, 240);
pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
addText('DETTAGLI NOLEGGIO', 20, yPos, { fontSize: 12, fontStyle: 'bold' });
yPos += 12;

addText(`Data Ritiro: 24 ottobre 2025`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Data Consegna: 26 ottobre 2025`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Luogo Ritiro: ${booking.pickup_location}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Luogo Consegna: ${booking.dropoff_location}`, 20, yPos, { fontSize: 10 });
yPos += 10;

// Section: Price
pdf.setFillColor(240, 240, 240);
pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
addText('DETTAGLI PAGAMENTO', 20, yPos, { fontSize: 12, fontStyle: 'bold' });
yPos += 12;

addText(`Tariffa giornaliera: €${car.price_per_day.toFixed(2)}`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Numero giorni: 2`, 20, yPos, { fontSize: 10 });
yPos += 6;
addText(`Totale: €${booking.total_price.toFixed(2)}`, 20, yPos, { 
  fontSize: 12,
  fontStyle: 'bold' 
});
yPos += 15;

// Section: Terms and Conditions
pdf.setFillColor(240, 240, 240);
pdf.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
addText('TERMINI E CONDIZIONI', 20, yPos, { fontSize: 12, fontStyle: 'bold' });
yPos += 12;

const terms = [
  '1. Il conducente deve avere almeno 21 anni e possedere una patente di guida valida.',
  '2. L\'assicurazione completa (Kasko, furto, RC) è inclusa nel prezzo.',
  '3. Il chilometraggio è illimitato.',
  '4. Il veicolo deve essere restituito con il pieno di carburante.',
  '5. È vietato fumare all\'interno del veicolo.',
  '6. Il conducente è responsabile di eventuali danni non coperti dall\'assicurazione.',
  '7. In caso di incidente, contattare immediatamente il numero di assistenza 24/7.',
  '8. La cancellazione deve essere effettuata almeno 48 ore prima del ritiro.',
];

pdf.setFontSize(9);
terms.forEach(term => {
  if (yPos > pageHeight - 30) {
    pdf.addPage();
    yPos = 20;
  }
  const lines = pdf.splitTextToSize(term, pageWidth - 40);
  pdf.text(lines, 20, yPos);
  yPos += lines.length * 5;
});

yPos += 10;

// Signatures
if (yPos > pageHeight - 50) {
  pdf.addPage();
  yPos = 20;
}

addText('Firma Cliente: _____________________', 20, yPos, { fontSize: 10 });
addText('Firma Motta Car & Go: _____________________', pageWidth / 2 + 10, yPos, { fontSize: 10 });
yPos += 20;

// Footer
pdf.setFontSize(8);
pdf.setTextColor(128, 128, 128);
const footerText = 'Motta Car & Go SRL - Via Giuseppe Parini, 5 - 23891 Barzanò (LC) - P.IVA: 03456789012 - Tel: +39 351 987 6543';
addText(footerText, pageWidth / 2, pageHeight - 10, { 
  fontSize: 8,
  align: 'center' 
});

// Save PDF
pdf.save('contratto-mario-rossi.pdf');
console.log('✅ Contratto PDF generato: contratto-mario-rossi.pdf');

