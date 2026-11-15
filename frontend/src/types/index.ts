/**
 * @file index.ts
 * @description Definiciones de tipos e interfaces TypeScript que representan los modelos
 * de dominio en el cliente móvil (React Native Expo) sincronizados con los microservicios DDD.
 */

export type UserRole = 'PATIENT' | 'DOCTOR';

export type PatientTab = 'EVAL' | 'REP' | 'PHARM' | 'ORD' | 'PROF';
export type DoctorTab = 'PATIENTS' | 'RESTRICTIONS' | 'PROFILE';

/**
 * Información clínica del paciente o profesional del médico cirujano.
 */
export interface ClinicalInfo {
  cedula?: string;
  bloodType?: string;
  emergencyContact?: string;
  currentPostOpDay?: number;
  medicalLicense?: string;
  specialty?: string;
  hospital?: string;
}

/**
 * Usuario autenticado (Paciente o Médico Cirujano).
 */
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  assignedDoctorId?: string | null;
  clinicalInfo: ClinicalInfo;
}

/**
 * Cronograma quirúrgico calculado por el microservicio de Órdenes Clínicas.
 */
export interface SurgeryScheduleDTO {
  procedureName: string;
  surgeryDate: string;
  totalRestDays: number;
  currentDay: number;
  remainingDays: number;
  completionPercentage: number;
}

/**
 * Ficha Postoperatoria y Órdenes de Recuperación prescritas por el doctor.
 */
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

/**
 * Reporte Clínico Oficial generado por el motor Visual RAG + Machine Learning.
 */
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
  medicalPlanHeader: string;
  medicalPlanSummary: string;
  clinicalSuggestions: string;
  recommendedMedications: string[];
  confidenceScore?: number;
  verifiedSignature: string;
}

/**
 * Oferta de una cadena de farmacias para la tarjeta de comparativa de precios.
 */
export interface PharmacyOfferSummary {
  pharmacyName: string;
  price: number;
  formattedPrice: string;
  badgeLabel: string;
  deliveryInfo: string;
  orderUrl: string;
}

/**
 * Resultado de comparativa de precios en un insumo quirúrgico.
 */
export interface PriceComparisonDTO {
  medicationName: string;
  savingsAmount: number;
  savingsLabel: string;
  bestOffer: PharmacyOfferSummary;
  alternativeOffer: PharmacyOfferSummary;
}

/**
 * Medicamento o insumo individual recomendado para la recuperación postoperatoria.
 */
export interface RecommendedMedicationItemDTO {
  id: string;
  name: string;
  category: string;
  pharmacyName: string;
  deliveryInfo: string;
  subtitle: string;
  price: number;
  formattedPrice: string;
  orderUrl: string;
}

/**
 * Respuesta integral del microservicio de Farmacia y Precios.
 */
export interface PharmacyRecommendationDTO {
  postOpDay: number;
  woundClassification: string;
  headerSubtitle: string;
  aiRecoveryTip: {
    title: string;
    summary: string;
  };
  priceComparison: PriceComparisonDTO;
  recommendedItems: RecommendedMedicationItemDTO[];
}
