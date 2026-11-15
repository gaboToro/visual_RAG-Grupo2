/**
 * @file InMemoryMedicationRepository.js
 * @description Adaptador de Infraestructura (Infrastructure Layer - DDD) que contiene el catálogo
 * de insumos postoperatorios y precios en farmacias ecuatorianas (Cruz Azul, Fybeca, SanaSana)
 * idénticos a la Pantalla 05 ("05. Paciente - Farmacia & Insumos") de Figma.
 */

const { IMedicationRepository } = require('../../domain/repositories/IMedicationRepository');
const { MedicationProduct } = require('../../domain/entities/MedicationProduct');

class InMemoryMedicationRepository extends IMedicationRepository {
  /**
   * Inicializa el catálogo de medicamentos y ofertas de farmacias en memoria.
   */
  constructor() {
    super();
    this.products = [];
    this.seedInitialFigmaCatalog();
  }

  /**
   * Precarga los productos y precios exactos del prototipo de Figma:
   * - Comparativa: Cruz Azul ($3.20 - Precio Más Bajo) vs Fybeca ($4.15 - Entrega en 30 min) -> Ahorras $0.95
   * - Insumo 1: Clorhexidina Solución 2% 120ml ($3.20 • Cruz Azul • Entrega Inmediata)
   * - Insumo 2: Apósito Tegaderm Impermeable 3M ($4.50 • Fybeca • Entrega en 30 min)
   */
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

  /**
   * Obtiene todos los medicamentos del catálogo.
   * @returns {Promise<Array<MedicationProduct>>}
   */
  async findAll() {
    return [...this.products];
  }

  /**
   * Busca un medicamento por su ID.
   * @param {string} id - ID del medicamento.
   * @returns {Promise<MedicationProduct|null>}
   */
  async findById(id) {
    return this.products.find((p) => p.id === id) || null;
  }
}

module.exports = { InMemoryMedicationRepository };
