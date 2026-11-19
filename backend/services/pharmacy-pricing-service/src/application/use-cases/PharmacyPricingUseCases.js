const {
  FybecaPharmacyScraper,
} = require('../../infrastructure/scrapers/FybecaPharmacyScraper');

class PharmacyPricingUseCases {

  constructor(medicationRepository, recommenderService, scraper = null) {
    this.medicationRepository = medicationRepository;
    this.recommenderService = recommenderService;
    this.scraper = scraper || new FybecaPharmacyScraper();
  }

  async getRecommendationsForPatient(clinicalContext = {}) {
    const catalog = await this.medicationRepository.findAll();
    return this.recommenderService.recommendBestPriceMedications(catalog, clinicalContext);
  }

  async getFullCatalog(query = '') {
    const catalog = await this.medicationRepository.findAll();
    const q = String(query || '').toLowerCase().trim();
    const filtered = !q
      ? catalog
      : catalog.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.category && p.category.toLowerCase().includes(q))
        );
    return filtered.map((p) => p.toRecommendedItemDTO());
  }

  async scrapeLivePrices(query = 'clorhexidina') {
    const q = String(query || 'clorhexidina').trim();
    const products = await this.scraper.scrapeLiveProducts(q);
    return {
      query: q,
      totalScraped: products.length,
      scrapedAt: new Date().toISOString(),
      source: 'Fybeca & Cruz Azul Web Scraper',
      items: products.map((p) => p.toRecommendedItemDTO()),
    };
  }

  async syncLivePricesToCatalog(query = 'clorhexidina') {
    const q = String(query || 'clorhexidina').trim();
    const scrapedProducts = await this.scraper.scrapeLiveProducts(q);
    await this.medicationRepository.upsertMany(scrapedProducts);
    const updatedCatalog = await this.medicationRepository.findAll();

    return {
      query: q,
      syncedCount: scrapedProducts.length,
      catalogTotal: updatedCatalog.length,
      syncedAt: new Date().toISOString(),
      items: scrapedProducts.map((p) => p.toRecommendedItemDTO()),
    };
  }
}

module.exports = { PharmacyPricingUseCases };
