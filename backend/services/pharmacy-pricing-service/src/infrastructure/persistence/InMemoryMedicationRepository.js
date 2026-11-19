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

    const gelSilicona = new MedicationProduct({
      id: 'med-3',
      name: 'Gel de Silicona Cicatrizante 15g',
      category: 'Remodelador Dérmico Postoperatorio',
      indicatedFor: ['Cicatrización Hipertrófica'],
      pharmacyOffers: [
        {
          pharmacyName: 'Cruz Azul',
          price: 11.40,
          deliveryInfo: 'Entrega Inmediata',
          badgeLabel: 'Precio Más Bajo',
          isPrimaryRecommendation: true,
          orderUrl: 'https://farmaciascruzazul.ec',
        },
        {
          pharmacyName: 'Fybeca',
          price: 12.90,
          deliveryInfo: 'Entrega en 30 min',
          badgeLabel: 'Entrega en 30 min',
          isPrimaryRecommendation: false,
          orderUrl: 'https://www.fybeca.com',
        },
      ],
    });

    const mupirocina = new MedicationProduct({
      id: 'med-4',
      name: 'Mupirocina Ungüento Tópico 2% 15g',
      category: 'Antibiótico Tópico de Control Quirúrgico',
      indicatedFor: ['Signos de Infección / Dehiscencia'],
      pharmacyOffers: [
        {
          pharmacyName: 'Cruz Azul',
          price: 6.10,
          deliveryInfo: 'Entrega Inmediata',
          badgeLabel: 'Precio Más Bajo',
          isPrimaryRecommendation: true,
          orderUrl: 'https://farmaciascruzazul.ec',
        },
        {
          pharmacyName: 'Fybeca',
          price: 6.95,
          deliveryInfo: 'Entrega en 30 min',
          badgeLabel: 'Entrega en 30 min',
          isPrimaryRecommendation: false,
          orderUrl: 'https://www.fybeca.com',
        },
      ],
    });

    const solucionSalina = new MedicationProduct({
      id: 'med-5',
      name: 'Solución Salina Estéril 0.9% 250ml',
      category: 'Irrigación Quirúrgica Estéril',
      indicatedFor: ['Granulación Postoperatoria Temprana', 'Signos de Infección / Dehiscencia'],
      pharmacyOffers: [
        {
          pharmacyName: 'Cruz Azul',
          price: 1.85,
          deliveryInfo: 'Entrega Inmediata',
          badgeLabel: 'Precio Más Bajo',
          isPrimaryRecommendation: true,
          orderUrl: 'https://farmaciascruzazul.ec',
        },
        {
          pharmacyName: 'Fybeca',
          price: 2.30,
          deliveryInfo: 'Entrega en 30 min',
          badgeLabel: 'Entrega en 30 min',
          isPrimaryRecommendation: false,
          orderUrl: 'https://www.fybeca.com',
        },
      ],
    });

    this.products.push(clorhexidina, tegaderm, gelSilicona, mupirocina, solucionSalina);
  }

  async findAll() {
    return [...this.products];
  }

  async findById(id) {
    return this.products.find((p) => p.id === id) || null;
  }

  async upsert(product) {
    if (!product || !product.id) return null;
    const existingIndex = this.products.findIndex(
      (p) => p.id === product.id || p.name.toLowerCase() === product.name.toLowerCase()
    );
    if (existingIndex >= 0) {
      this.products[existingIndex] = product;
    } else {
      this.products.push(product);
    }
    return product;
  }

  async upsertMany(products = []) {
    const saved = [];
    for (const p of products) {
      const res = await this.upsert(p);
      if (res) saved.push(res);
    }
    return saved;
  }
}

module.exports = { InMemoryMedicationRepository };
