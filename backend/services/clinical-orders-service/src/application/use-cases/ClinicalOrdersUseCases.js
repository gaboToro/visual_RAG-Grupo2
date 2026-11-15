/**
 * @file ClinicalOrdersUseCases.js
 * @description Capa de Aplicación (Application Layer - DDD) para la gestión de Fichas Postoperatorias
 * y Órdenes de Recuperación prescritas por el Médico Cirujano.
 */

const { PostOpRecord } = require('../../domain/entities/PostOpRecord');

class ClinicalOrdersUseCases {
  /**
   * Inicializa los casos de uso inyectando el repositorio de fichas postoperatorias.
   * @param {import('../../domain/repositories/IPostOpRecordRepository').IPostOpRecordRepository} recordRepository
   */
  constructor(recordRepository) {
    this.recordRepository = recordRepository;
  }

  /**
   * Caso de Uso 1: Obtiene las órdenes médicas y cronograma postoperatorio de un paciente
   * (usado en las Pantallas 02, 06 y 09 de Figma).
   * @param {string} patientId - Identificador del paciente.
   * @returns {Promise<Object>} DTO de la Ficha Postoperatoria.
   */
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

  /**
   * Caso de Uso 2: Guarda o actualiza la Ficha Postoperatoria de un paciente desde el Portal Médico
   * (Pantalla 09: "Guardar Ficha Postoperatoria").
   * @param {string} patientId - Identificador del paciente.
   * @param {Object} payload - Datos del procedimiento, cronograma, prohibiciones, cuidados y medicamentos.
   * @returns {Promise<Object>} DTO de la Ficha Postoperatoria actualizada.
   */
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
}

module.exports = { ClinicalOrdersUseCases };
