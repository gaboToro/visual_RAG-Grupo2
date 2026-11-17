const { User } = require('../../domain/entities/User');

class IdentityUseCases {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async authenticateUser({ email, password, role } = {}) {
    if (!email || !password) {
      const error = new Error('El correo electrónico y la contraseña son obligatorios.');
      error.statusCode = 400;
      throw error;
    }

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

  async listDoctorPatients(searchQuery = '') {
    const patients = await this.userRepository.findPatients(searchQuery);
    return patients.map((p) => p.toPublicDTO());
  }

  async assignNewPatient({ fullName, email, cedula, bloodType, emergencyContact, doctorId = 'doc-1' } = {}) {
    if (!fullName || !email) {
      const error = new Error('El nombre completo y el correo electrónico del paciente son obligatorios.');
      error.statusCode = 400;
      throw error;
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      const error = new Error('Ya existe un usuario registrado con ese correo electrónico.');
      error.statusCode = 409;
      throw error;
    }

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
        emergencyContact: emergencyContact || 'Por registrar',
        currentPostOpDay: 1,
      },
    });

    await this.userRepository.save(newPatient);
    return newPatient.toPublicDTO();
  }

  async updatePatientClinicalProfile(
    patientId,
    { fullName, emergencyContact, bloodType, currentPostOpDay } = {}
  ) {
    const user = await this.userRepository.findById(patientId);
    if (!user) {
      const error = new Error('Paciente no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    user.updatePatientClinicalData({ fullName, emergencyContact, bloodType, currentPostOpDay });
    await this.userRepository.save(user);
    return user.toPublicDTO();
  }

  async updateDoctorProfessionalProfile(
    doctorId,
    { fullName, specialty, hospital, medicalLicense } = {}
  ) {
    const doctor = await this.userRepository.findById(doctorId);
    if (!doctor) {
      const error = new Error('Médico no encontrado.');
      error.statusCode = 404;
      throw error;
    }

    doctor.updateDoctorProfessionalData({ fullName, specialty, hospital, medicalLicense });
    await this.userRepository.save(doctor);
    return doctor.toPublicDTO();
  }

  async removePatient(patientId) {
    const existing = await this.userRepository.findById(patientId);
    if (!existing || existing.role !== 'PATIENT') {
      const error = new Error('Paciente no encontrado para desvincular.');
      error.statusCode = 404;
      throw error;
    }
    const deleted = await this.userRepository.deletePatient(patientId);
    return { success: deleted, removedPatientId: patientId };
  }
}

module.exports = { IdentityUseCases };
