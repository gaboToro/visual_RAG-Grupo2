class PharmacyPricingUseCases {

  constructor(medicationRepository, recommenderService) {
    this.medicationRepository = medicationRepository;
    this.recommenderService = recommenderService;
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
}

module.exports = { PharmacyPricingUseCases };
