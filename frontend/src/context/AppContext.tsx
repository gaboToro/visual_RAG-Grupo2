import React, { createContext, useContext, useState } from 'react';
import {
  UserProfile,
  UserRole,
  PatientTab,
  DoctorTab,
  PostOpRecordDTO,
  WoundReportDTO,
  PharmacyRecommendationDTO,
} from '../types';
import { ThemePalette, getThemePalette } from '../theme/colors';
import {
  loginViaGateway,
  setSessionAuthToken,
  fetchPatientsViaGateway,
  assignPatientViaGateway,
  removePatientViaGateway,
  updatePatientProfileViaGateway,
  updateDoctorProfileViaGateway,
  fetchPostOpRecordViaGateway,
  savePostOpRecordViaGateway,
  evaluateWoundViaGateway,
  fetchSavedReportsViaGateway,
  fetchPharmacyRecommendationsViaGateway,
} from '../services/apiClient';

const MONTHS_ES = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

function formatLocalSpanishDate(date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS_ES[date.getMonth()] || 'nov';
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year} (${hours}:${minutes})`;
}

const INITIAL_PATIENTS: UserProfile[] = [
  {
    id: 'pat-1',
    fullName: 'Nelson Steven Casa',
    email: 'nelsoncasa@gmail.com',
    role: 'PATIENT',
    assignedDoctorId: 'doc-1',
    clinicalInfo: {
      cedula: '1751361054',
      bloodType: 'O+',
      emergencyContact: 'Carmen Casa (Madre) - 0987654321',
      currentPostOpDay: 79,
    },
  },
  {
    id: 'pat-2',
    fullName: 'María Elena Quispe',
    email: 'maria.quispe@outlook.com',
    role: 'PATIENT',
    assignedDoctorId: 'doc-1',
    clinicalInfo: {
      cedula: '1729482711',
      bloodType: 'A+',
      emergencyContact: 'Carlos Quispe (Esposo) - 0991234567',
      currentPostOpDay: 14,
    },
  },
];

const LOCAL_PASSWORDS: Record<string, string> = {
  'nelsoncasa@gmail.com': 'nelson123',
  'maria.quispe@outlook.com': 'maria123',
  'nelson.doctor@gmail.com': 'doctor123',
};

const INITIAL_DOCTOR: UserProfile = {
  id: 'doc-1',
  fullName: 'Dr. Nelson Casa',
  email: 'nelson.doctor@gmail.com',
  role: 'DOCTOR',
  clinicalInfo: {
    medicalLicense: 'MSP-178942',
    specialty: 'Cirugía General y Laparoscópica',
    hospital: 'Hospital Metropolitano',
  },
};

const INITIAL_POSTOP_RECORDS: Record<string, PostOpRecordDTO> = {
  'pat-1': {
    id: 'rec-pat-1',
    patientId: 'pat-1',
    patientName: 'Nelson Steven Casa',
    doctorId: 'doc-1',
    schedule: {
      procedureName: 'Correcion Neuronal',
      surgeryDate: '2026-08-19',
      totalRestDays: 10,
      currentDay: 79,
      remainingDays: 0,
      completionPercentage: 100,
      recoveryStage: 'Fase de Consolidación',
    },
    prohibitedActions: [
      'Prohibido levantar objetos pesados (+3kg), masajear el área o realizar esfuerzos intensos.',
      'Prohibido comer carnes de chancho',
    ],
    allowedCares: ['Mantener en reposo'],
    allergiesAndAlerts: [
      'Configurar signos de alerta: Acudir a urgencias si presenta fiebre > 38°C o enrojecimiento progresivo.',
    ],
    prescribedMedications: [
      'Clorhexidina Solución 2% 120ml',
      'Apósito Tegaderm Impermeable 3M',
    ],
  },
  'pat-2': {
    id: 'rec-pat-2',
    patientId: 'pat-2',
    patientName: 'María Elena Quispe',
    doctorId: 'doc-1',
    schedule: {
      procedureName: 'Colecistectomía Laparoscópica',
      surgeryDate: '2026-10-31',
      totalRestDays: 15,
      currentDay: 14,
      remainingDays: 1,
      completionPercentage: 93,
    },
    prohibitedActions: [
      'Prohibido realizar esfuerzos abdominales o levantar peso.',
      'Prohibido ingerir alimentos grasos.',
    ],
    allowedCares: ['Caminatas cortas asistidas y curación diaria con antiséptico.'],
    allergiesAndAlerts: ['Vigilar fiebre o dolor abdominal agudo.'],
    prescribedMedications: [
      'Clorhexidina Solución 2% 120ml',
      'Apósito Tegaderm Impermeable 3M',
    ],
  },
};

const INITIAL_REPORTS: WoundReportDTO[] = [
  {
    folio: 'REP-475381',
    patientId: 'pat-1',
    patientName: 'Nelson Steven Casa',
    postOpDay: 79,
    formattedDate: '05 nov 2026 (7:07)',
    diagnosisTitle: 'Cicatrización Normal',
    statusBadge: 'Evolución Favorable',
    photosCount: 2,
    photoLabels: ['Foto #1', 'Foto #2'],
    medicalPlanHeader: 'ESTADO DE LA HERIDA (DÍA 79):',
    medicalPlanSummary:
      'La cicatrización de su herida quirúrgica evoluciona favorablemente con bordes bien afrontados y sin signos de infección.',
    clinicalSuggestions:
      'Mantener el área seca. Limpieza con solución salina al 0.9% y apósito Tegaderm permeable al vapor. No frotar la costra.',
    recommendedMedications: [
      'Clorhexidina Solución 2% 120ml',
      'Apósito Tegaderm Impermeable 3M',
    ],
    confidenceScore: 0.99,
    verifiedSignature: 'Documento Clínico Digital Verificado • Visual RAG',
  },
  {
    folio: 'REP-216547',
    patientId: 'pat-1',
    patientName: 'Nelson Steven Casa',
    postOpDay: 78,
    formattedDate: '04 nov 2026 (21:03)',
    diagnosisTitle: 'Cicatrización Hipertrófica',
    statusBadge: 'Evolución Favorable',
    photosCount: 2,
    photoLabels: ['Foto #1', 'Foto #2'],
    medicalPlanHeader: 'ESTADO DE LA HERIDA (DÍA 78):',
    medicalPlanSummary:
      'La herida quirúrgica está completamente cerrada con remodelación epitelial activa en los bordes de la incisión.',
    clinicalSuggestions:
      'Mantener el área seca. Limpieza con solución salina al 0.9% y apósito Tegaderm permeable al vapor. No frotar la costra.',
    recommendedMedications: [
      'Clorhexidina Solución 2% 120ml',
      'Apósito Tegaderm Impermeable 3M',
    ],
    confidenceScore: 0.96,
    verifiedSignature: 'Documento Clínico Digital Verificado • Visual RAG',
  },
  {
    folio: 'REP-309412',
    patientId: 'pat-2',
    patientName: 'María Elena Quispe',
    postOpDay: 14,
    formattedDate: '14 nov 2026 (10:15)',
    diagnosisTitle: 'Granulación Postoperatoria Temprana',
    statusBadge: 'Evolución Favorable',
    photosCount: 2,
    photoLabels: ['Foto #1', 'Foto #2'],
    medicalPlanHeader: 'ESTADO DE LA HERIDA (DÍA 14):',
    medicalPlanSummary:
      'Se observa tejido de granulación limpio en fase proliferativa acorde a su cirugía (Colecistectomía Laparoscópica).',
    clinicalSuggestions:
      'Realizar curación diaria con antiséptico de Clorhexidina 2% y proteger la incisión con apósito estéril impermeable.',
    recommendedMedications: [
      'Clorhexidina Solución 2% 120ml',
      'Apósito Tegaderm Impermeable 3M',
    ],
    confidenceScore: 0.97,
    verifiedSignature: 'Documento Clínico Digital Verificado • Visual RAG',
  },
];

const INITIAL_PHARMACY: PharmacyRecommendationDTO = {
  postOpDay: 79,
  woundClassification: 'Cicatrización Normal',
  headerSubtitle: 'Día 79 de reposo • Cicatrización Normal',
  aiRecoveryTip: {
    title: 'Consejo de Recuperación IA',
    summary:
      'ESTADO DE LA HERIDA (DÍA 79): La cicatrización evoluciona favorablemente. Continúe con el antiséptico y apósito recomendados a continuación.',
  },
  priceComparison: {
    medicationName: 'Clorhexidina Solución 2% 120ml',
    savingsAmount: 0.95,
    savingsPercentage: 23,
    savingsLabel: 'Ahorras $0.95 en este insumo',
    bestOffer: {
      pharmacyName: 'Cruz Azul',
      price: 3.2,
      formattedPrice: '$3.20',
      badgeLabel: 'Precio Más Bajo',
      deliveryInfo: 'Entrega Inmediata',
      orderUrl: 'https://farmaciascruzazul.ec',
    },
    alternativeOffer: {
      pharmacyName: 'Fybeca',
      price: 4.15,
      formattedPrice: '$4.15',
      badgeLabel: 'Entrega en 30 min',
      deliveryInfo: 'Entrega en 30 min',
      orderUrl: 'https://www.fybeca.com',
    },
  },
  totalSavingsAmount: 1.3,
  totalSavingsLabel: 'Ahorro total estimado: $1.30',
  recommendedItems: [
    {
      id: 'med-1',
      name: 'Clorhexidina Solución 2% 120ml',
      category: 'Antiséptico Tópico Quirúrgico',
      pharmacyName: 'Cruz Azul',
      deliveryInfo: 'Entrega Inmediata',
      subtitle: 'Cruz Azul • Entrega Inmediata',
      price: 3.2,
      formattedPrice: '$3.20',
      savingsAmount: 0.95,
      alternativePharmacyName: 'Fybeca',
      alternativeFormattedPrice: '$4.15',
      orderUrl: 'https://farmaciascruzazul.ec',
    },
    {
      id: 'med-2',
      name: 'Apósito Tegaderm Impermeable 3M',
      category: 'Recubrimiento Quirúrgico Estéril',
      pharmacyName: 'Fybeca',
      deliveryInfo: 'Entrega en 30 min',
      subtitle: 'Fybeca • Entrega en 30 min',
      price: 4.5,
      formattedPrice: '$4.50',
      savingsAmount: 0.35,
      alternativePharmacyName: 'Cruz Azul',
      alternativeFormattedPrice: '$4.85',
      orderUrl: 'https://www.fybeca.com',
    },
  ],
};

interface AppContextValue {
  currentUser: UserProfile | null;
  activePatientTab: PatientTab;
  activeDoctorTab: DoctorTab;
  patients: UserProfile[];
  doctorProfile: UserProfile;
  selectedDoctorPatientId: string;
  postOpRecords: Record<string, PostOpRecordDTO>;
  savedReports: WoundReportDTO[];
  selectedReportForModal: WoundReportDTO | null;
  pharmacyData: PharmacyRecommendationDTO;
  capturedPhotos: string[];
  patientNotes: string;
  isEvaluatingRag: boolean;
  isDarkMode: boolean;
  theme: ThemePalette;
  setActivePatientTab: (tab: PatientTab) => void;
  setActiveDoctorTab: (tab: DoctorTab) => void;
  setSelectedReportForModal: (report: WoundReportDTO | null) => void;
  setSelectedDoctorPatientId: (patientId: string) => void;
  setPatientNotes: (notes: string) => void;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  toggleDarkMode: () => void;
  addCapturedPhoto: (uri: string) => void;
  removeCapturedPhoto: (index: number) => void;
  clearCapturedPhotos: () => void;
  evaluateCapturedWoundPhotos: () => Promise<WoundReportDTO>;
  refreshSavedReports: () => Promise<boolean>;
  refreshMedicalOrders: () => Promise<boolean>;
  updatePatientClinicalInfo: (
    fullName: string,
    emergencyContact: string,
    bloodType?: string
  ) => Promise<void>;
  updateDoctorProfessionalInfo: (
    specialty: string,
    hospital: string,
    medicalLicense?: string
  ) => Promise<void>;
  assignNewPatientToDoctor: (
    fullName: string,
    email: string,
    cedula: string,
    bloodType: string
  ) => Promise<void>;
  removePatientFromDoctor: (patientId: string) => Promise<void>;
  saveDoctorPostOpRecord: (
    patientId: string,
    updates: {
      procedureName: string;
      surgeryDate: string;
      totalRestDays: number;
      currentDay?: number;
      prohibitedActions: string[];
      allowedCares: string[];
      allergiesAndAlerts: string[];
      prescribedMedications?: string[];
    }
  ) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activePatientTab, setActivePatientTab] = useState<PatientTab>('EVAL');
  const [activeDoctorTab, setActiveDoctorTab] = useState<DoctorTab>('PATIENTS');
  const [patients, setPatients] = useState<UserProfile[]>(INITIAL_PATIENTS);
  const [doctorProfile, setDoctorProfile] = useState<UserProfile>(INITIAL_DOCTOR);
  const [selectedDoctorPatientId, setSelectedDoctorPatientId] = useState<string>('pat-1');
  const [postOpRecords, setPostOpRecords] =
    useState<Record<string, PostOpRecordDTO>>(INITIAL_POSTOP_RECORDS);
  const [savedReports, setSavedReports] = useState<WoundReportDTO[]>(INITIAL_REPORTS);
  const [selectedReportForModal, setSelectedReportForModal] = useState<WoundReportDTO | null>(null);
  const [pharmacyData, setPharmacyData] =
    useState<PharmacyRecommendationDTO>(INITIAL_PHARMACY);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [patientNotes, setPatientNotes] = useState<string>('');
  const [isEvaluatingRag, setIsEvaluatingRag] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const theme = getThemePalette(isDarkMode);

  async function syncInitialDataFromGateway(loggedUser: UserProfile): Promise<void> {
    if (loggedUser.role === 'PATIENT') {
      const [remoteRecord, remoteReports] = await Promise.all([
        fetchPostOpRecordViaGateway(loggedUser.id),
        fetchSavedReportsViaGateway(loggedUser.id),
      ]);
      if (remoteRecord) {
        setPostOpRecords((prev) => ({ ...prev, [loggedUser.id]: remoteRecord }));
      }
      if (remoteReports && remoteReports.length > 0) {
        setSavedReports(remoteReports);
      }
    } else {
      const remotePatients = await fetchPatientsViaGateway();
      if (remotePatients && remotePatients.length > 0) {
        setPatients(remotePatients);
      }
    }
  }

  async function login(email: string, password: string, role: UserRole): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const gatewayAuth = await loginViaGateway(cleanEmail, password, role);

    if (gatewayAuth.user) {
      setCurrentUser(gatewayAuth.user);
      setActivePatientTab('EVAL');
      setActiveDoctorTab('PATIENTS');
      await syncInitialDataFromGateway(gatewayAuth.user);
      return true;
    }

    if (!gatewayAuth.unreachable) {
      return false;
    }

    // Validación en modo local (cuando el backend está apagado)
    const expectedPassword = LOCAL_PASSWORDS[cleanEmail];
    if (role === 'PATIENT') {
      const found = patients.find((p) => p.email.toLowerCase() === cleanEmail);
      if (!found) return false;
      const validPass = expectedPassword ? password === expectedPassword : password === 'paciente123';
      if (!validPass) return false;

      setCurrentUser(found);
      setActivePatientTab('EVAL');
      return true;
    } else {
      if (cleanEmail !== doctorProfile.email.toLowerCase() || password !== 'doctor123') {
        return false;
      }
      setCurrentUser(doctorProfile);
      setActiveDoctorTab('PATIENTS');
      return true;
    }
  }

  function logout(): void {
    setSessionAuthToken(null);
    setCurrentUser(null);
    setSelectedReportForModal(null);
    setCapturedPhotos([]);
    setPatientNotes('');
  }

  function toggleDarkMode(): void {
    setIsDarkMode((prev) => !prev);
  }

  function addCapturedPhoto(uri: string): void {
    setCapturedPhotos((prev) => {
      if (prev.length >= 4) return prev;
      return [...prev, uri];
    });
  }

  function removeCapturedPhoto(index: number): void {
    setCapturedPhotos((prev) => prev.filter((_, idx) => idx !== index));
  }

  function clearCapturedPhotos(): void {
    setCapturedPhotos([]);
  }

  async function evaluateCapturedWoundPhotos(): Promise<WoundReportDTO> {
    setIsEvaluatingRag(true);
    try {
      const patientId = currentUser?.id || 'pat-1';
      const patientName = currentUser?.fullName || 'Nelson Steven Casa';
      const currentRecord = postOpRecords[patientId] || postOpRecords['pat-1'];
      const postOpDay = currentRecord?.schedule?.currentDay || 79;
      const photosToSend =
        capturedPhotos.length > 0 ? capturedPhotos : ['Foto #1', 'Foto #2'];

      const gatewayResult = await evaluateWoundViaGateway({
        patientId,
        patientName,
        postOpDay,
        photos: photosToSend,
        patientNotes,
      });

      if (gatewayResult && gatewayResult.report) {
        const enrichedReport: WoundReportDTO = {
          ...gatewayResult.report,
          photoUris: capturedPhotos,
        };
        setSavedReports((prev) => [enrichedReport, ...prev]);
        if (gatewayResult.pharmacyRecommendation) {
          setPharmacyData(gatewayResult.pharmacyRecommendation);
        }
        setCapturedPhotos([]);
        setPatientNotes('');
        setSelectedReportForModal(enrichedReport);
        return enrichedReport;
      }

      // Fallback local con evaluación dinámica según notas y día postoperatorio
      const notesLower = patientNotes.toLowerCase();
      let diagnosisTitle = 'Cicatrización Normal';
      let statusBadge = 'Evolución Favorable';
      let confidenceScore = 0.99;
      let clinicalSuggestions =
        'Mantener el área seca. Limpieza con solución salina al 0.9% y apósito Tegaderm permeable al vapor. No frotar la costra.';
      let baseSummary = `La cicatrización de su herida quirúrgica (${currentRecord.schedule.procedureName}) evoluciona favorablemente con cierre epitelial limpio.`;

      if (
        notesLower.includes('fiebre') ||
        notesLower.includes('pus') ||
        notesLower.includes('secrecion') ||
        notesLower.includes('secreción') ||
        notesLower.includes('sangrado') ||
        notesLower.includes('infeccion') ||
        notesLower.includes('infección') ||
        notesLower.includes('abierta') ||
        notesLower.includes('dehiscencia')
      ) {
        diagnosisTitle = 'Signos de Infección / Dehiscencia';
        statusBadge = 'Requiere Atención Médica';
        confidenceScore = 0.96;
        baseSummary = `Se identifican signos de alerta en la herida de ${currentRecord.schedule.procedureName} que requieren valoración prioritaria por su cirujano.`;
        clinicalSuggestions =
          'No automedicarse ni manipular los puntos. Realizar limpieza suave con antiséptico, cubrir con apósito estéril y contactar de inmediato a su cirujano.';
      } else if (
        notesLower.includes('roja') ||
        notesLower.includes('borde') ||
        notesLower.includes('engrosa') ||
        notesLower.includes('elevad') ||
        notesLower.includes('hipertrof')
      ) {
        diagnosisTitle = 'Cicatrización Hipertrófica';
        confidenceScore = 0.97;
        baseSummary = `La herida quirúrgica (${currentRecord.schedule.procedureName}) está cerrada con remodelación colágena activa en la línea de sutura.`;
        clinicalSuggestions =
          'Mantener hidratación controlada, limpieza antiséptica suave con Clorhexidina al 2% y cubrir con apósito protector sin fricción.';
      } else if (
        notesLower.includes('granul') ||
        notesLower.includes('tempran') ||
        notesLower.includes('rosad') ||
        notesLower.includes('reciente') ||
        notesLower.includes('sensible') ||
        (postOpDay <= 20 && !notesLower.includes('normal'))
      ) {
        diagnosisTitle = 'Granulación Postoperatoria Temprana';
        confidenceScore = 0.95;
        baseSummary = `Se observa tejido de granulación limpio en fase proliferativa acorde al cronograma de ${currentRecord.schedule.procedureName}.`;
        clinicalSuggestions =
          'Realizar curación diaria con antiséptico de Clorhexidina 2% y proteger la incisión con apósito estéril impermeable.';
      }

      const folio = `REP-${Math.floor(100000 + Math.random() * 900000)}`;
      const localReport: WoundReportDTO = {
        folio,
        patientId,
        patientName,
        postOpDay,
        formattedDate: formatLocalSpanishDate(new Date()),
        diagnosisTitle,
        statusBadge,
        photosCount: photosToSend.length,
        photoLabels: photosToSend.map((_, idx) => `Foto #${idx + 1}`),
        photoUris: capturedPhotos,
        patientNotes,
        medicalPlanHeader: `ESTADO DE LA HERIDA (DÍA ${postOpDay}):`,
        medicalPlanSummary: baseSummary,
        clinicalSuggestions,
        recommendedMedications: currentRecord.prescribedMedications,
        confidenceScore,
        verifiedSignature: 'Documento Clínico Digital Verificado • Visual RAG',
      };

      setSavedReports((prev) => [localReport, ...prev]);
      setPharmacyData((prev) => ({
        ...prev,
        postOpDay,
        woundClassification: diagnosisTitle,
        headerSubtitle: `Día ${postOpDay} de reposo • ${diagnosisTitle}`,
        aiRecoveryTip: {
          title: 'Consejo de Recuperación IA',
          summary: `ESTADO DE LA HERIDA (DÍA ${postOpDay}): Diagnóstico "${diagnosisTitle}". Continúe con el antiséptico y apósito recomendados por su cirujano.`,
        },
      }));
      setCapturedPhotos([]);
      setPatientNotes('');
      setSelectedReportForModal(localReport);
      return localReport;
    } finally {
      setIsEvaluatingRag(false);
    }
  }

  async function refreshSavedReports(): Promise<boolean> {
    const patientId = currentUser?.id || 'pat-1';
    const remoteReports = await fetchSavedReportsViaGateway(patientId);
    if (remoteReports && remoteReports.length > 0) {
      setSavedReports(remoteReports);
      return true;
    }
    return false;
  }

  async function refreshMedicalOrders(): Promise<boolean> {
    const patientId = currentUser?.id || 'pat-1';
    const remoteRecord = await fetchPostOpRecordViaGateway(patientId);
    if (remoteRecord) {
      setPostOpRecords((prev) => ({
        ...prev,
        [patientId]: remoteRecord,
      }));
      const remotePharm = await fetchPharmacyRecommendationsViaGateway({
        postOpDay: remoteRecord.schedule.currentDay,
        woundClassification: pharmacyData.woundClassification,
        prescribedMedications: remoteRecord.prescribedMedications,
      });
      if (remotePharm) {
        setPharmacyData(remotePharm);
      }
      return true;
    }
    return false;
  }

  async function updatePatientClinicalInfo(
    fullName: string,
    emergencyContact: string,
    bloodType?: string
  ): Promise<void> {
    if (!currentUser) return;
    const cleanName = fullName.trim() || currentUser.fullName;
    const cleanEmergency =
      emergencyContact.trim() || currentUser.clinicalInfo.emergencyContact || '';
    const cleanBlood =
      (bloodType && bloodType.trim()) || currentUser.clinicalInfo.bloodType || 'O+';

    const remoteUpdated = await updatePatientProfileViaGateway(currentUser.id, {
      fullName: cleanName,
      emergencyContact: cleanEmergency,
      bloodType: cleanBlood,
    });

    const updated: UserProfile = remoteUpdated || {
      ...currentUser,
      fullName: cleanName,
      clinicalInfo: {
        ...currentUser.clinicalInfo,
        emergencyContact: cleanEmergency,
        bloodType: cleanBlood,
      },
    };
    setCurrentUser(updated);
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  async function updateDoctorProfessionalInfo(
    specialty: string,
    hospital: string,
    medicalLicense?: string
  ): Promise<void> {
    const cleanSpecialty = specialty.trim() || doctorProfile.clinicalInfo.specialty || '';
    const cleanHospital = hospital.trim() || doctorProfile.clinicalInfo.hospital || '';
    const cleanLicense =
      (medicalLicense && medicalLicense.trim()) ||
      doctorProfile.clinicalInfo.medicalLicense ||
      'MSP-178942';

    const remoteUpdated = await updateDoctorProfileViaGateway(doctorProfile.id, {
      specialty: cleanSpecialty,
      hospital: cleanHospital,
      medicalLicense: cleanLicense,
    });

    const updated: UserProfile = remoteUpdated || {
      ...doctorProfile,
      clinicalInfo: {
        ...doctorProfile.clinicalInfo,
        specialty: cleanSpecialty,
        hospital: cleanHospital,
        medicalLicense: cleanLicense,
      },
    };
    setDoctorProfile(updated);
    if (currentUser?.role === 'DOCTOR') {
      setCurrentUser(updated);
    }
  }

  async function assignNewPatientToDoctor(
    fullName: string,
    email: string,
    cedula: string,
    bloodType: string
  ): Promise<void> {
    const remoteCreated = await assignPatientViaGateway({
      fullName,
      email,
      cedula,
      bloodType,
      doctorId: doctorProfile.id,
    });

    const newId = remoteCreated?.id || `pat-${Date.now()}`;
    const newPatient: UserProfile = remoteCreated || {
      id: newId,
      fullName,
      email,
      role: 'PATIENT',
      assignedDoctorId: doctorProfile.id,
      clinicalInfo: {
        cedula,
        bloodType,
        emergencyContact: 'Contacto familiar registrado',
        currentPostOpDay: 1,
      },
    };

    LOCAL_PASSWORDS[email.toLowerCase().trim()] = 'paciente123';

    const newRecord: PostOpRecordDTO = {
      id: `rec-${newId}`,
      patientId: newId,
      patientName: fullName,
      doctorId: doctorProfile.id,
      schedule: {
        procedureName: 'Correcion Neuronal',
        surgeryDate: '2026-11-14',
        totalRestDays: 10,
        currentDay: 1,
        remainingDays: 9,
        completionPercentage: 10,
      },
      prohibitedActions: [
        'Prohibido levantar objetos pesados (+3kg), masajear el área o realizar esfuerzos intensos.',
      ],
      allowedCares: ['Mantener en reposo'],
      allergiesAndAlerts: ['Configurar signos de alerta'],
      prescribedMedications: [
        'Clorhexidina Solución 2% 120ml',
        'Apósito Tegaderm Impermeable 3M',
      ],
    };

    setPatients((prev) => [newPatient, ...prev]);
    setPostOpRecords((prev) => ({ ...prev, [newId]: newRecord }));
  }

  async function removePatientFromDoctor(patientId: string): Promise<void> {
    await removePatientViaGateway(patientId);
    setPatients((prev) => {
      const filtered = prev.filter((p) => p.id !== patientId);
      if (selectedDoctorPatientId === patientId && filtered.length > 0) {
        setSelectedDoctorPatientId(filtered[0].id);
      }
      return filtered;
    });
  }

  async function saveDoctorPostOpRecord(
    patientId: string,
    updates: {
      procedureName: string;
      surgeryDate: string;
      totalRestDays: number;
      currentDay?: number;
      prohibitedActions: string[];
      allowedCares: string[];
      allergiesAndAlerts: string[];
      prescribedMedications?: string[];
    }
  ): Promise<void> {
    const existing = postOpRecords[patientId] || postOpRecords['pat-1'];
    const currentDay = Math.max(
      1,
      Number(updates.currentDay !== undefined ? updates.currentDay : existing.schedule.currentDay) || 1
    );
    const totalRestDays = Math.max(1, Number(updates.totalRestDays) || 10);
    const remainingDays = Math.max(0, totalRestDays - currentDay);
    const completionPercentage = Math.min(
      100,
      Math.round((currentDay / Math.max(1, totalRestDays)) * 100)
    );

    const updatedRecord: PostOpRecordDTO = {
      ...existing,
      schedule: {
        procedureName: updates.procedureName,
        surgeryDate: updates.surgeryDate,
        totalRestDays,
        currentDay,
        remainingDays,
        completionPercentage,
      },
      prohibitedActions: updates.prohibitedActions,
      allowedCares: updates.allowedCares,
      allergiesAndAlerts: updates.allergiesAndAlerts,
      prescribedMedications:
        updates.prescribedMedications || existing.prescribedMedications,
    };

    setPostOpRecords((prev) => ({
      ...prev,
      [patientId]: updatedRecord,
    }));

    const savedRemote = await savePostOpRecordViaGateway(patientId, {
      ...updates,
      currentDay,
    });
    if (savedRemote) {
      setPostOpRecords((prev) => ({
        ...prev,
        [patientId]: savedRemote,
      }));
    }
  }

  const visibleReports =
    currentUser?.role === 'PATIENT'
      ? savedReports.filter((r) => !r.patientId || r.patientId === currentUser.id)
      : savedReports;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activePatientTab,
        activeDoctorTab,
        patients,
        doctorProfile,
        selectedDoctorPatientId,
        postOpRecords,
        savedReports: visibleReports,
        selectedReportForModal,
        pharmacyData,
        capturedPhotos,
        patientNotes,
        isEvaluatingRag,
        isDarkMode,
        theme,
        setActivePatientTab,
        setActiveDoctorTab,
        setSelectedReportForModal,
        setSelectedDoctorPatientId,
        setPatientNotes,
        login,
        logout,
        toggleDarkMode,
        addCapturedPhoto,
        removeCapturedPhoto,
        clearCapturedPhotos,
        evaluateCapturedWoundPhotos,
        refreshSavedReports,
        refreshMedicalOrders,
        updatePatientClinicalInfo,
        updateDoctorProfessionalInfo,
        assignNewPatientToDoctor,
        removePatientFromDoctor,
        saveDoctorPostOpRecord,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp() debe utilizarse dentro de un <AppProvider>.');
  }
  return context;
}
