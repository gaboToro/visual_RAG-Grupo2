const VALID_BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

class ClinicalInfo {

  constructor({
    cedula = '',
    bloodType = 'O+',
    emergencyContact = '',
    currentPostOpDay = 1,
    medicalLicense = '',
    specialty = '',
    hospital = '',
  } = {}) {
    const normalizedBlood = String(bloodType || 'O+').toUpperCase().trim();
    this.cedula = String(cedula || '').trim();
    this.bloodType = VALID_BLOOD_TYPES.includes(normalizedBlood) ? normalizedBlood : 'O+';
    this.emergencyContact = String(emergencyContact || '').trim();
    this.currentPostOpDay = Math.max(1, Number(currentPostOpDay) || 1);
    this.medicalLicense = String(medicalLicense || '').trim();
    this.specialty = String(specialty || '').trim();
    this.hospital = String(hospital || '').trim();
    Object.freeze(this);
  }

  hasValidEcuadorianCedula() {
    return /^\d{10}$/.test(this.cedula);
  }

  withUpdates(updates = {}) {
    return new ClinicalInfo({
      cedula: updates.cedula !== undefined ? updates.cedula : this.cedula,
      bloodType: updates.bloodType !== undefined ? updates.bloodType : this.bloodType,
      emergencyContact:
        updates.emergencyContact !== undefined ? updates.emergencyContact : this.emergencyContact,
      currentPostOpDay:
        updates.currentPostOpDay !== undefined ? updates.currentPostOpDay : this.currentPostOpDay,
      medicalLicense:
        updates.medicalLicense !== undefined ? updates.medicalLicense : this.medicalLicense,
      specialty: updates.specialty !== undefined ? updates.specialty : this.specialty,
      hospital: updates.hospital !== undefined ? updates.hospital : this.hospital,
    });
  }
}

module.exports = { ClinicalInfo, VALID_BLOOD_TYPES };
