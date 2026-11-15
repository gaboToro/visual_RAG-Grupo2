/**
 * @file IUserRepository.js
 * @description Puerto / Interfaz de Repositorio de Dominio (DDD) que define el contrato
 * para la persistencia y consulta de usuarios (Pacientes y Médicos).
 */

class IUserRepository {
  /**
   * Busca un usuario por su identificador único.
   * @param {string} id - ID del usuario.
   * @returns {Promise<import('../entities/User').User|null>}
   */
  async findById(id) {
    throw new Error('Método findById() debe ser implementado por el repositorio concreto.');
  }

  /**
   * Busca un usuario por su dirección de correo electrónico.
   * @param {string} email - Correo electrónico.
   * @returns {Promise<import('../entities/User').User|null>}
   */
  async findByEmail(email) {
    throw new Error('Método findByEmail() debe ser implementado por el repositorio concreto.');
  }

  /**
   * Obtiene todos los pacientes registrados o filtrados por búsqueda.
   * @param {string} [searchQuery] - Término opcional para filtrar por nombre, cédula o correo.
   * @returns {Promise<Array<import('../entities/User').User>>}
   */
  async findPatients(searchQuery = '') {
    throw new Error('Método findPatients() debe ser implementado por el repositorio concreto.');
  }

  /**
   * Guarda o actualiza una entidad User en el almacenamiento persistente.
   * @param {import('../entities/User').User} user - Entidad User a persistir.
   * @returns {Promise<import('../entities/User').User>}
   */
  async save(user) {
    throw new Error('Método save() debe ser implementado por el repositorio concreto.');
  }

  /**
   * Elimina o desvincula un paciente por su ID.
   * @param {string} patientId - ID del paciente.
   * @returns {Promise<boolean>}
   */
  async deletePatient(patientId) {
    throw new Error('Método deletePatient() debe ser implementado por el repositorio concreto.');
  }
}

module.exports = { IUserRepository };
