/**
 * @file InMemoryWoundReportRepository.js
 * @description Adaptador de Infraestructura (Infrastructure Layer - DDD) que persiste en memoria
 * los Reportes Clínicos Oficiales, inicializado con los reportes REP-475381 y REP-216547 de Figma.
 */

const { IWoundReportRepository } = require('../../domain/repositories/IWoundReportRepository');
const { WoundEvaluationReport } = require('../../domain/entities/WoundEvaluationReport');

class InMemoryWoundReportRepository extends IWoundReportRepository {
  /**
   * Inicializa el repositorio con los reportes clínicos del prototipo de Figma.
   */
  constructor() {
    super();
    this.reports = [];
    this.seedInitialFigmaReports();
  }

  /**
   * Precarga exactamente los dos reportes que aparecen en la Pantalla 03 y el Modal de la Pantalla 04 de Figma:
   * - REP-475381: Cicatrización Normal (Día 79 • 05 nov 2026 (7:07))
   * - REP-216547: Cicatrización Hipertrófica (Día 78 • 04 nov 2026 (21:03))
   */
  seedInitialFigmaReports() {
    const report1 = new WoundEvaluationReport({
      folio: 'REP-475381',
      patientId: 'pat-1',
      patientName: 'Nelson Steven Casa',
      postOpDay: 79,
      formattedDate: '05 nov 2026 (7:07)',
      diagnosisTitle: 'Cicatrización Normal',
      statusBadge: 'Evolución Favorable',
      photosCount: 2,
      photoLabels: ['Foto #1', 'Foto #2'],
      medicalPlanHeader: 'ESTADO DE LA HERIDA (DÍA 79):',
      medicalPlanSummary:
        'La cicatrización de su herida quirúrgica evoluciona favorablemente con bordes bien afrontados y sin signos de infección.',
      clinicalSuggestions:
        'Mantener el área seca. Limpieza con solución salina al 0.9% y apósito Tegaderm permeable al vapor. No frotar la costra.',
      recommendedMedications: [
        'Clorhexidina Solución 2% 120ml',
        'Apósito Tegaderm Impermeable 3M',
      ],
      confidenceScore: 0.99,
    });

    const report2 = new WoundEvaluationReport({
      folio: 'REP-216547',
      patientId: 'pat-1',
      patientName: 'Nelson Steven Casa',
      postOpDay: 78,
      formattedDate: '04 nov 2026 (21:03)',
      diagnosisTitle: 'Cicatrización Hipertrófica',
      statusBadge: 'Evolución Favorable',
      photosCount: 2,
      photoLabels: ['Foto #1', 'Foto #2'],
      medicalPlanHeader: 'ESTADO DE LA HERIDA (DÍA 78):',
      medicalPlanSummary:
        'La herida quirúrgica está completamente cerrada con remodelación epitelial activa en los bordes de la incisión.',
      clinicalSuggestions:
        'Continuar limpieza antiséptica suave con Clorhexidina Solución 2% y cubrir con apósito Tegaderm Impermeable 3M evitando tensión mecánica.',
      recommendedMedications: [
        'Clorhexidina Solución 2% 120ml',
        'Apósito Tegaderm Impermeable 3M',
      ],
      confidenceScore: 0.96,
    });

    this.reports.push(report1, report2);
  }

  /**
   * Devuelve todos los reportes asociados a un paciente.
   * @param {string} patientId - ID del paciente.
   * @returns {Promise<Array<WoundEvaluationReport>>}
   */
  async findByPatientId(patientId) {
    return this.reports.filter((r) => r.patientId === patientId);
  }

  /**
   * Busca un reporte por su folio único.
   * @param {string} folio - Código de folio (ej. "REP-475381").
   * @returns {Promise<WoundEvaluationReport|null>}
   */
  async findByFolio(folio) {
    return this.reports.find((r) => r.folio === folio) || null;
  }

  /**
   * Guarda un nuevo reporte al inicio de la lista (más reciente primero).
   * @param {WoundEvaluationReport} report - Entidad WoundEvaluationReport.
   * @returns {Promise<WoundEvaluationReport>}
   */
  async save(report) {
    this.reports.unshift(report);
    return report;
  }
}

module.exports = { InMemoryWoundReportRepository };
