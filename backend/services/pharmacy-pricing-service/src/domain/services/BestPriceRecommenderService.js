const { PriceComparisonResult } = require('../value-objects/PriceComparisonResult');

class BestPriceRecommenderService {

  recommendBestPriceMedications(
    catalog,
    {
      prescribedMedications = [],
      woundClassification = 'Cicatrización Normal',
      postOpDay = 79,
    } = {}
  ) {

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

    const featuredProduct = matchedProducts[0];
    const { lowest, second } = featuredProduct.getTopTwoOffersByPrice();
    const priceComparison = new PriceComparisonResult({
      medicationName: featuredProduct.name,
      bestOffer: lowest,
      alternativeOffer: second,
    });

    const recommendedItems = matchedProducts.map((p) => p.toRecommendedItemDTO());
    const totalSavingsAmount = Number(
      matchedProducts.reduce((acc, p) => acc + p.getSavingsAmount(), 0).toFixed(2)
    );

    const isAlertCase = woundClassification.toLowerCase().includes('infecc');
    const summaryText = isAlertCase
      ? `ESTADO DE LA HERIDA (DÍA ${postOpDay}): Se detectaron signos de alerta (${woundClassification}). Adquiera los insumos antisépticos y consulte a su cirujano.`
      : `ESTADO DE LA HERIDA (DÍA ${postOpDay}): La evolución es favorable (${woundClassification}). Mantenga la limpieza antiséptica y el recubrimiento impermeable prescrito por su médico.`;

    return {
      postOpDay,
      woundClassification,
      headerSubtitle: `Día ${postOpDay} de reposo • ${woundClassification}`,
      aiRecoveryTip: {
        title: 'Consejo de Recuperación IA',
        summary: summaryText,
      },
      priceComparison: priceComparison.toDTO(),
      totalSavingsAmount,
      totalSavingsLabel: `Ahorro total estimado: $${totalSavingsAmount.toFixed(2)}`,
      recommendedItems,
    };
  }
}

module.exports = { BestPriceRecommenderService };
