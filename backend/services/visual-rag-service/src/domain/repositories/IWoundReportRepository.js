/**
 * @file IWoundReportRepository.js
 * @description Puerto / Interfaz de Repositorio de Dominio (DDD) para los Reportes Clínicos Oficiales
 * generados por la evaluación Visual RAG.
 */

class IWoundReportRepository {
  /**
   * Obtiene todos los reportes clínicos guardados de un paciente ordenados del más reciente al más antiguo.
   * @param {string} patientId - Identificador del paciente.
   * @returns {Promise<Array<import('../entities/WoundEvaluationReport').WoundEvaluationReport>>}
   */
  async findByPatientId(patientId) {
    throw new Error('Método findByPatientId() debe ser implementado por el repositorio concreto.');
  }

  /**
   * Busca un reporte específico por su código de folio (ej. "REP-475381").
   * @param {string} folio - Código único del reporte.
   * @returns {Promise<import('../entities/WoundEvaluationReport').WoundEvaluationReport|null>}
   */
  async findByFolio(folio) {
    throw new Error('Método findByFolio() debe ser implementado por el repositorio concreto.');
  }

  /**
   * Guarda un nuevo reporte clínico evaluado en el repositorio.
   * @param {import('../entities/WoundEvaluationReport').WoundEvaluationReport} report - Entidad reporte.
   * @returns {Promise<import('../entities/WoundEvaluationReport').WoundEvaluationReport>}
   */
  async save(report) {
    throw new Error('Método save() debe ser implementado por el repositorio concreto.');
  }
}

module.exports = { IWoundReportRepository };
