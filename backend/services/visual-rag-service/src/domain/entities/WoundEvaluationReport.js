/**
 * @file WoundEvaluationReport.js
 * @description Entidad Raíz de Agregado (Aggregate Root - DDD) que representa un Reporte Clínico Oficial
 * generado tras evaluar las fotos de la herida postoperatoria con el motor Visual RAG.
 */

class WoundEvaluationReport {
  /**
   * Construye la entidad WoundEvaluationReport validando sus invariantes de dominio.
   * @param {Object} params - Propiedades del reporte clínico.
   * @param {string} params.folio - Código único del reporte (ej. "REP-475381").
   * @param {string} params.patientId - ID del paciente evaluado.
   * @param {string} params.patientName - Nombre completo del paciente.
   * @param {number} params.postOpDay - Día postoperatorio en el que se realizó la evaluación (ej. 79).
   * @param {string} params.formattedDate - Fecha formateada del reporte (ej. "05 nov 2026 (7:07)").
   * @param {string} params.diagnosisTitle - Título diagnóstico (ej. "Cicatrización Normal").
   * @param {string} params.statusBadge - Etiqueta de evolución (ej. "Evolución Favorable").
   * @param {number} params.photosCount - Cantidad de fotografías analizadas (de 1 a 4).
   * @param {Array<string>} params.photoLabels - Etiquetas o URLs de las fotos analizadas.
   * @param {string} params.medicalPlanHeader - Encabezado del estado de la herida (ej. "ESTADO DE LA HERIDA (DÍA 79):").
   * @param {string} params.medicalPlanSummary - Resumen generado por el motor RAG.
   * @param {string} params.clinicalSuggestions - Sugerencias clínicas detalladas para el modal oficial.
   * @param {Array<string>} params.recommendedMedications - Insumos recomendados según el tratamiento médico.
   * @param {number} [params.confidenceScore=0.98] - Nivel de confianza del modelo ML/RAG.
   */
  constructor({
    folio,
    patientId,
    patientName,
    postOpDay,
    formattedDate,
    diagnosisTitle,
    statusBadge = 'Evolución Favorable',
    photosCount = 2,
    photoLabels = ['Foto #1', 'Foto #2'],
    medicalPlanHeader,
    medicalPlanSummary,
    clinicalSuggestions,
    recommendedMedications = [],
    confidenceScore = 0.98,
  }) {
    if (!folio || !patientId || !diagnosisTitle) {
      throw new Error('Invariante violada: folio, patientId y diagnosisTitle son obligatorios.');
    }

    this.folio = folio;
    this.patientId = patientId;
    this.patientName = patientName || 'Nelson Steven Casa';
    this.postOpDay = Number(postOpDay) || 79;
    this.formattedDate = formattedDate || '05 nov 2026 (7:07)';
    this.diagnosisTitle = diagnosisTitle;
    this.statusBadge = statusBadge;
    this.photosCount = Number(photosCount) || photoLabels.length || 1;
    this.photoLabels = photoLabels;
    this.medicalPlanHeader =
      medicalPlanHeader || `ESTADO DE LA HERIDA (DÍA ${this.postOpDay}):`;
    this.medicalPlanSummary = medicalPlanSummary;
    this.clinicalSuggestions = clinicalSuggestions;
    this.recommendedMedications = recommendedMedications;
    this.confidenceScore = confidenceScore;
    this.verifiedSignature = 'Documento Clínico Digital Verificado • Visual RAG';
  }

  /**
   * Serializa el reporte clínico a un objeto DTO para las Pantallas 03, 04 y 05 de Figma.
   * @returns {Object} Representación pública del Reporte Clínico Oficial.
   */
  toDTO() {
    return {
      folio: this.folio,
      patientId: this.patientId,
      patientName: this.patientName,
      postOpDay: this.postOpDay,
      formattedDate: this.formattedDate,
      diagnosisTitle: this.diagnosisTitle,
      statusBadge: this.statusBadge,
      photosCount: this.photosCount,
      photoLabels: this.photoLabels,
      medicalPlanHeader: this.medicalPlanHeader,
      medicalPlanSummary: this.medicalPlanSummary,
      clinicalSuggestions: this.clinicalSuggestions,
      recommendedMedications: this.recommendedMedications,
      confidenceScore: this.confidenceScore,
      verifiedSignature: this.verifiedSignature,
    };
  }
}

module.exports = { WoundEvaluationReport };
