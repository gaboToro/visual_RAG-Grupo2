/**
 * @file IMedicationRepository.js
 * @description Puerto / Interfaz de Repositorio de Dominio (DDD) para consultar el catálogo
 * de medicamentos e insumos quirúrgicos y sus precios por farmacia.
 */

class IMedicationRepository {
  /**
   * Obtiene todos los medicamentos e insumos disponibles con sus ofertas en farmacias.
   * @returns {Promise<Array<import('../entities/MedicationProduct').MedicationProduct>>}
   */
  async findAll() {
    throw new Error('Método findAll() debe ser implementado por el repositorio concreto.');
  }

  /**
   * Busca un medicamento o insumo por su identificador único.
   * @param {string} id - ID del medicamento.
   * @returns {Promise<import('../entities/MedicationProduct').MedicationProduct|null>}
   */
  async findById(id) {
    throw new Error('Método findById() debe ser implementado por el repositorio concreto.');
  }
}

module.exports = { IMedicationRepository };
