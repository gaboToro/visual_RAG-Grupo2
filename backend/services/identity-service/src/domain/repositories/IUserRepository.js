class IUserRepository {

  async findById(id) {
    throw new Error('Método findById() debe ser implementado por el repositorio concreto.');
  }

  async findByEmail(email) {
    throw new Error('Método findByEmail() debe ser implementado por el repositorio concreto.');
  }

  async findPatients(searchQuery = '') {
    throw new Error('Método findPatients() debe ser implementado por el repositorio concreto.');
  }

  async save(user) {
    throw new Error('Método save() debe ser implementado por el repositorio concreto.');
  }

  async deletePatient(patientId) {
    throw new Error('Método deletePatient() debe ser implementado por el repositorio concreto.');
  }
}

module.exports = { IUserRepository };
