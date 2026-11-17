const { ClinicalInfo } = require('../value-objects/ClinicalInfo');

class User {

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
    if (!['PATIENT', 'DOCTOR'].includes(role)) {
      throw new Error('Invariante de dominio violada: el rol debe ser PATIENT o DOCTOR.');
    }

    this.id = id;
    this.fullName = String(fullName).trim();
    this.email = String(email).toLowerCase().trim();
    this.password = password;
    this.role = role;
    this.assignedDoctorId = assignedDoctorId;
    this.clinicalInfo =
      clinicalInfo instanceof ClinicalInfo ? clinicalInfo : new ClinicalInfo(clinicalInfo);
  }

  verifyCredentials(plainPassword, expectedRole) {
    const passwordMatches = Boolean(plainPassword) && this.password === plainPassword;
    const roleMatches = !expectedRole || this.role === expectedRole;
    return passwordMatches && roleMatches;
  }

  updatePatientClinicalData({ fullName, emergencyContact, bloodType, currentPostOpDay }) {
    if (this.role !== 'PATIENT') {
      throw new Error('Solo un usuario con rol PATIENT puede actualizar datos clínicos de paciente.');
    }
    if (fullName && fullName.trim().length > 0) {
      this.fullName = fullName.trim();
    }
    this.clinicalInfo = this.clinicalInfo.withUpdates({
      emergencyContact,
      bloodType,
      currentPostOpDay,
    });
  }

  updateDoctorProfessionalData({ fullName, specialty, hospital, medicalLicense }) {
    if (this.role !== 'DOCTOR') {
      throw new Error('Solo un usuario con rol DOCTOR puede actualizar datos profesionales.');
    }
    if (fullName && fullName.trim().length > 0) {
      this.fullName = fullName.trim();
    }
    this.clinicalInfo = this.clinicalInfo.withUpdates({
      specialty,
      hospital,
      medicalLicense,
    });
  }

  assignToDoctor(doctorId) {
    if (this.role !== 'PATIENT') {
      throw new Error('Únicamente los pacientes pueden ser asignados a un médico.');
    }
    this.assignedDoctorId = doctorId;
  }

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
