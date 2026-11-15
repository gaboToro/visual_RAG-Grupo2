/**
 * @file InMemoryUserRepository.js
 * @description Adaptador de Infraestructura (Infrastructure Layer - DDD) que implementa IUserRepository
 * con los datos iniciales exactos del prototipo de Figma (Nelson Steven Casa, María Elena Quispe y Dr. Nelson Casa).
 */

const { IUserRepository } = require('../../domain/repositories/IUserRepository');
const { User } = require('../../domain/entities/User');

class InMemoryUserRepository extends IUserRepository {
  /**
   * Inicializa el repositorio en memoria precargando las cuentas demo del prototipo en Figma.
   */
  constructor() {
    super();
    this.users = new Map();
    this.seedInitialFigmaData();
  }

  /**
   * Carga las cuentas iniciales idénticas a las especificadas en las pantallas 01, 07, 08 y 10 de Figma.
   */
  seedInitialFigmaData() {
    const demoPatient1 = new User({
      id: 'pat-1',
      fullName: 'Nelson Steven Casa',
      email: 'nelsoncasa@gmail.com',
      password: 'nelson123',
      role: 'PATIENT',
      assignedDoctorId: 'doc-1',
      clinicalInfo: {
        cedula: '1751361054',
        bloodType: 'O+',
        emergencyContact: 'Carmen Casa (Madre) - 0987654321',
        currentPostOpDay: 79,
      },
    });

    const demoPatient2 = new User({
      id: 'pat-2',
      fullName: 'María Elena Quispe',
      email: 'maria.quispe@outlook.com',
      password: 'maria123',
      role: 'PATIENT',
      assignedDoctorId: 'doc-1',
      clinicalInfo: {
        cedula: '1729482711',
        bloodType: 'A+',
        emergencyContact: 'Carlos Quispe (Esposo) - 0991234567',
        currentPostOpDay: 14,
      },
    });

    const demoDoctor = new User({
      id: 'doc-1',
      fullName: 'Dr. Nelson Casa',
      email: 'nelson.doctor@gmail.com',
      password: 'doctor123',
      role: 'DOCTOR',
      clinicalInfo: {
        medicalLicense: 'MSP-178942',
        specialty: 'Cirugía General y Laparoscópica',
        hospital: 'Hospital Metropolitano',
      },
    });

    this.users.set(demoPatient1.id, demoPatient1);
    this.users.set(demoPatient2.id, demoPatient2);
    this.users.set(demoDoctor.id, demoDoctor);
  }

  /**
   * Busca un usuario por su ID único.
   * @param {string} id - Identificador del usuario.
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    return this.users.get(id) || null;
  }

  /**
   * Busca un usuario por correo electrónico sin importar mayúsculas/minúsculas.
   * @param {string} email - Correo electrónico.
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    if (!email) return null;
    const normalized = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email === normalized) {
        return user;
      }
    }
    return null;
  }

  /**
   * Devuelve todos los usuarios con rol PATIENT que coincidan con el texto de búsqueda
   * (por nombre completo, número de cédula o correo electrónico).
   * @param {string} [searchQuery] - Texto de búsqueda opcional.
   * @returns {Promise<Array<User>>}
   */
  async findPatients(searchQuery = '') {
    const query = searchQuery.toLowerCase().trim();
    const results = [];
    for (const user of this.users.values()) {
      if (user.role === 'PATIENT') {
        if (
          !query ||
          user.fullName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.clinicalInfo.cedula && user.clinicalInfo.cedula.includes(query))
        ) {
          results.push(user);
        }
      }
    }
    return results;
  }

  /**
   * Persiste o actualiza una entidad User en el mapa en memoria.
   * @param {User} user - Entidad User a guardar.
   * @returns {Promise<User>}
   */
  async save(user) {
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Elimina un paciente del repositorio por su ID.
   * @param {string} patientId - ID del paciente.
   * @returns {Promise<boolean>}
   */
  async deletePatient(patientId) {
    return this.users.delete(patientId);
  }
}

module.exports = { InMemoryUserRepository };
