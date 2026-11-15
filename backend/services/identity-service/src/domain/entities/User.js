/**
 * @file User.js
 * @description Entidad Raíz de Agregado (Aggregate Root - DDD) que representa a un usuario
 * del sistema Visual RAG (puede ser 'PATIENT' o 'DOCTOR').
 */

const { ClinicalInfo } = require('../value-objects/ClinicalInfo');

class User {
  /**
   * Inicializa la entidad de dominio User validando sus invariantes de negocio.
   * @param {Object} params - Datos de la entidad Usuario.
   * @param {string} params.id - Identificador único del usuario.
   * @param {string} params.fullName - Nombre completo del paciente o médico.
   * @param {string} params.email - Correo electrónico único de acceso.
   * @param {string} params.password - Contraseña de acceso al portal.
   * @param {'PATIENT'|'DOCTOR'} params.role - Rol dentro de la plataforma Visual RAG.
   * @param {string|null} [params.assignedDoctorId] - ID del médico asignado (solo para pacientes).
   * @param {ClinicalInfo|Object} [params.clinicalInfo] - Objeto de valor con información clínica/profesional.
   */
  constructor({
    id,
    fullName,
    email,
    password,
    role,
    assignedDoctorId = null,
    clinicalInfo = {},
  }) {
    if (!id || !fullName || !email || !role) {
      throw new Error('Invariante de dominio violada: id, fullName, email y role son obligatorios.');
    }

    this.id = id;
    this.fullName = fullName;
    this.email = email.toLowerCase().trim();
    this.password = password;
    this.role = role;
    this.assignedDoctorId = assignedDoctorId;
    this.clinicalInfo =
      clinicalInfo instanceof ClinicalInfo ? clinicalInfo : new ClinicalInfo(clinicalInfo);
  }

  /**
   * Verifica si las credenciales proporcionadas coinciden con las del usuario y su rol.
   * @param {string} plainPassword - Contraseña ingresada en el login.
   * @param {'PATIENT'|'DOCTOR'} expectedRole - Rol seleccionado en el selector de Login.
   * @returns {boolean} True si la autenticación es válida, False en caso contrario.
   */
  verifyCredentials(plainPassword, expectedRole) {
    const passwordMatches = this.password === plainPassword;
    const roleMatches = !expectedRole || this.role === expectedRole;
    return passwordMatches && roleMatches;
  }

  /**
   * Actualiza los datos clínicos del paciente garantizando las reglas del dominio.
   * @param {Object} params - Nuevos datos clínicos enviados desde el Perfil Clínico.
   * @param {string} [params.fullName] - Nuevo nombre completo del paciente.
   * @param {string} [params.emergencyContact] - Nuevo contacto de emergencia.
   * @param {string} [params.bloodType] - Grupo sanguíneo actualizado.
   */
  updatePatientClinicalData({ fullName, emergencyContact, bloodType }) {
    if (this.role !== 'PATIENT') {
      throw new Error('Solo un usuario con rol PATIENT puede actualizar datos clínicos de paciente.');
    }
    if (fullName && fullName.trim().length > 0) {
      this.fullName = fullName.trim();
    }
    this.clinicalInfo = this.clinicalInfo.withUpdates({
      emergencyContact,
      bloodType,
    });
  }

  /**
   * Actualiza los datos profesionales del médico cirujano (Especialidad y Hospital/Clínica).
   * @param {Object} params - Nuevos datos profesionales enviados desde el Perfil Profesional.
   * @param {string} [params.specialty] - Especialidad médica (ej. "Cirugía General y Laparoscópica").
   * @param {string} [params.hospital] - Hospital o clínica (ej. "Hospital Metropolitano").
   */
  updateDoctorProfessionalData({ specialty, hospital }) {
    if (this.role !== 'DOCTOR') {
      throw new Error('Solo un usuario con rol DOCTOR puede actualizar datos profesionales.');
    }
    this.clinicalInfo = this.clinicalInfo.withUpdates({
      specialty,
      hospital,
    });
  }

  /**
   * Asigna o desasigna este paciente a un médico cirujano.
   * @param {string|null} doctorId - Identificador del médico o null para desasignar.
   */
  assignToDoctor(doctorId) {
    if (this.role !== 'PATIENT') {
      throw new Error('Únicamente los pacientes pueden ser asignados a un médico.');
    }
    this.assignedDoctorId = doctorId;
  }

  /**
   * Serializa la entidad a un objeto plano seguro (sin exponer la contraseña).
   * @returns {Object} Representación pública del usuario para respuestas HTTP.
   */
  toPublicDTO() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      role: this.role,
      assignedDoctorId: this.assignedDoctorId,
      clinicalInfo: { ...this.clinicalInfo },
    };
  }
}

module.exports = { User };
