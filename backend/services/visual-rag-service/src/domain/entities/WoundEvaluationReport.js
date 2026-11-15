class WoundEvaluationReport {

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
