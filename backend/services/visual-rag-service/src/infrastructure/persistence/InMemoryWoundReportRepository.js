const { IWoundReportRepository } = require('../../domain/repositories/IWoundReportRepository');
const { WoundEvaluationReport } = require('../../domain/entities/WoundEvaluationReport');

class InMemoryWoundReportRepository extends IWoundReportRepository {

  constructor() {
    super();
    this.reports = [];
    this.seedInitialFigmaReports();
  }

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

  async findByPatientId(patientId) {
    return this.reports.filter((r) => r.patientId === patientId);
  }

  async findByFolio(folio) {
    return this.reports.find((r) => r.folio === folio) || null;
  }

  async save(report) {
    this.reports.unshift(report);
    return report;
  }
}

module.exports = { InMemoryWoundReportRepository };
