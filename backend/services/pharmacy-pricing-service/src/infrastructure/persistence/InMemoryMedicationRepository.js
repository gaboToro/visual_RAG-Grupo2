const { IMedicationRepository } = require('../../domain/repositories/IMedicationRepository');
const { MedicationProduct } = require('../../domain/entities/MedicationProduct');

class InMemoryMedicationRepository extends IMedicationRepository {

  constructor() {
    super();
    this.products = [];
    this.seedInitialFigmaCatalog();
  }

  seedInitialFigmaCatalog() {
    const clorhexidina = new MedicationProduct({
      id: 'med-1',
      name: 'Clorhexidina Solución 2% 120ml',
      category: 'Antiséptico Tópico Quirúrgico',
      indicatedFor: [
        'Cicatrización Normal',
        'Cicatrización Hipertrófica',
        'Granulación Postoperatoria Temprana',
      ],
      pharmacyOffers: [
        {
          pharmacyName: 'Cruz Azul',
          price: 3.20,
          deliveryInfo: 'Entrega Inmediata',
          badgeLabel: 'Precio Más Bajo',
          isPrimaryRecommendation: true,
          orderUrl: 'https://farmaciascruzazul.ec',
        },
        {
          pharmacyName: 'Fybeca',
          price: 4.15,
          deliveryInfo: 'Entrega en 30 min',
          badgeLabel: 'Entrega en 30 min',
          isPrimaryRecommendation: false,
          orderUrl: 'https://www.fybeca.com',
        },
      ],
    });

    const tegaderm = new MedicationProduct({
      id: 'med-2',
      name: 'Apósito Tegaderm Impermeable 3M',
      category: 'Recubrimiento Quirúrgico Estéril',
      indicatedFor: [
        'Cicatrización Normal',
        'Cicatrización Hipertrófica',
        'Granulación Postoperatoria Temprana',
      ],
      pharmacyOffers: [
        {
          pharmacyName: 'Fybeca',
          price: 4.50,
          deliveryInfo: 'Entrega en 30 min',
          badgeLabel: 'Entrega en 30 min',
          isPrimaryRecommendation: true,
          orderUrl: 'https://www.fybeca.com',
        },
        {
          pharmacyName: 'Cruz Azul',
          price: 4.85,
          deliveryInfo: 'Entrega en 45 min',
          badgeLabel: 'Stock Disponible',
          isPrimaryRecommendation: false,
          orderUrl: 'https://farmaciascruzazul.ec',
        },
      ],
    });

    this.products.push(clorhexidina, tegaderm);
  }

  async findAll() {
    return [...this.products];
  }

  async findById(id) {
    return this.products.find((p) => p.id === id) || null;
  }
}

module.exports = { InMemoryMedicationRepository };
