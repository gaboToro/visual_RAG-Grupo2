export type UserRole = 'PATIENT' | 'DOCTOR';

export type PatientTab = 'EVAL' | 'REPORTS' | 'PHARMACY' | 'ORDERS' | 'PROFILE' | 'REP' | 'PHARM' | 'ORD' | 'PROF';
export type DoctorTab = 'PATIENTS' | 'RECORD' | 'PROFILE' | 'RESTRICTIONS';

export interface ClinicalInfo {
  cedula?: string;
  bloodType?: string;
  emergencyContact?: string;
  currentPostOpDay?: number;
  medicalLicense?: string;
  specialty?: string;
  hospital?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  assignedDoctorId?: string | null;
  clinicalInfo: ClinicalInfo;
}

export interface SurgeryScheduleDTO {
  procedureName: string;
  surgeryDate: string;
  totalRestDays: number;
  currentDay: number;
  remainingDays: number;
  completionPercentage: number;
  isCompleted?: boolean;
  recoveryStage?: string;
}

export interface PostOpRecordDTO {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  schedule: SurgeryScheduleDTO;
  prohibitedActions: string[];
  allowedCares: string[];
  allergiesAndAlerts: string[];
  prescribedMedications: string[];
  updatedAt?: string;
}

export interface WoundReportDTO {
  folio: string;
  patientId: string;
  patientName: string;
  postOpDay: number;
  formattedDate: string;
  diagnosisTitle: string;
  statusBadge: string;
  photosCount: number;
  photoLabels: string[];
  photoUris?: string[];
  patientNotes?: string;
  medicalPlanHeader: string;
  medicalPlanSummary: string;
  clinicalSuggestions: string;
  recommendedMedications: string[];
  confidenceScore?: number;
  verifiedSignature: string;
}

export interface PharmacyOfferSummary {
  pharmacyName: string;
  price: number;
  formattedPrice: string;
  badgeLabel: string;
  deliveryInfo: string;
  orderUrl: string;
}

export interface PriceComparisonDTO {
  medicationName: string;
  savingsAmount: number;
  savingsPercentage?: number;
  savingsLabel: string;
  bestOffer: PharmacyOfferSummary;
  alternativeOffer: PharmacyOfferSummary;
}

export interface RecommendedMedicationItemDTO {
  id: string;
  name: string;
  category: string;
  pharmacyName: string;
  deliveryInfo: string;
  subtitle: string;
  price: number;
  formattedPrice: string;
  savingsAmount?: number;
  alternativePharmacyName?: string;
  alternativeFormattedPrice?: string;
  orderUrl: string;
}

export interface PharmacyRecommendationDTO {
  postOpDay: number;
  woundClassification: string;
  headerSubtitle: string;
  aiRecoveryTip: {
    title: string;
    summary: string;
  };
  priceComparison: PriceComparisonDTO;
  totalSavingsAmount?: number;
  totalSavingsLabel?: string;
  recommendedItems: RecommendedMedicationItemDTO[];
}
