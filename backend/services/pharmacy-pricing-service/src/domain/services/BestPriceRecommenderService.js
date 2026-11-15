/**
 * @file BestPriceRecommenderService.js
 * @description Servicio de Dominio (Domain Service - DDD) que cruza el diagnóstico RAG de la herida
 * y el tratamiento médico subido por el doctor para recomendar medicamentos a mejores precios.
 */

const { PriceComparisonResult } = require('../value-objects/PriceComparisonResult');

class BestPriceRecommenderService {
  /**
   * Filtra y ordena los medicamentos del catálogo acorde al tratamiento prescrito por el doctor
   * y al estado de cicatrización detectado por el modelo Visual RAG.
   * @param {Array<import('../entities/MedicationProduct').MedicationProduct>} catalog - Catálogo completo.
   * @param {Object} context - Contexto clínico del paciente.
   * @param {Array<string>} [context.prescribedMedications] - Medicamentos en la Ficha Postoperatoria.
   * @param {string} [context.woundClassification] - Diagnóstico emitido por el motor Visual RAG.
   * @returns {Object} Recomendación completa con comparativa de precios y listado de insumos.
   */
  recommendBestPriceMedications(
    catalog,
    {
      prescribedMedications = [],
      woundClassification = 'Cicatrización Normal',
      postOpDay = 79,
    } = {}
  ) {
    // Filtramos los productos que coinciden con la receta del doctor o con la clasificación RAG
    let matchedProducts = catalog.filter((product) => {
      const matchesPrescription = prescribedMedications.some(
        (rx) =>
          product.name.toLowerCase().includes(rx.toLowerCase()) ||
          rx.toLowerCase().includes(product.name.toLowerCase())
      );
      const matchesClassification = product.indicatedFor.some(
        (ind) => ind.toLowerCase() === woundClassification.toLowerCase()
      );
      return matchesPrescription || matchesClassification;
    });

    if (matchedProducts.length === 0) {
      matchedProducts = catalog;
    }

    // Construimos la comparativa destacada sobre el primer insumo esencial
    const featuredProduct = matchedProducts[0];
    const { lowest, second } = featuredProduct.getTopTwoOffersByPrice();
    const priceComparison = new PriceComparisonResult({
      medicationName: featuredProduct.name,
      bestOffer: lowest,
      alternativeOffer: second,
    });

    return {
      postOpDay,
      woundClassification,
      headerSubtitle: `Día ${postOpDay} de reposo • ${woundClassification}`,
      aiRecoveryTip: {
        title: 'Consejo de Recuperación IA',
        summary: `ESTADO DE LA HERIDA (DÍA ${postOpDay}): La evolución es favorable (${woundClassification}). Mantenga la limpieza antiséptica y el recubrimiento impermeable prescrito por su médico.`,
      },
      priceComparison: priceComparison.toDTO(),
      recommendedItems: matchedProducts.map((p) => p.toRecommendedItemDTO()),
    };
  }
}

module.exports = { BestPriceRecommenderService };
