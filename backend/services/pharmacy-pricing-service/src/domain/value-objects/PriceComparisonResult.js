class PriceComparisonResult {

  constructor({ medicationName, bestOffer, alternativeOffer }) {
    this.medicationName = medicationName;
    this.bestOffer = bestOffer;
    this.alternativeOffer = alternativeOffer;
    this.savingsAmount = Number(
      Math.max(0, alternativeOffer.price - bestOffer.price).toFixed(2)
    );
    Object.freeze(this);
  }

  toDTO() {
    return {
      medicationName: this.medicationName,
      savingsAmount: this.savingsAmount,
      savingsLabel: `Ahorras $${this.savingsAmount.toFixed(2)} en este insumo`,
      bestOffer: {
        pharmacyName: this.bestOffer.pharmacyName,
        price: this.bestOffer.price,
        formattedPrice: `$${this.bestOffer.price.toFixed(2)}`,
        badgeLabel: this.bestOffer.badgeLabel || 'Precio Más Bajo',
        deliveryInfo: this.bestOffer.deliveryInfo,
        orderUrl: this.bestOffer.orderUrl,
      },
      alternativeOffer: {
        pharmacyName: this.alternativeOffer.pharmacyName,
        price: this.alternativeOffer.price,
        formattedPrice: `$${this.alternativeOffer.price.toFixed(2)}`,
        badgeLabel: this.alternativeOffer.deliveryInfo || 'Entrega en 30 min',
        deliveryInfo: this.alternativeOffer.deliveryInfo,
        orderUrl: this.alternativeOffer.orderUrl,
      },
    };
  }
}

module.exports = { PriceComparisonResult };
