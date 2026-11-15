/**
 * @file index.js
 * @description API Gateway (Puerto 4000) para la arquitectura de microservicios de Visual RAG.
 * Actúa como punto de entrada único para el Front-End en React Native (Expo), enrutando peticiones
 * hacia los 4 microservicios DDD y orquestando el flujo completo de Triaje Visual RAG + Farmacia.
 */

const http = require('http');

const SERVICES = {
  IDENTITY: process.env.IDENTITY_URL || 'http://localhost:4001',
  CLINICAL: process.env.CLINICAL_URL || 'http://localhost:4002',
  RAG: process.env.RAG_URL || 'http://localhost:4003',
  PHARMACY: process.env.PHARMACY_URL || 'http://localhost:4004',
};

/**
 * Lee y parsea el cuerpo JSON de una petición HTTP entrante.
 * @param {import('http').IncomingMessage} req - Petición HTTP.
 * @returns {Promise<Object>} Objeto JSON parseado.
 */
function parseRequestBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (_err) {
        resolve({});
      }
    });
  });
}

/**
 * Realiza una llamada HTTP interna hacia uno de los microservicios del ecosistema DDD.
 * @param {string} targetUrl - URL completa del microservicio destino.
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE).
 * @param {Object} [body] - Cuerpo JSON opcional a enviar.
 * @returns {Promise<{ statusCode: number, data: Object }>} Respuesta del microservicio.
 */
function forwardToMicroservice(targetUrl, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(targetUrl);
    const payloadString = body && method !== 'GET' ? JSON.stringify(body) : null;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (payloadString) {
      options.headers['Content-Length'] = Buffer.byteLength(payloadString);
    }

    const proxyReq = http.request(options, (proxyRes) => {
      let responseRaw = '';
      proxyRes.on('data', (chunk) => {
        responseRaw += chunk;
      });
      proxyRes.on('end', () => {
        try {
          const parsed = responseRaw ? JSON.parse(responseRaw) : {};
          resolve({ statusCode: proxyRes.statusCode || 200, data: parsed });
        } catch (_err) {
          resolve({ statusCode: proxyRes.statusCode || 200, data: { raw: responseRaw } });
        }
      });
    });

    proxyReq.on('error', (err) => {
      reject(err);
    });

    if (payloadString) {
      proxyReq.write(payloadString);
    }
    proxyReq.end();
  });
}

/**
 * Envía una respuesta JSON al cliente móvil con cabeceras CORS habilitadas.
 * @param {import('http').ServerResponse} res - Respuesta HTTP.
 * @param {number} statusCode - Código de estado HTTP.
 * @param {Object} payload - Datos a enviar en JSON.
 */
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(payload));
}

/**
 * Orquesta el flujo principal de negocio de Visual RAG entre los microservicios:
 * 1. Obtiene la Ficha Postoperatoria subida por el doctor en Clinical-Orders-Service.
 * 2. Evalúa las fotos de la herida del paciente con el Dataset ML en Visual-RAG-Service.
 * 3. Recomienda los medicamentos e insumos a mejores precios en Pharmacy-Pricing-Service.
 * @param {Object} body - Datos de entrada del paciente (patientId, patientName, photos, postOpDay).
 * @returns {Promise<Object>} Resultado integrado con el reporte RAG y las ofertas de farmacia.
 */
async function orchestrateFullVisualRagEvaluation(body) {
  const patientId = body.patientId || 'pat-1';

  // Paso 1: Consultar la ficha postoperatoria prescrita por el médico cirujano
  const clinicalRes = await forwardToMicroservice(
    `${SERVICES.CLINICAL}/orders/${patientId}`,
    'GET'
  );
  const doctorTreatment = clinicalRes.data?.record || {};
  const postOpDay =
    body.postOpDay || doctorTreatment?.schedule?.currentDay || 79;

  // Paso 2: Evaluar la foto de la herida con el microservicio Visual RAG (Dataset ML)
  const ragRes = await forwardToMicroservice(`${SERVICES.RAG}/evaluate`, 'POST', {
    patientId,
    patientName: body.patientName || doctorTreatment.patientName || 'Nelson Steven Casa',
    postOpDay,
    photos: body.photos || ['Foto #1', 'Foto #2'],
    patientNotes: body.patientNotes || '',
    doctorTreatment,
  });

  const report = ragRes.data?.report;

  // Paso 3: Obtener la recomendación de medicamentos a mejores precios acorde al tratamiento y RAG
  const pharmacyRes = await forwardToMicroservice(
    `${SERVICES.PHARMACY}/recommendations`,
    'POST',
    {
      postOpDay,
      woundClassification: report?.diagnosisTitle || 'Cicatrización Normal',
      prescribedMedications:
        doctorTreatment.prescribedMedications || report?.recommendedMedications || [],
    }
  );

  return {
    report,
    doctorTreatment,
    pharmacyRecommendation: pharmacyRes.data,
  };
}

