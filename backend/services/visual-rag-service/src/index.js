const http = require('http');
const { PostOpWoundDataset } = require('./infrastructure/dataset/PostOpWoundDataset');
const {
  InMemoryWoundReportRepository,
} = require('./infrastructure/persistence/InMemoryWoundReportRepository');
const { WoundRagEvaluatorService } = require('./domain/services/WoundRagEvaluatorService');
const { VisualRagUseCases } = require('./application/use-cases/VisualRagUseCases');
const { VisualRagController } = require('./infrastructure/http/VisualRagController');

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

function startVisualRagService(port = process.env.RAG_PORT || 4003) {
  const dataset = new PostOpWoundDataset();
  const repository = new InMemoryWoundReportRepository();
  const evaluatorService = new WoundRagEvaluatorService(dataset);
  const useCases = new VisualRagUseCases(repository, evaluatorService);
  const controller = new VisualRagController(useCases);

  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      return controller.sendJson(res, 200, { ok: true });
    }
    const urlObj = new URL(req.url, `http://localhost:${port}`);
    const body = await parseRequestBody(req);
    await controller.handleRequest(req, res, body, urlObj);
  });

  server.listen(port, () => {
    console.log(`[DDD Microservice] Visual-RAG-Service activo en http://localhost:${port}`);
  });

  return server;
}

if (require.main === module) {
  startVisualRagService();
}

module.exports = { startVisualRagService };
