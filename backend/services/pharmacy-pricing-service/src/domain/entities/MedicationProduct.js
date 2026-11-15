class MedicationProduct {

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

  getRecommendedOffer() {
    const preferred = this.pharmacyOffers.find((o) => o.isPrimaryRecommendation);
    return preferred || this.pharmacyOffers[0];
  }

  getTopTwoOffersByPrice() {
    const sorted = [...this.pharmacyOffers].sort((a, b) => a.price - b.price);
    return {
      lowest: sorted[0],
      second: sorted[1] || sorted[0],
    };
  }

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