/**
 * Inicia el servidor HTTP del API Gateway en el puerto indicado.
 * @param {number} [port=4000] - Puerto del API Gateway.
 * @returns {import('http').Server} Instancia del servidor HTTP.
 */
function startApiGateway(port = process.env.GATEWAY_PORT || 4000) {
  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      return sendJson(res, 200, { ok: true });
    }

    const urlObj = new URL(req.url, `http://localhost:${port}`);
    const pathname = urlObj.pathname;
    const body = await parseRequestBody(req);

    try {
      // Endpoint Orquestador: Evaluación integral de herida (RAG + Tratamiento Médico + Mejores Precios)
      if (req.method === 'POST' && pathname === '/api/triage/evaluate-wound') {
        const result = await orchestrateFullVisualRagEvaluation(body);
        return sendJson(res, 201, result);
      }

      // Enrutamiento hacia Microservicio 1: Identity Service (/api/identity/*)
      if (pathname.startsWith('/api/identity')) {
        const subPath = pathname.replace('/api/identity', '') || '/';
        const response = await forwardToMicroservice(
          `${SERVICES.IDENTITY}${subPath}${urlObj.search}`,
          req.method,
          body
        );
        return sendJson(res, response.statusCode, response.data);
      }

      // Enrutamiento hacia Microservicio 2: Clinical Orders Service (/api/clinical/*)
      if (pathname.startsWith('/api/clinical')) {
        const subPath = pathname.replace('/api/clinical', '') || '/';
        const response = await forwardToMicroservice(
          `${SERVICES.CLINICAL}${subPath}${urlObj.search}`,
          req.method,
          body
        );
        return sendJson(res, response.statusCode, response.data);
      }

      // Enrutamiento hacia Microservicio 3: Visual RAG Service (/api/rag/*)
      if (pathname.startsWith('/api/rag')) {
        const subPath = pathname.replace('/api/rag', '') || '/';
        const response = await forwardToMicroservice(
          `${SERVICES.RAG}${subPath}${urlObj.search}`,
          req.method,
          body
        );
        return sendJson(res, response.statusCode, response.data);
      }

      // Enrutamiento hacia Microservicio 4: Pharmacy Pricing Service (/api/pharmacy/*)
      if (pathname.startsWith('/api/pharmacy')) {
        const subPath = pathname.replace('/api/pharmacy', '') || '/';
        const response = await forwardToMicroservice(
          `${SERVICES.PHARMACY}${subPath}${urlObj.search}`,
          req.method,
          body
        );
        return sendJson(res, response.statusCode, response.data);
      }

      // Health Check global de la arquitectura de microservicios
      if (req.method === 'GET' && pathname === '/health') {
        return sendJson(res, 200, {
          gateway: 'visual-rag-api-gateway',
          status: 'UP',
          microservices: SERVICES,
        });
      }

      return sendJson(res, 404, { error: `Ruta no encontrada en el API Gateway: ${pathname}` });
    } catch (error) {
      return sendJson(res, 502, {
        error: 'Error de comunicación en el API Gateway con los microservicios.',
        details: error.message,
      });
    }
  });

  server.listen(port, () => {
    console.log(`[API Gateway] Visual RAG Gateway escuchando en http://localhost:${port}`);
  });

  return server;
}

if (require.main === module) {
  startApiGateway();
}

module.exports = { startApiGateway };
