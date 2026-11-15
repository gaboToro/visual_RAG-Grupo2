class IMedicationRepository {

  async findAll() {
    throw new Error('Método findAll() debe ser implementado por el repositorio concreto.');
  }

  async findById(id) {
    throw new Error('Método findById() debe ser implementado por el repositorio concreto.');
  }
}

module.exports = { IMedicationRepository };
