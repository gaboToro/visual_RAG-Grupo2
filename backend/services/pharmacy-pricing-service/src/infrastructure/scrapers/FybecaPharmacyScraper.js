const https = require('https');
const { IPharmacyScraper } = require('../../domain/services/IPharmacyScraper');
const { MedicationProduct } = require('../../domain/entities/MedicationProduct');

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
}

const OFFLINE_SNAPSHOT = [
  { id: 'SCRAPE-FY-001', name: 'Clorhexidina Solución Antiséptica Tópica 2% 120ml', fybecaPrice: 4.15, cruzAzulPrice: 3.20 },
  { id: 'SCRAPE-FY-002', name: 'Apósito Tegaderm Impermeable Estéril 3M 10x12cm', fybecaPrice: 4.50, cruzAzulPrice: 4.85 }
];

class FybecaPharmacyScraper extends IPharmacyScraper {
  constructor() {
    super();
    this.name = 'Fybeca Web Scraper';
  }

  async scrapeLiveProducts(query = 'clorhexidina') {
    return [];
  }
}

module.exports = { FybecaPharmacyScraper };
