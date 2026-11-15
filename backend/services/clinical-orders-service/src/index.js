const http = require('http');
const {
  InMemoryPostOpRecordRepository,
} = require('./infrastructure/persistence/InMemoryPostOpRecordRepository');
const { ClinicalOrdersUseCases } = require('./application/use-cases/ClinicalOrdersUseCases');
const { ClinicalOrdersController } = require('./infrastructure/http/ClinicalOrdersController');

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

function startClinicalOrdersService(port = process.env.CLINICAL_PORT || 4002) {
  const repository = new InMemoryPostOpRecordRepository();
  const useCases = new ClinicalOrdersUseCases(repository);
  const controller = new ClinicalOrdersController(useCases);

  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      return controller.sendJson(res, 200, { ok: true });
    }
    const urlObj = new URL(req.url, `http://localhost:${port}`);
    const body = await parseRequestBody(req);
    await controller.handleRequest(req, res, body, urlObj);
  });

  server.listen(port, () => {
    console.log(`[DDD Microservice] Clinical-Orders-Service activo en http://localhost:${port}`);
  });

  return server;
}

if (require.main === module) {
  startClinicalOrdersService();
}

module.exports = { startClinicalOrdersService };
