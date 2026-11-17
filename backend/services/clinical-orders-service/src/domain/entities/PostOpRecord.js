const { SurgerySchedule } = require('../value-objects/SurgerySchedule');

function sanitizeUniqueList(items) {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  const result = [];
  for (const raw of items) {
    const cleaned = String(raw || '').trim();
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(cleaned);
    }
  }
  return result;
}

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
    this.patientName = String(patientName || 'Paciente').trim();
    this.doctorId = doctorId || 'doc-1';
    this.schedule =
      schedule instanceof SurgerySchedule ? schedule : new SurgerySchedule(schedule);
    this.prohibitedActions = sanitizeUniqueList(prohibitedActions);
    this.allowedCares = sanitizeUniqueList(allowedCares);
    this.allergiesAndAlerts = sanitizeUniqueList(allergiesAndAlerts);
    this.prescribedMedications = sanitizeUniqueList(prescribedMedications);
    this.updatedAt = new Date().toISOString();
  }

  updateRecord({
    patientName,
    procedureName,
    surgeryDate,
    totalRestDays,
    currentDay,
    prohibitedActions,
    allowedCares,
    allergiesAndAlerts,
    prescribedMedications,
  } = {}) {
    if (patientName && String(patientName).trim().length > 0) {
      this.patientName = String(patientName).trim();
    }

    const nextSurgeryDate = surgeryDate || this.schedule.surgeryDate;
    const resolvedCurrentDay =
      currentDay !== undefined
        ? currentDay
        : surgeryDate && surgeryDate !== this.schedule.surgeryDate
          ? SurgerySchedule.calculateElapsedDays(surgeryDate, this.schedule.currentDay)
          : this.schedule.currentDay;

    this.schedule = new SurgerySchedule({
      procedureName: procedureName || this.schedule.procedureName,
      surgeryDate: nextSurgeryDate,
      totalRestDays:
        totalRestDays !== undefined ? totalRestDays : this.schedule.totalRestDays,
      currentDay: resolvedCurrentDay,
    });

    if (Array.isArray(prohibitedActions)) {
      this.prohibitedActions = sanitizeUniqueList(prohibitedActions);
    }
    if (Array.isArray(allowedCares)) {
      this.allowedCares = sanitizeUniqueList(allowedCares);
    }
    if (Array.isArray(allergiesAndAlerts)) {
      this.allergiesAndAlerts = sanitizeUniqueList(allergiesAndAlerts);
    }
    if (Array.isArray(prescribedMedications)) {
      this.prescribedMedications = sanitizeUniqueList(prescribedMedications);
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
