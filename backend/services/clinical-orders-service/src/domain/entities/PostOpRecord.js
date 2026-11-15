const { SurgerySchedule } = require('../value-objects/SurgerySchedule');

class PostOpRecord {

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
