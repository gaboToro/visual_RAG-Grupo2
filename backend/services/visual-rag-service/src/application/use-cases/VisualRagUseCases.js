class VisualRagUseCases {

  constructor(reportRepository, ragEvaluatorService) {
    this.reportRepository = reportRepository;
    this.ragEvaluatorService = ragEvaluatorService;
  }

  async evaluatePatientWoundPhotos(evaluationInput) {
    const newReport = this.ragEvaluatorService.evaluateWoundWithRAG(evaluationInput);
    await this.reportRepository.save(newReport);
    return newReport.toDTO();
  }

  async getSavedReportsByPatient(patientId) {
    const reports = await this.reportRepository.findByPatientId(patientId);
    return reports.map((r) => r.toDTO());
  }

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
