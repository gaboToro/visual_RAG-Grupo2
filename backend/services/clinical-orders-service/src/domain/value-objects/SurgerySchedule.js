/**
 * @file SurgerySchedule.js
 * @description Objeto de Valor (Value Object - DDD) que modela el cronograma quirúrgico
 * y calcula automáticamente el porcentaje de avance y días restantes de reposo.
 */

class SurgerySchedule {
  /**
   * Construye el objeto de valor SurgerySchedule.
   * @param {Object} params - Parámetros de la cirugía y cronograma de reposo.
   * @param {string} params.procedureName - Nombre del procedimiento quirúrgico (ej. "Correcion Neuronal").
   * @param {string} params.surgeryDate - Fecha de inicio de cirugía en formato YYYY-MM-DD (ej. "2026-08-19").
   * @param {number} params.totalRestDays - Total de días de reposo prescritos por el cirujano (ej. 10).
   * @param {number} params.currentDay - Día postoperatorio actual (ej. 79).
   */
  constructor({ procedureName, surgeryDate, totalRestDays = 10, currentDay = 79 }) {
    if (!procedureName || !surgeryDate) {
      throw new Error('El nombre del procedimiento quirúrgico y la fecha son obligatorios.');
    }
    this.procedureName = procedureName;
    this.surgeryDate = surgeryDate;
    this.totalRestDays = Number(totalRestDays) || 10;
    this.currentDay = Number(currentDay) || 1;
    Object.freeze(this);
  }

  /**
   * Calcula los días restantes de reposo (nunca menor a 0).
   * @returns {number} Días restantes de reposo.
   */
  getRemainingDays() {
    return Math.max(0, this.totalRestDays - this.currentDay);
  }

  /**
   * Calcula el porcentaje de cumplimiento del reposo postoperatorio (0 a 100%).
   * @returns {number} Porcentaje entero entre 0 y 100.
   */
  getCompletionPercentage() {
    if (this.totalRestDays <= 0) return 100;
    return Math.min(100, Math.round((this.currentDay / this.totalRestDays) * 100));
  }

  /**
   * Devuelve un resumen estructurado del cronograma quirúrgico para la interfaz móvil.
   * @returns {Object} Datos calculados del cronograma.
   */
  toSummaryDTO() {
    return {
      procedureName: this.procedureName,
      surgeryDate: this.surgeryDate,
      totalRestDays: this.totalRestDays,
      currentDay: this.currentDay,
      remainingDays: this.getRemainingDays(),
      completionPercentage: this.getCompletionPercentage(),
    };
  }
}

module.exports = { SurgerySchedule };
