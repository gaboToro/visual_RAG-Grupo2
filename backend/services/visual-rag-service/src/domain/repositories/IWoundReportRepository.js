class IWoundReportRepository {

  async findByPatientId(patientId) {
    throw new Error('Método findByPatientId() debe ser implementado por el repositorio concreto.');
  }

  async findByFolio(folio) {
    throw new Error('Método findByFolio() debe ser implementado por el repositorio concreto.');
  }

  async save(report) {
    throw new Error('Método save() debe ser implementado por el repositorio concreto.');
  }
}

module.exports = { IWoundReportRepository };
