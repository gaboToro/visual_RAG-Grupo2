class IPharmacyScraper {

  async scrapeLiveProducts(_query = '') {
    throw new Error('Método scrapeLiveProducts() debe ser implementado en la infraestructura.');
  }
}

module.exports = { IPharmacyScraper };
