const https = require('https');
const { IPharmacyScraper } = require('../../domain/services/IPharmacyScraper');
const { MedicationProduct } = require('../../domain/entities/MedicationProduct');

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");
}

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
