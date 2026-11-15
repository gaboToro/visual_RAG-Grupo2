const { IUserRepository } = require('../../domain/repositories/IUserRepository');
const { User } = require('../../domain/entities/User');

class InMemoryUserRepository extends IUserRepository {

  constructor() {
    super();
    this.users = new Map();
    this.seedInitialFigmaData();
  }

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

  async findById(id) {
    return this.users.get(id) || null;
  }

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

  async save(user) {
    this.users.set(user.id, user);
    return user;
  }

  async deletePatient(patientId) {
    return this.users.delete(patientId);
  }
}

module.exports = { InMemoryUserRepository };
