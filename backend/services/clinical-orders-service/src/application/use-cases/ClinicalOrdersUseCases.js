const { PostOpRecord } = require('../../domain/entities/PostOpRecord');

class ClinicalOrdersUseCases {

  constructor(recordRepository) {
    this.recordRepository = recordRepository;
  }

  async getPatientPostOpRecord(patientId) {
    let record = await this.recordRepository.findByPatientId(patientId);
    if (!record) {
      record = new PostOpRecord({
        id: `rec-${patientId}`,
        patientId,
        patientName: 'Paciente Registrado',
        doctorId: 'doc-1',
        schedule: {
          procedureName: 'Correcion Neuronal',
          surgeryDate: '2026-08-19',
          totalRestDays: 10,
          currentDay: 1,
        },
        prohibitedActions: [
          'Prohibido levantar objetos pesados (+3kg), masajear el área o realizar esfuerzos intensos.',
        ],
        allowedCares: ['Mantener en reposo'],
        allergiesAndAlerts: ['Fiebre mayor a 38°C o sangrado activo en la incisión'],
        prescribedMedications: [
          'Clorhexidina Solución 2% 120ml',
          'Apósito Tegaderm Impermeable 3M',
        ],
      });
      await this.recordRepository.save(record);
    }

    return record.toDTO();
  }

  async savePatientPostOpRecord(patientId, payload) {
    let record = await this.recordRepository.findByPatientId(patientId);
    if (!record) {
      record = new PostOpRecord({
        id: `rec-${patientId}`,
        patientId,
        patientName: payload.patientName || 'Paciente',
        doctorId: payload.doctorId || 'doc-1',
        schedule: {
          procedureName: payload.procedureName || 'Correcion Neuronal',
          surgeryDate: payload.surgeryDate || '2026-08-19',
          totalRestDays: payload.totalRestDays || 10,
          currentDay: payload.currentDay || 79,
        },
      });
    }

    record.updateRecord(payload);
    await this.recordRepository.save(record);
    return record.toDTO();
  }

  async listAllPostOpRecords() {
    const records = await this.recordRepository.findAll();
    return records.map((r) => r.toDTO());
  }

  async deletePatientPostOpRecord(patientId) {
    const deleted = await this.recordRepository.deleteByPatientId(patientId);
    return { success: deleted, patientId };
  }
}

module.exports = { ClinicalOrdersUseCases };
