/**
 * @file PriceComparisonResult.js
 * @description Objeto de Valor (Value Object - DDD) que encapsula la comparativa de precios
 * entre cadenas farmacéuticas y calcula automáticamente el ahorro monetario para el paciente.
 */

class PriceComparisonResult {
  /**
   * Construye el resultado inmutable de comparativa de precios entre farmacias.
   * @param {Object} params - Ofertas comparadas.
   * @param {string} params.medicationName - Nombre del medicamento o insumo comparado.
   * @param {Object} params.bestOffer - Oferta con el precio más bajo (ej. Cruz Azul $3.20).
   * @param {Object} params.alternativeOffer - Oferta alternativa (ej. Fybeca $4.15).
   */
  constructor({ medicationName, bestOffer, alternativeOffer }) {
    this.medicationName = medicationName;
    this.bestOffer = bestOffer;
    this.alternativeOffer = alternativeOffer;
    this.savingsAmount = Number(
      Math.max(0, alternativeOffer.price - bestOffer.price).toFixed(2)
    );
    Object.freeze(this);
  }

  /**
   * Devuelve el objeto serializable para la tarjeta "Comparativa de Precios" de la Pantalla 05 de Figma.
   * @returns {Object} Datos de comparación de precios y ahorro formateado.
   */
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
