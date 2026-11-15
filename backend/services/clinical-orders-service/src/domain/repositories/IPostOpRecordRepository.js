/**
 * @file IPostOpRecordRepository.js
 * @description Puerto / Interfaz de Repositorio de Dominio (DDD) para persistir y consultar
 * las Fichas Postoperatorias y Órdenes Médicas de los pacientes.
 */

class IPostOpRecordRepository {
  /**
   * Busca la ficha postoperatoria activa de un paciente por su ID.
   * @param {string} patientId - Identificador del paciente.
   * @returns {Promise<import('../entities/PostOpRecord').PostOpRecord|null>}
   */
  async findByPatientId(patientId) {
    throw new Error('Método findByPatientId() debe ser implementado por el repositorio concreto.');
  }

  /**
   * Persiste o actualiza una Ficha Postoperatoria.
   * @param {import('../entities/PostOpRecord').PostOpRecord} record - Entidad PostOpRecord.
   * @returns {Promise<import('../entities/PostOpRecord').PostOpRecord>}
   */
  async save(record) {
    throw new Error('Método save() debe ser implementado por el repositorio concreto.');
  }
}

module.exports = { IPostOpRecordRepository };
