/**
 * @file MedicationProduct.js
 * @description Entidad Raíz de Agregado (Aggregate Root - DDD) que representa un medicamento
 * o insumo quirúrgico posoperatorio con múltiples ofertas de farmacias.
 */

class MedicationProduct {
  /**
   * Inicializa la entidad MedicationProduct.
   * @param {Object} params - Datos del insumo o medicamento.
   * @param {string} params.id - Identificador único del producto.
   * @param {string} params.name - Nombre comercial/clínico (ej. "Clorhexidina Solución 2% 120ml").
   * @param {string} params.category - Categoría terapéutica (ej. "Antiséptico", "Apósito Quirúrgico").
   * @param {Array<string>} params.indicatedFor - Estados de cicatrización o tratamientos asociados.
   * @param {Array<Object>} params.pharmacyOffers - Lista de precios por farmacia.
   */
  constructor({ id, name, category, indicatedFor = [], pharmacyOffers = [] }) {
    if (!id || !name || !Array.isArray(pharmacyOffers) || pharmacyOffers.length === 0) {
      throw new Error('Invariante violada: MedicationProduct requiere id, name y al menos una oferta.');
    }
    this.id = id;
    this.name = name;
    this.category = category;
    this.indicatedFor = indicatedFor;
    this.pharmacyOffers = [...pharmacyOffers].sort((a, b) => a.price - b.price);
  }

  /**
   * Obtiene la oferta de farmacia recomendada (la de mejor relación precio/disponibilidad).
   * @returns {Object} Oferta seleccionada como principal para la lista de insumos.
   */
  getRecommendedOffer() {
    const preferred = this.pharmacyOffers.find((o) => o.isPrimaryRecommendation);
    return preferred || this.pharmacyOffers[0];
  }

  /**
   * Obtiene la oferta más económica y la segunda oferta para comparar precios.
   * @returns {{ lowest: Object, second: Object }} Par de ofertas ordenadas por menor precio.
   */
  getTopTwoOffersByPrice() {
    const sorted = [...this.pharmacyOffers].sort((a, b) => a.price - b.price);
    return {
      lowest: sorted[0],
      second: sorted[1] || sorted[0],
    };
  }

  /**
   * Serializa el medicamento junto con su mejor oferta para las tarjetas de la Pantalla 05 de Figma.
   * @returns {Object} DTO del insumo recomendado.
   */
  toRecommendedItemDTO() {
    const offer = this.getRecommendedOffer();
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      pharmacyName: offer.pharmacyName,
      deliveryInfo: offer.deliveryInfo,
      subtitle: `${offer.pharmacyName} • ${offer.deliveryInfo}`,
      price: offer.price,
      formattedPrice: `$${offer.price.toFixed(2)}`,
      orderUrl: offer.orderUrl,
      allOffers: this.pharmacyOffers,
    };
  }
}

module.exports = { MedicationProduct };
