import {
  UserProfile,
  UserRole,
  PostOpRecordDTO,
  WoundReportDTO,
  PharmacyRecommendationDTO,
} from '../types';

const API_GATEWAY_URL = 'http://localhost:4000';
let sessionAuthToken: string | null = null;

export function setSessionAuthToken(token: string | null): void {
  sessionAuthToken = token;
}

async function fetchWithTimeout(endpoint: string, options: RequestInit = {}): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  const authHeader: Record<string, string> = sessionAuthToken
    ? { Authorization: `Bearer ${sessionAuthToken}` }
    : {};

  try {
    const response = await fetch(`${API_GATEWAY_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...((options.headers as Record<string, string>) || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const error: any = new Error(errBody.error || `Error HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function loginViaGateway(
  email: string,
  password: string,
  role: UserRole
): Promise<{
  user: UserProfile | null;
  token?: string;
  unreachable: boolean;
  errorMessage?: string;
}> {
  try {
    const res = await fetchWithTimeout('/api/identity/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    if (res.token) {
      setSessionAuthToken(res.token);
    }
    return { user: res.user as UserProfile, token: res.token, unreachable: false };
  } catch (err: any) {
    if (err && typeof err.status === 'number' && err.status >= 400 && err.status < 500) {
      return {
        user: null,
        unreachable: false,
        errorMessage: err.message || 'Credenciales inválidas.',
      };
    }
    return { user: null, unreachable: true };
  }
}

export async function fetchPatientsViaGateway(query = ''): Promise<UserProfile[] | null> {
  try {
    const qs = query ? `?q=${encodeURIComponent(query)}` : '';
    const res = await fetchWithTimeout(`/api/identity/patients${qs}`, {
      method: 'GET',
    });
    return (res.patients as UserProfile[]) || null;
  } catch (_err) {
    return null;
  }
}

export async function assignPatientViaGateway(payload: {
  fullName: string;
  email: string;
  cedula: string;
  bloodType: string;
  doctorId?: string;
}): Promise<UserProfile | null> {
  try {
    const res = await fetchWithTimeout('/api/identity/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return (res.patient as UserProfile) || null;
  } catch (_err) {
    return null;
  }
}

export async function removePatientViaGateway(patientId: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`/api/identity/patients/${patientId}`, {
      method: 'DELETE',
    });
    return Boolean(res.success);
  } catch (_err) {
    return false;
  }
}

export async function updatePatientProfileViaGateway(
  patientId: string,
  payload: { fullName: string; emergencyContact: string; bloodType?: string }
): Promise<UserProfile | null> {
  try {
    const res = await fetchWithTimeout(`/api/identity/patients/${patientId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return (res.user as UserProfile) || null;
  } catch (_err) {
    return null;
  }
}

export async function updateDoctorProfileViaGateway(
  doctorId: string,
  payload: { specialty: string; hospital: string; medicalLicense?: string }
): Promise<UserProfile | null> {
  try {
    const res = await fetchWithTimeout(`/api/identity/doctors/${doctorId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return (res.user as UserProfile) || null;
  } catch (_err) {
    return null;
  }
}

export async function fetchPostOpRecordViaGateway(
  patientId: string
): Promise<PostOpRecordDTO | null> {
  try {
    const res = await fetchWithTimeout(`/api/clinical/orders/${patientId}`, {
      method: 'GET',
    });
    return (res.record as PostOpRecordDTO) || null;
  } catch (_err) {
    return null;
  }
}

export async function savePostOpRecordViaGateway(
  patientId: string,
  payload: Record<string, any>
): Promise<PostOpRecordDTO | null> {
  try {
    const res = await fetchWithTimeout(`/api/clinical/orders/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return (res.record as PostOpRecordDTO) || null;
  } catch (_err) {
    return null;
  }
}

export async function evaluateWoundViaGateway(params: {
  patientId: string;
  patientName: string;
  postOpDay: number;
  photos: string[];
  patientNotes?: string;
}): Promise<{
  report: WoundReportDTO;
  pharmacyRecommendation: PharmacyRecommendationDTO;
} | null> {
  try {
    const res = await fetchWithTimeout('/api/triage/evaluate-wound', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return {
      report: res.report,
      pharmacyRecommendation: res.pharmacyRecommendation,
    };
  } catch (_err) {
    return null;
  }
}

export async function fetchSavedReportsViaGateway(
  patientId: string
): Promise<WoundReportDTO[] | null> {
  try {
    const res = await fetchWithTimeout(`/api/rag/reports/patient/${patientId}`, {
      method: 'GET',
    });
    return (res.reports as WoundReportDTO[]) || null;
  } catch (_err) {
    return null;
  }
}

export async function fetchPharmacyRecommendationsViaGateway(params: {
  postOpDay: number;
  woundClassification: string;
  prescribedMedications: string[];
}): Promise<PharmacyRecommendationDTO | null> {
  try {
    const res = await fetchWithTimeout('/api/pharmacy/recommendations', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return (res as PharmacyRecommendationDTO) || null;
  } catch (_err) {
    return null;
  }
}

export async function fetchReportByFolioViaGateway(
  folio: string
): Promise<WoundReportDTO | null> {
  try {
    const res = await fetchWithTimeout(`/api/rag/reports/folio/${encodeURIComponent(folio)}`, {
      method: 'GET',
    });
    return (res.report as WoundReportDTO) || null;
  } catch (_err) {
    return null;
  }
}

export async function checkGatewayHealth(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout('/health', { method: 'GET' });
    return res?.status === 'UP';
  } catch (_err) {
    return false;
  }
}
