/**
 * @file ClinicalInfo.js
 * @description Objeto de Valor (Value Object - DDD) que encapsula los datos clínicos de un paciente
 * o los datos profesionales de un médico cirujano dentro del contexto delimitado de Identidad.
 */

class ClinicalInfo {
  /**
   * Crea una instancia inmutable de ClinicalInfo.
   * @param {Object} params - Parámetros clínicos o profesionales.
   * @param {string} [params.cedula] - Número de cédula de identidad del paciente.
   * @param {string} [params.bloodType] - Grupo sanguíneo (ej. "O+", "A+").
   * @param {string} [params.emergencyContact] - Contacto de emergencia del paciente.
   * @param {number} [params.currentPostOpDay] - Día actual de recuperación postoperatoria.
   * @param {string} [params.medicalLicense] - Registro médico profesional (ej. "MSP-178942").
   * @param {string} [params.specialty] - Especialidad quirúrgica del médico.
   * @param {string} [params.hospital] - Hospital o clínica donde ejerce el médico.
   */
  constructor({
    cedula = '',
    bloodType = 'O+',
    emergencyContact = '',
    currentPostOpDay = 1,
    medicalLicense = '',
    specialty = '',
    hospital = '',
  } = {}) {
    this.cedula = cedula;
    this.bloodType = bloodType;
    this.emergencyContact = emergencyContact;
    this.currentPostOpDay = currentPostOpDay;
    this.medicalLicense = medicalLicense;
    this.specialty = specialty;
    this.hospital = hospital;
    Object.freeze(this);
  }

  /**
   * Crea una nueva instancia de ClinicalInfo actualizando únicamente los campos indicados
   * (respetando la inmutabilidad propia de los Value Objects en DDD).
   * @param {Partial<ClinicalInfo>} updates - Campos a actualizar.
   * @returns {ClinicalInfo} Nueva instancia inmutable con los valores actualizados.
   */
  withUpdates(updates) {
    return new ClinicalInfo({
      cedula: updates.cedula !== undefined ? updates.cedula : this.cedula,
      bloodType: updates.bloodType !== undefined ? updates.bloodType : this.bloodType,
      emergencyContact:
        updates.emergencyContact !== undefined ? updates.emergencyContact : this.emergencyContact,
      currentPostOpDay:
        updates.currentPostOpDay !== undefined ? updates.currentPostOpDay : this.currentPostOpDay,
      medicalLicense:
        updates.medicalLicense !== undefined ? updates.medicalLicense : this.medicalLicense,
      specialty: updates.specialty !== undefined ? updates.specialty : this.specialty,
      hospital: updates.hospital !== undefined ? updates.hospital : this.hospital,
    });
  }
}

module.exports = { ClinicalInfo };
