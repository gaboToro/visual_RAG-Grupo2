const { IPostOpRecordRepository } = require('../../domain/repositories/IPostOpRecordRepository');
const { PostOpRecord } = require('../../domain/entities/PostOpRecord');

class InMemoryPostOpRecordRepository extends IPostOpRecordRepository {

  constructor() {
    super();
    this.recordsByPatient = new Map();
    this.seedInitialFigmaRecords();
  }

  seedInitialFigmaRecords() {
    const nelsonRecord = new PostOpRecord({
      id: 'rec-pat-1',
      patientId: 'pat-1',
      patientName: 'Nelson Steven Casa',
      doctorId: 'doc-1',
      schedule: {
        procedureName: 'Correcion Neuronal',
        surgeryDate: '2026-08-19',
        totalRestDays: 10,
        currentDay: 79,
      },
      prohibitedActions: [
        'Prohibido levantar objetos pesados (+3kg), masajear el área o realizar esfuerzos intensos.',
        'Prohibido comer carnes de chancho',
      ],
      allowedCares: ['Mantener en reposo'],
      allergiesAndAlerts: [
        'Alergia a Penicilina • Acudir a urgencias si presenta fiebre > 38°C o secreción purulenta.',
      ],
      prescribedMedications: [
        'Clorhexidina Solución 2% 120ml',
        'Apósito Tegaderm Impermeable 3M',
      ],
    });

    const mariaRecord = new PostOpRecord({
      id: 'rec-pat-2',
      patientId: 'pat-2',
      patientName: 'María Elena Quispe',
      doctorId: 'doc-1',
      schedule: {
        procedureName: 'Colecistectomía Laparoscópica',
        surgeryDate: '2026-10-31',
        totalRestDays: 15,
        currentDay: 14,
      },
      prohibitedActions: [
        'Prohibido realizar esfuerzos abdominales o levantar peso.',
        'Prohibido ingerir alimentos grasos o lácteos enteros.',
      ],
      allowedCares: [
        'Caminatas cortas asistidas de 10 minutos cada 4 horas.',
        'Curación diaria con antiséptico tópico.',
      ],
      allergiesAndAlerts: ['Sin alergias conocidas • Vigilar coloración amarillenta o dolor agudo.'],
      prescribedMedications: [
        'Clorhexidina Solución 2% 120ml',
        'Apósito Tegaderm Impermeable 3M',
      ],
    });

    this.recordsByPatient.set('pat-1', nelsonRecord);
    this.recordsByPatient.set('pat-2', mariaRecord);
  }

  async findByPatientId(patientId) {
    return this.recordsByPatient.get(patientId) || null;
  }

  async findAll() {
    return Array.from(this.recordsByPatient.values());
  }

  async save(record) {
    this.recordsByPatient.set(record.patientId, record);
    return record;
  }

  async deleteByPatientId(patientId) {
    return this.recordsByPatient.delete(patientId);
  }
}

module.exports = { InMemoryPostOpRecordRepository };
