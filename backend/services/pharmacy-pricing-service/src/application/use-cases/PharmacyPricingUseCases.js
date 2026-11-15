class PharmacyPricingUseCases {

  constructor(medicationRepository, recommenderService) {
    this.medicationRepository = medicationRepository;
    this.recommenderService = recommenderService;
  }

  async getRecommendationsForPatient(clinicalContext = {}) {
    const catalog = await this.medicationRepository.findAll();
    return this.recommenderService.recommendBestPriceMedications(catalog, clinicalContext);
  }
}

module.exports = { PharmacyPricingUseCases };
