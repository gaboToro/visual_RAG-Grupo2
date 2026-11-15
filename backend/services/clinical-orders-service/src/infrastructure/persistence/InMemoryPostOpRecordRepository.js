/**
 * @file InMemoryPostOpRecordRepository.js
 * @description Adaptador de Infraestructura (Infrastructure Layer - DDD) que almacena en memoria
 * las Fichas Postoperatorias precargadas con los datos exactos del prototipo de Figma.
 */

const { IPostOpRecordRepository } = require('../../domain/repositories/IPostOpRecordRepository');
const { PostOpRecord } = require('../../domain/entities/PostOpRecord');

class InMemoryPostOpRecordRepository extends IPostOpRecordRepository {
  /**
   * Inicializa el repositorio con las fichas postoperatorias de los pacientes demo.
   */
  constructor() {
    super();
    this.recordsByPatient = new Map();
    this.seedInitialFigmaRecords();
  }

  /**
   * Precarga la Ficha Postoperatoria de Nelson Steven Casa y María Elena Quispe tal como aparecen
   * en las Pantallas 02, 06 y 09 de Figma.
   */
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

  /**
   * Busca la ficha postoperatoria por el ID del paciente.
   * @param {string} patientId - ID del paciente.
   * @returns {Promise<PostOpRecord|null>}
   */
  async findByPatientId(patientId) {
    return this.recordsByPatient.get(patientId) || null;
  }

  /**
   * Guarda o actualiza la ficha postoperatoria en memoria.
   * @param {PostOpRecord} record - Entidad PostOpRecord a guardar.
   * @returns {Promise<PostOpRecord>}
   */
  async save(record) {
    this.recordsByPatient.set(record.patientId, record);
    return record;
  }
}

module.exports = { InMemoryPostOpRecordRepository };
