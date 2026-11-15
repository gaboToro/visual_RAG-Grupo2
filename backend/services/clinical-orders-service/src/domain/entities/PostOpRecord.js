/**
 * @file PostOpRecord.js
 * @description Entidad Raíz de Agregado (Aggregate Root - DDD) que representa la Ficha Postoperatoria
 * y las Órdenes Médicas subidas por el Médico Cirujano para un paciente específico.
 */

const { SurgerySchedule } = require('../value-objects/SurgerySchedule');

class PostOpRecord {
  /**
   * Crea una instancia de la Ficha Postoperatoria validando sus reglas de dominio.
   * @param {Object} params - Datos de la ficha postoperatoria.
   * @param {string} params.id - Identificador único de la ficha.
   * @param {string} params.patientId - ID del paciente titular de la ficha.
   * @param {string} params.patientName - Nombre del paciente titular.
   * @param {string} params.doctorId - ID del médico cirujano que prescribe.
   * @param {SurgerySchedule|Object} params.schedule - Cronograma quirúrgico.
   * @param {Array<string>} [params.prohibitedActions] - Lista de acciones prohibidas (Sección 2).
   * @param {Array<string>} [params.allowedCares] - Lista de cuidados y curaciones permitidas (Sección 3).
   * @param {Array<string>} [params.allergiesAndAlerts] - Signos de alerta y alergias (Sección 4).
   * @param {Array<string>} [params.prescribedMedications] - Insumos/medicamentos del tratamiento subido por el doctor.
   */
  constructor({
    id,
    patientId,
    patientName,
    doctorId,
    schedule,
    prohibitedActions = [],
    allowedCares = [],
    allergiesAndAlerts = [],
    prescribedMedications = [],
  }) {
    if (!id || !patientId) {
      throw new Error('Invariante de dominio violada: id y patientId son obligatorios en PostOpRecord.');
    }

    this.id = id;
    this.patientId = patientId;
    this.patientName = patientName || 'Paciente';
    this.doctorId = doctorId || 'doc-1';
    this.schedule =
      schedule instanceof SurgerySchedule ? schedule : new SurgerySchedule(schedule);
    this.prohibitedActions = Array.isArray(prohibitedActions) ? [...prohibitedActions] : [];
    this.allowedCares = Array.isArray(allowedCares) ? [...allowedCares] : [];
    this.allergiesAndAlerts = Array.isArray(allergiesAndAlerts) ? [...allergiesAndAlerts] : [];
    this.prescribedMedications = Array.isArray(prescribedMedications)
      ? [...prescribedMedications]
      : [];
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Actualiza de forma integral la Ficha Postoperatoria desde el Portal Médico (Pantalla 09 de Figma).
   * @param {Object} updates - Datos enviados por el médico cirujano.
   */
  updateRecord({
    procedureName,
    surgeryDate,
    totalRestDays,
    currentDay,
    prohibitedActions,
    allowedCares,
    allergiesAndAlerts,
    prescribedMedications,
  }) {
    this.schedule = new SurgerySchedule({
      procedureName: procedureName || this.schedule.procedureName,
      surgeryDate: surgeryDate || this.schedule.surgeryDate,
      totalRestDays:
        totalRestDays !== undefined ? totalRestDays : this.schedule.totalRestDays,
      currentDay: currentDay !== undefined ? currentDay : this.schedule.currentDay,
    });

    if (Array.isArray(prohibitedActions)) {
      this.prohibitedActions = prohibitedActions.filter((item) => Boolean(item && item.trim()));
    }
    if (Array.isArray(allowedCares)) {
      this.allowedCares = allowedCares.filter((item) => Boolean(item && item.trim()));
    }
    if (Array.isArray(allergiesAndAlerts)) {
      this.allergiesAndAlerts = allergiesAndAlerts.filter((item) => Boolean(item && item.trim()));
    }
    if (Array.isArray(prescribedMedications)) {
      this.prescribedMedications = prescribedMedications.filter((item) =>
        Boolean(item && item.trim())
      );
    }

    this.updatedAt = new Date().toISOString();
  }

  /**
   * Convierte la entidad de dominio a un DTO listo para ser consumido por la App Móvil y otros microservicios.
   * @returns {Object} Representación serializable de la Ficha Postoperatoria.
   */
  toDTO() {
    return {
      id: this.id,
      patientId: this.patientId,
      patientName: this.patientName,
      doctorId: this.doctorId,
      schedule: this.schedule.toSummaryDTO(),
      prohibitedActions: this.prohibitedActions,
      allowedCares: this.allowedCares,
      allergiesAndAlerts: this.allergiesAndAlerts,
      prescribedMedications: this.prescribedMedications,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = { PostOpRecord };
