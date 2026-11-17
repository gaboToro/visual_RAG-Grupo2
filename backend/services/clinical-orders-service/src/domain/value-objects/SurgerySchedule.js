class SurgerySchedule {

  constructor({ procedureName, surgeryDate, totalRestDays = 10, currentDay = 79 }) {
    if (!procedureName || !surgeryDate) {
      throw new Error('El nombre del procedimiento quirúrgico y la fecha son obligatorios.');
    }
    this.procedureName = String(procedureName).trim();
    this.surgeryDate = String(surgeryDate).trim();
    this.totalRestDays = Math.max(1, Number(totalRestDays) || 10);
    this.currentDay = Math.max(1, Number(currentDay) || 1);
    Object.freeze(this);
  }

  static calculateElapsedDays(surgeryDate, fallbackDay = 1) {
    if (!surgeryDate || !/^\d{4}-\d{2}-\d{2}$/.test(String(surgeryDate).trim())) {
      return Math.max(1, Number(fallbackDay) || 1);
    }
    const parsed = new Date(`${String(surgeryDate).trim()}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      return Math.max(1, Number(fallbackDay) || 1);
    }
    const now = new Date();
    const diffMs = now.getTime() - parsed.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= 1 ? diffDays : Math.max(1, Number(fallbackDay) || 1);
  }

  getRemainingDays() {
    return Math.max(0, this.totalRestDays - this.currentDay);
  }

  getCompletionPercentage() {
    if (this.totalRestDays <= 0) return 100;
    return Math.min(100, Math.round((this.currentDay / this.totalRestDays) * 100));
  }

  isRestPeriodCompleted() {
    return this.currentDay >= this.totalRestDays;
  }

  toSummaryDTO() {
    return {
      procedureName: this.procedureName,
      surgeryDate: this.surgeryDate,
      totalRestDays: this.totalRestDays,
      currentDay: this.currentDay,
      remainingDays: this.getRemainingDays(),
      completionPercentage: this.getCompletionPercentage(),
      isCompleted: this.isRestPeriodCompleted(),
    };
  }
}

module.exports = { SurgerySchedule };
