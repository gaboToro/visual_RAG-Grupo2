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

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(JSON.stringify(payload));
}

async function orchestrateFullVisualRagEvaluation(body) {
  const patientId = body.patientId || 'pat-1';

  const clinicalRes = await forwardToMicroservice(
    `${SERVICES.CLINICAL}/orders/${patientId}`,
    'GET'
  );
  const doctorTreatment = clinicalRes.data?.record || {};
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
        const response = await forwardToMicroservice(
          `${SERVICES.PHARMACY}${subPath}${urlObj.search}`,
          req.method,
          body
        );
        return sendJson(res, response.statusCode, response.data);
      }

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
