/**
 * @file PostOpWoundDataset.js
 * @description Base de Conocimiento y Dataset de Machine Learning (Infrastructure Layer - DDD)
 * utilizado por el motor Visual RAG para recuperar casos clínicos similares de heridas postoperatorias.
 */

class PostOpWoundDataset {
  /**
   * Inicializa el dataset clínico etiquetado con vectores de características visuales (embeddings)
   * y protocolos médicos validados para heridas quirúrgicas.
   */
  constructor() {
    this.entries = [
      {
        datasetId: 'ML-WND-001',
        classification: 'Cicatrización Normal',
        statusBadge: 'Evolución Favorable',
        featureVector: [0.96, 0.94, 0.08, 0.06, 0.02, 0.95],
        clinicalPattern:
          'Bordes quirúrgicos bien afrontados, epitelización completa, ausencia de signos de infección o dehiscencia.',
        basePlanTemplate:
          'La cicatrización de su herida quirúrgica evoluciona favorablemente con bordes afrontados y tejido epitelial sano.',
        clinicalSuggestions:
          'Mantener el área seca. Limpieza con solución salina al 0.9% y apósito Tegaderm permeable al vapor. No frotar la costra.',
        recommendedActiveIngredients: ['Clorhexidina Solución 2%', 'Apósito Tegaderm Impermeable 3M'],
      },
      {
        datasetId: 'ML-WND-002',
        classification: 'Cicatrización Hipertrófica',
        statusBadge: 'Evolución Favorable',
        featureVector: [0.91, 0.86, 0.30, 0.22, 0.05, 0.79],
        clinicalPattern:
          'Herida quirúrgica cerrada con ligero engrosamiento fibroso elevado dentro de los límites de la incisión original.',
        basePlanTemplate:
          'La herida quirúrgica está completamente cerrada con remodelación colágena activa en la línea de sutura.',
        clinicalSuggestions:
          'Mantener hidratación controlada, limpieza antiséptica suave con Clorhexidina al 2% y cubrir con apósito protector sin fricción.',
        recommendedActiveIngredients: ['Clorhexidina Solución 2%', 'Apósito Tegaderm Impermeable 3M'],
      },
      {
        datasetId: 'ML-WND-003',
        classification: 'Granulación Postoperatoria Temprana',
        statusBadge: 'Evolución Favorable',
        featureVector: [0.84, 0.78, 0.25, 0.20, 0.10, 0.82],
        clinicalPattern:
          'Tejido de granulación rosado saludable en fase proliferativa temprana sin exudado purulento.',
        basePlanTemplate:
          'Se observa tejido de granulación limpio en fase proliferativa acorde al cronograma postoperatorio.',
        clinicalSuggestions:
          'Realizar curación diaria con antiséptico de Clorhexidina 2% y proteger la incisión con apósito estéril impermeable.',
        recommendedActiveIngredients: ['Clorhexidina Solución 2%', 'Apósito Tegaderm Impermeable 3M'],
      },
    ];
  }

  /**
   * Recupera los K casos clínicos más similares del dataset de Machine Learning empleando
   * búsqueda vectorial por similitud de coseno (Retrieval Step del pipeline RAG).
   * @param {import('../../domain/value-objects/VisualEmbedding').VisualEmbedding} queryEmbedding - Vector de la foto del paciente.
   * @param {number} [topK=2] - Cantidad de documentos/casos clínicos a recuperar.
   * @returns {Array<Object>} Casos del dataset ordenados de mayor a menor similitud.
   */
  retrieveSimilarClinicalCases(queryEmbedding, topK = 2) {
    const scoredEntries = this.entries.map((entry) => ({
      ...entry,
      similarityScore: queryEmbedding.cosineSimilarity(entry.featureVector),
    }));

    scoredEntries.sort((a, b) => b.similarityScore - a.similarityScore);
    return scoredEntries.slice(0, topK);
  }
}

module.exports = { PostOpWoundDataset };
