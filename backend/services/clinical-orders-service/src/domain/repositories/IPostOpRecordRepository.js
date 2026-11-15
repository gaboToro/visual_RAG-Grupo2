class IPostOpRecordRepository {

  async findByPatientId(patientId) {
    throw new Error('Método findByPatientId() debe ser implementado por el repositorio concreto.');
  }

  async save(record) {
    throw new Error('Método save() debe ser implementado por el repositorio concreto.');
  }
}

module.exports = { IPostOpRecordRepository };
