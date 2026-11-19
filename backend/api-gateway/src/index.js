const http = require('http');

const SERVICES = {
  IDENTITY: process.env.IDENTITY_URL || 'http://localhost:4001',
  CLINICAL: process.env.CLINICAL_URL || 'http://localhost:4002',
  RAG: process.env.RAG_URL || 'http://localhost:4003',
  PHARMACY: process.env.PHARMACY_URL || 'http://localhost:4004',
};

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

function forwardToMicroservice(targetUrl, method = 'GET', body = null, timeoutMs = 3500) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(targetUrl);
    const payloadString = body && method !== 'GET' ? JSON.stringify(body) : null;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method,
      timeout: timeoutMs,
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

    proxyReq.on('timeout', () => {
      proxyReq.destroy(new Error(`Tiempo de espera agotado al contactar ${targetUrl}`));
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

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(payload));
}

async function checkAllMicroservicesHealth() {
  const entries = Object.entries(SERVICES);
  const checks = await Promise.allSettled(
    entries.map(async ([key, baseUrl]) => {
      const res = await forwardToMicroservice(`${baseUrl}/health`, 'GET', null, 1500);
      return {
        key,
        url: baseUrl,
        status: res.statusCode === 200 ? 'UP' : 'DEGRADED',
      };
    })
  );

  const serviceStatuses = {};
  for (let i = 0; i < entries.length; i++) {
    const [key, baseUrl] = entries[i];
    const check = checks[i];
    serviceStatuses[key] =
      check.status === 'fulfilled'
        ? { url: baseUrl, status: check.value.status }
        : { url: baseUrl, status: 'DOWN' };
  }
  return serviceStatuses;
}

async function orchestrateFullVisualRagEvaluation(body) {
  const patientId = body.patientId || 'pat-1';

  let doctorTreatment = {};
  try {
    const clinicalRes = await forwardToMicroservice(
      `${SERVICES.CLINICAL}/orders/${patientId}`,
      'GET'
    );
    doctorTreatment = clinicalRes.data?.record || {};
  } catch (_err) {
    doctorTreatment = {};
  }

  const postOpDay =
    body.postOpDay || doctorTreatment?.schedule?.currentDay || 79;

  const ragRes = await forwardToMicroservice(`${SERVICES.RAG}/evaluate`, 'POST', {
    patientId,
    patientName: body.patientName || doctorTreatment.patientName || 'Nelson Steven Casa',
    postOpDay,
    photos: body.photos || ['Foto #1', 'Foto #2'],
    patientNotes: body.patientNotes || '',
    doctorTreatment,
  });

  const report = ragRes.data?.report;

  let pharmacyRecommendation = null;
  try {
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
    pharmacyRecommendation = pharmacyRes.data;
  } catch (_err) {
    pharmacyRecommendation = null;
  }

  return {
    report,
    doctorTreatment,
    pharmacyRecommendation,
  };
}

function startApiGateway(port = process.env.GATEWAY_PORT || 4000) {
  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      return sendJson(res, 200, { ok: true });
    }

    const urlObj = new URL(req.url, `http://localhost:${port}`);
    const pathname = urlObj.pathname;
    const body = await parseRequestBody(req);

    try {

      if (req.method === 'POST' && pathname === '/api/triage/evaluate-wound') {
        const result = await orchestrateFullVisualRagEvaluation(body);
        return sendJson(res, 201, result);
      }

      if (pathname.startsWith('/api/identity')) {
        const subPath = pathname.replace('/api/identity', '') || '/';
        const response = await forwardToMicroservice(
          `${SERVICES.IDENTITY}${subPath}${urlObj.search}`,
          req.method,
          body
        );
        const deletePatientMatch = subPath.match(/^\/patients\/([^/]+)$/);
        if (req.method === 'DELETE' && deletePatientMatch && response.statusCode === 200) {
          forwardToMicroservice(
            `${SERVICES.CLINICAL}/orders/${deletePatientMatch[1]}`,
            'DELETE'
          ).catch(() => {});
        }
        return sendJson(res, response.statusCode, response.data);
      }

      if (pathname.startsWith('/api/clinical')) {
        const subPath = pathname.replace('/api/clinical', '') || '/';
        const response = await forwardToMicroservice(
          `${SERVICES.CLINICAL}${subPath}${urlObj.search}`,
          req.method,
          body
        );
        return sendJson(res, response.statusCode, response.data);
      }

      if (pathname.startsWith('/api/rag')) {
        const subPath = pathname.replace('/api/rag', '') || '/';
        const response = await forwardToMicroservice(
          `${SERVICES.RAG}${subPath}${urlObj.search}`,
          req.method,
          body
        );
        return sendJson(res, response.statusCode, response.data);
      }

      if (pathname.startsWith('/api/pharmacy')) {
        const subPath = pathname.replace('/api/pharmacy', '') || '/';
        const timeoutMs = subPath.includes('scrape') ? 12000 : 4500;
        const response = await forwardToMicroservice(
          `${SERVICES.PHARMACY}${subPath}${urlObj.search}`,
          req.method,
          body,
          timeoutMs
        );
        return sendJson(res, response.statusCode, response.data);
      }

      if (req.method === 'GET' && pathname === '/health') {
        const serviceStatuses = await checkAllMicroservicesHealth();
        return sendJson(res, 200, {
          gateway: 'visual-rag-api-gateway',
          status: 'UP',
          microservices: SERVICES,
          serviceStatuses,
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
