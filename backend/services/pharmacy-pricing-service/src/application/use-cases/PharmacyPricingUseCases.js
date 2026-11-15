/**
 * @file PharmacyPricingUseCases.js
 * @description Capa de Aplicación (Application Layer - DDD) que coordina la obtención de
 * recomendaciones de medicamentos e insumos a mejores precios acorde al tratamiento del médico y RAG.
 */

class PharmacyPricingUseCases {
  /**
   * Inicializa los casos de uso inyectando el repositorio de medicamentos y el recomendador de precios.
   * @param {import('../../domain/repositories/IMedicationRepository').IMedicationRepository} medicationRepository
   * @param {import('../../domain/services/BestPriceRecommenderService').BestPriceRecommenderService} recommenderService
   */
  constructor(medicationRepository, recommenderService) {
    this.medicationRepository = medicationRepository;
    this.recommenderService = recommenderService;
  }

  /**
   * Caso de Uso 1: Obtiene la comparativa de mejores precios y los medicamentos recomendados
   * según el estado RAG de la herida y la receta médica subida por el cirujano (Pantalla 05 de Figma).
   * @param {Object} clinicalContext - Contexto clínico (día postoperatorio, clasificación RAG, receta).
   * @returns {Promise<Object>} Objeto con comparativa de precios y lista de medicamentos recomendados.
   */
  async getRecommendationsForPatient(clinicalContext = {}) {
    const catalog = await this.medicationRepository.findAll();
    return this.recommenderService.recommendBestPriceMedications(catalog, clinicalContext);
  }
}

module.exports = { PharmacyPricingUseCases };
