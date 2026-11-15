/**
 * @file VisualRagUseCases.js
 * @description Capa de Aplicación (Application Layer - DDD) que coordina la subida y evaluación
 * de fotografías de heridas postoperatorias mediante Machine Learning (RAG) y consulta de reportes.
 */

class VisualRagUseCases {
  /**
   * Inicializa los casos de uso inyectando el repositorio de reportes y el servicio de dominio RAG.
   * @param {import('../../domain/repositories/IWoundReportRepository').IWoundReportRepository} reportRepository
   * @param {import('../../domain/services/WoundRagEvaluatorService').WoundRagEvaluatorService} ragEvaluatorService
   */
  constructor(reportRepository, ragEvaluatorService) {
    this.reportRepository = reportRepository;
    this.ragEvaluatorService = ragEvaluatorService;
  }

  /**
   * Caso de Uso 1: Evalúa de 1 a 4 fotografías de la incisión del paciente usando el dataset ML (RAG),
   * almacena el nuevo Reporte Clínico Oficial y lo devuelve junto con las recomendaciones.
   * @param {Object} evaluationInput - Datos enviados desde la Pantalla 02 (Paciente - Evaluación).
   * @returns {Promise<Object>} Nuevo reporte clínico evaluado en formato DTO.
   */
  async evaluatePatientWoundPhotos(evaluationInput) {
    const newReport = this.ragEvaluatorService.evaluateWoundWithRAG(evaluationInput);
    await this.reportRepository.save(newReport);
    return newReport.toDTO();
  }

  /**
   * Caso de Uso 2: Lista todos los reportes clínicos guardados de un paciente
   * (usado en la Pantalla 03: "Reportes Clínicos Guardados").
   * @param {string} patientId - Identificador del paciente.
   * @returns {Promise<Array<Object>>} Arreglo de reportes en formato DTO.
   */
  async getSavedReportsByPatient(patientId) {
    const reports = await this.reportRepository.findByPatientId(patientId);
    return reports.map((r) => r.toDTO());
  }

  /**
   * Caso de Uso 3: Obtiene el detalle completo de un Reporte Clínico Oficial por su folio
   * (usado en la Pantalla 04: Modal "Reporte Clínico Oficial").
   * @param {string} folio - Folio único del reporte (ej. "REP-475381").
   * @returns {Promise<Object>} Detalle del reporte en formato DTO.
   */
  async getReportDetailByFolio(folio) {
    const report = await this.reportRepository.findByFolio(folio);
    if (!report) {
      const error = new Error(`No se encontró el reporte con folio ${folio}`);
      error.statusCode = 404;
      throw error;
    }
    return report.toDTO();
  }
}

module.exports = { VisualRagUseCases };
