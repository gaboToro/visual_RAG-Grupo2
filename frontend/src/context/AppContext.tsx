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
  evaluateWoundViaGateway,
  savePostOpRecordViaGateway,
} from '../services/apiClient';

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
  isEvaluatingRag: boolean;
  isDarkMode: boolean;
  theme: ThemePalette;
  setActivePatientTab: (tab: PatientTab) => void;
  setActiveDoctorTab: (tab: DoctorTab) => void;
  setSelectedReportForModal: (report: WoundReportDTO | null) => void;
  setSelectedDoctorPatientId: (patientId: string) => void;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  toggleDarkMode: () => void;
  addCapturedPhoto: (uri: string) => void;
  clearCapturedPhotos: () => void;
  evaluateCapturedWoundPhotos: () => Promise<WoundReportDTO>;
  updatePatientClinicalInfo: (fullName: string, emergencyContact: string) => void;
  updateDoctorProfessionalInfo: (specialty: string, hospital: string) => void;
  assignNewPatientToDoctor: (fullName: string, email: string, cedula: string, bloodType: string) => void;
  removePatientFromDoctor: (patientId: string) => void;
  saveDoctorPostOpRecord: (
    patientId: string,
    updates: {
      procedureName: string;
      surgeryDate: string;
      totalRestDays: number;
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
  const [isEvaluatingRag, setIsEvaluatingRag] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const theme = getThemePalette(isDarkMode);

  async function login(email: string, password: string, role: UserRole): Promise<boolean> {
    const gatewayUser = await loginViaGateway(email, password, role);
    if (gatewayUser) {
      setCurrentUser(gatewayUser);
      setActivePatientTab('EVAL');
      setActiveDoctorTab('PATIENTS');
      return true;
    }

    if (role === 'PATIENT') {
      const found =
        patients.find((p) => p.email.toLowerCase() === email.toLowerCase().trim()) ||
        patients[0];
      setCurrentUser(found);
      setActivePatientTab('EVAL');
      return true;
    } else {
      setCurrentUser(doctorProfile);
      setActiveDoctorTab('PATIENTS');
      return true;
    }
  }

  function logout(): void {
    setCurrentUser(null);
    setSelectedReportForModal(null);
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
        setSelectedReportForModal(enrichedReport);
        return enrichedReport;
      }

      const folio = `REP-${Math.floor(100000 + Math.random() * 900000)}`;
      const localReport: WoundReportDTO = {
        folio,
        patientId,
        patientName,
        postOpDay,
        formattedDate: '05 nov 2026 (7:07)',
        diagnosisTitle: 'Cicatrización Normal',
        statusBadge: 'Evolución Favorable',
        photosCount: photosToSend.length,
        photoLabels: photosToSend.map((_, idx) => `Foto #${idx + 1}`),
        photoUris: capturedPhotos,
        medicalPlanHeader: `ESTADO DE LA HERIDA (DÍA ${postOpDay}):`,
        medicalPlanSummary: `La cicatrización de su herida quirúrgica (${currentRecord.schedule.procedureName}) evoluciona favorablemente con cierre epitelial limpio.`,
        clinicalSuggestions:
          'Mantener el área seca. Limpieza con solución salina al 0.9% y apósito Tegaderm permeable al vapor. No frotar la costra.',
        recommendedMedications: currentRecord.prescribedMedications,
        confidenceScore: 0.99,
        verifiedSignature: 'Documento Clínico Digital Verificado • Visual RAG',
      };

      setSavedReports((prev) => [localReport, ...prev]);
      setCapturedPhotos([]);
      setSelectedReportForModal(localReport);
      return localReport;
    } finally {
      setIsEvaluatingRag(false);
    }
  }

  function updatePatientClinicalInfo(fullName: string, emergencyContact: string): void {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      fullName: fullName.trim() || currentUser.fullName,
      clinicalInfo: {
        ...currentUser.clinicalInfo,
        emergencyContact: emergencyContact.trim() || currentUser.clinicalInfo.emergencyContact,
      },
    };
    setCurrentUser(updated);
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function updateDoctorProfessionalInfo(specialty: string, hospital: string): void {
    const updated: UserProfile = {
      ...doctorProfile,
      clinicalInfo: {
        ...doctorProfile.clinicalInfo,
        specialty: specialty.trim() || doctorProfile.clinicalInfo.specialty,
        hospital: hospital.trim() || doctorProfile.clinicalInfo.hospital,
      },
    };
    setDoctorProfile(updated);
    if (currentUser?.role === 'DOCTOR') {
      setCurrentUser(updated);
    }
  }

  function assignNewPatientToDoctor(
    fullName: string,
    email: string,
    cedula: string,
    bloodType: string
  ): void {
    const newId = `pat-${Date.now()}`;
    const newPatient: UserProfile = {
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

  function removePatientFromDoctor(patientId: string): void {
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
      prohibitedActions: string[];
      allowedCares: string[];
      allergiesAndAlerts: string[];
      prescribedMedications?: string[];
    }
  ): Promise<void> {
    const existing = postOpRecords[patientId] || postOpRecords['pat-1'];
    const currentDay = existing.schedule.currentDay;
    const totalRestDays = Number(updates.totalRestDays) || 10;
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

    await savePostOpRecordViaGateway(patientId, {
      ...updates,
      currentDay,
    });
  }

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
        savedReports,
        selectedReportForModal,
        pharmacyData,
        capturedPhotos,
        isEvaluatingRag,
        isDarkMode,
        theme,
        setActivePatientTab,
        setActiveDoctorTab,
        setSelectedReportForModal,
        setSelectedDoctorPatientId,
        login,
        logout,
        toggleDarkMode,
        addCapturedPhoto,
        clearCapturedPhotos,
        evaluateCapturedWoundPhotos,
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
