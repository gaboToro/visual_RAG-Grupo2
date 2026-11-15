class SurgerySchedule {

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

  getRemainingDays() {
    return Math.max(0, this.totalRestDays - this.currentDay);
  }

  getCompletionPercentage() {
    if (this.totalRestDays <= 0) return 100;
    return Math.min(100, Math.round((this.currentDay / this.totalRestDays) * 100));
  }

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
