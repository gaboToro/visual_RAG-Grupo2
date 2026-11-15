/**
 * @file apiClient.ts
 * @description Cliente HTTP para comunicar el Front-End de React Native (Expo) con el API Gateway
 * de Microservicios DDD (`http://localhost:4000`), incluyendo respaldo local resiliente.
 */

import {
  UserProfile,
  UserRole,
  PostOpRecordDTO,
  WoundReportDTO,
  PharmacyRecommendationDTO,
} from '../types';

const API_GATEWAY_URL = 'http://localhost:4000';

/**
 * Ejecuta una petición fetch con tiempo de espera (timeout) hacia el API Gateway.
 * @param {string} endpoint - Ruta relativa dentro del API Gateway (ej. "/api/identity/login").
 * @param {RequestInit} [options] - Opciones de configuración HTTP.
 * @returns {Promise<any>} Respuesta JSON del microservicio correspondiente.
 */
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

/**
 * Autentica un usuario contra el Microservicio de Identidad (`/api/identity/login`).
 * @param {string} email - Correo electrónico ingresado.
 * @param {string} password - Contraseña ingresada.
 * @param {UserRole} role - Rol seleccionado ('PATIENT' o 'DOCTOR').
 * @returns {Promise<UserProfile|null>} Perfil del usuario si el backend está disponible, o null para usar estado local.
 */
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

/**
 * Envía las fotografías de la herida postoperatoria al endpoint orquestador del API Gateway
 * (`/api/triage/evaluate-wound`), el cual consulta la Ficha del Doctor, evalúa con el Dataset ML (RAG)
 * y obtiene los mejores precios de medicamentos en Farmacias.
 * @param {Object} params - Datos de la evaluación de herida.
 * @returns {Promise<{ report: WoundReportDTO; pharmacyRecommendation: PharmacyRecommendationDTO } | null>}
 */
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

/**
 * Guarda la Ficha Postoperatoria actualizada por el médico en el Microservicio de Órdenes Clínicas.
 * @param {string} patientId - ID del paciente.
 * @param {Partial<PostOpRecordDTO>} payload - Datos actualizados de la ficha.
 * @returns {Promise<PostOpRecordDTO | null>}
 */
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
