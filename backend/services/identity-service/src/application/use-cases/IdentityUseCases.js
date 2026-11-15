const { User } = require('../../domain/entities/User');

class IdentityUseCases {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

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

  async listDoctorPatients(searchQuery = '') {
    const patients = await this.userRepository.findPatients(searchQuery);
    return patients.map((p) => p.toPublicDTO());
  }

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

  async removePatient(patientId) {
    const deleted = await this.userRepository.deletePatient(patientId);
    return { success: deleted, removedPatientId: patientId };
  }
}

module.exports = { IdentityUseCases };
