class IMedicationRepository {

  async findAll() {
    throw new Error('Método findAll() debe ser implementado por el repositorio concreto.');
  }

  async findById(_id) {
    throw new Error('Método findById() debe ser implementado por el repositorio concreto.');
  }

  async upsert(_product) {
    throw new Error('Método upsert() debe ser implementado por el repositorio concreto.');
  }

  async upsertMany(_products) {
    throw new Error('Método upsertMany() debe ser implementado por el repositorio concreto.');
  }
}

module.exports = { IMedicationRepository };
