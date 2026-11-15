/**
 * @file IdentityUseCases.js
 * @description Capa de Aplicación (Application Layer - DDD) del microservicio de Identidad.
 * Orquesta los casos de uso de autenticación, gestión de perfiles clínicos/profesionales y pacientes.
 */

const { User } = require('../../domain/entities/User');

class IdentityUseCases {
  /**
   * Inicializa los casos de uso inyectando el repositorio de usuarios.
   * @param {import('../../domain/repositories/IUserRepository').IUserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Caso de Uso 1: Autentica a un paciente o médico cirujano según sus credenciales y rol.
   * @param {Object} credentials - Credenciales enviadas desde la pantalla de Login.
   * @param {string} credentials.email - Correo electrónico del usuario.
   * @param {string} credentials.password - Contraseña ingresada.
   * @param {'PATIENT'|'DOCTOR'} credentials.role - Rol elegido en el tab de Login.
   * @returns {Promise<Object>} Datos públicos del usuario autenticado y token simulado.
   */
  async authenticateUser({ email, password, role }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.verifyCredentials(password, role)) {
      const error = new Error('Credenciales inválidas o el rol seleccionado no corresponde a la cuenta.');
      error.statusCode = 401;
      throw error;
    }

    return {
      token: `vrag-jwt-${user.id}-${Date.now()}`,
      user: user.toPublicDTO(),
    };
  }

  /**
   * Caso de Uso 2: Obtiene la lista de pacientes asignados al médico con filtro de búsqueda.
   * @param {string} [searchQuery] - Filtro por nombre, cédula o correo electrónico.
   * @returns {Promise<Array<Object>>} Lista de pacientes en formato DTO público.
   */
  async listDoctorPatients(searchQuery = '') {
    const patients = await this.userRepository.findPatients(searchQuery);
    return patients.map((p) => p.toPublicDTO());
  }

  /**
   * Caso de Uso 3: Registra o asigna un nuevo paciente al listado del médico cirujano.
   * @param {Object} patientData - Datos básicos del nuevo paciente a asignar.
   * @returns {Promise<Object>} Paciente creado o asignado en formato DTO.
   */
  async assignNewPatient({ fullName, email, cedula, bloodType, doctorId = 'doc-1' }) {
    const id = `pat-${Date.now()}`;
    const newPatient = new User({
      id,
      fullName,
      email,
      password: 'paciente123',
      role: 'PATIENT',
      assignedDoctorId: doctorId,
      clinicalInfo: {
        cedula: cedula || '1700000000',
        bloodType: bloodType || 'O+',
        emergencyContact: 'Por registrar',
        currentPostOpDay: 1,
      },
    });

    await this.userRepository.save(newPatient);
    return newPatient.toPublicDTO();
  }

  /**
   * Caso de Uso 4: Actualiza los datos clínicos de un paciente (Pantalla 07 de Figma).
   * @param {string} patientId - ID del paciente.
   * @param {Object} clinicalUpdates - Nombre completo y contacto de emergencia.
   * @returns {Promise<Object>} Perfil actualizado del paciente.
   */
  async updatePatientClinicalProfile(patientId, { fullName, emergencyContact, bloodType }) {
    const user = await this.userRepository.findById(patientId);
    if (!user) {
      const error = new Error('Paciente no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    user.updatePatientClinicalData({ fullName, emergencyContact, bloodType });
    await this.userRepository.save(user);
    return user.toPublicDTO();
  }

  /**
   * Caso de Uso 5: Actualiza los datos profesionales del médico cirujano (Pantalla 10 de Figma).
   * @param {string} doctorId - ID del médico.
   * @param {Object} professionalUpdates - Especialidad y Hospital/Clínica.
   * @returns {Promise<Object>} Perfil actualizado del médico.
   */
  async updateDoctorProfessionalProfile(doctorId, { specialty, hospital }) {
    const doctor = await this.userRepository.findById(doctorId);
    if (!doctor) {
      const error = new Error('Médico no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    doctor.updateDoctorProfessionalData({ specialty, hospital });
    await this.userRepository.save(doctor);
    return doctor.toPublicDTO();
  }

  /**
   * Caso de Uso 6: Desvincula o elimina un paciente de la lista del médico (Pantalla 08 de Figma).
   * @param {string} patientId - ID del paciente a desvincular.
   * @returns {Promise<Object>} Confirmación de eliminación.
   */
  async removePatient(patientId) {
    const deleted = await this.userRepository.deletePatient(patientId);
    return { success: deleted, removedPatientId: patientId };
  }
}

module.exports = { IdentityUseCases };
