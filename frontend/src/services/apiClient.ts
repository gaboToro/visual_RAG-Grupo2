import {
  UserProfile,
  UserRole,
  PostOpRecordDTO,
  WoundReportDTO,
  PharmacyRecommendationDTO,
} from '../types';

const API_GATEWAY_URL = 'http://localhost:4000';

async function fetchWithTimeout(endpoint: string, options: RequestInit = {}): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${API_GATEWAY_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `Error HTTP ${response.status}`);
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
): Promise<UserProfile | null> {
  try {
    const res = await fetchWithTimeout('/api/identity/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
    return res.user as UserProfile;
  } catch (_err) {
    return null;
  }
}

export async function evaluateWoundViaGateway(params: {
  patientId: string;
  patientName: string;
  postOpDay: number;
  photos: string[];
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

export async function savePostOpRecordViaGateway(
  patientId: string,
  payload: Record<string, any>
): Promise<PostOpRecordDTO | null> {
  try {
    const res = await fetchWithTimeout(`/api/clinical/orders/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.record as PostOpRecordDTO;
  } catch (_err) {
    return null;
  }
}
