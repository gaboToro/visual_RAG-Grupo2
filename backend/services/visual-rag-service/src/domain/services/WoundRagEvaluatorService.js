const { VisualEmbedding } = require('../value-objects/VisualEmbedding');
const { WoundEvaluationReport } = require('../entities/WoundEvaluationReport');

class WoundRagEvaluatorService {

  constructor(woundDataset) {
    this.woundDataset = woundDataset;
  }

  evaluateWoundWithRAG({
    patientId,
    patientName = 'Nelson Steven Casa',
    postOpDay = 79,
    photos = [],
    doctorTreatment = {},
    patientNotes = '',
  }) {

    const embedding = VisualEmbedding.fromUploadedPhotos({
      photos,
      postOpDay,
      patientNotes,
    });

    const retrievedCases = this.woundDataset.retrieveSimilarClinicalCases(embedding, 2);
    const primaryMatch = retrievedCases[0];

    const procedureName =
      doctorTreatment?.schedule?.procedureName ||
      doctorTreatment?.procedureName ||
      'Correcion Neuronal';

    const prescribedMeds =
      Array.isArray(doctorTreatment?.prescribedMedications) &&
      doctorTreatment.prescribedMedications.length > 0
        ? doctorTreatment.prescribedMedications
        : primaryMatch.recommendedActiveIngredients;

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const folio = `REP-${randomDigits}`;
    const photosCount = Math.max(1, Math.min(4, photos.length || 2));
    const photoLabels = Array.from({ length: photosCount }, (_, idx) => `Foto #${idx + 1}`);

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `05 nov 2026 (${hours}:${minutes})`;

    const augmentedSummary = `${primaryMatch.basePlanTemplate} Acorde a su cirugía (${procedureName}), continúe con el protocolo antiséptico indicado por su cirujano.`;

    return new WoundEvaluationReport({
      folio,
      patientId,
      patientName,
      postOpDay,
      formattedDate,
      diagnosisTitle: primaryMatch.classification,
      statusBadge: primaryMatch.statusBadge,
      photosCount,
      photoLabels,
      medicalPlanHeader: `ESTADO DE LA HERIDA (DÍA ${postOpDay}):`,
      medicalPlanSummary: augmentedSummary,
      clinicalSuggestions: primaryMatch.clinicalSuggestions,
      recommendedMedications: prescribedMeds,
      confidenceScore: primaryMatch.similarityScore,
    });
  }
}

module.exports = { WoundRagEvaluatorService };
