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
    this.cedula = cedula;
    this.bloodType = bloodType;
    this.emergencyContact = emergencyContact;
    this.currentPostOpDay = currentPostOpDay;
    this.medicalLicense = medicalLicense;
    this.specialty = specialty;
    this.hospital = hospital;
    Object.freeze(this);
  }

  withUpdates(updates) {
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

module.exports = { ClinicalInfo };
