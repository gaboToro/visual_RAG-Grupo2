/**
 * @file index.js
 * @description Punto de entrada del Microservicio 2: Clinical Orders Service (Puerto 4002).
 * Gestiona el Contexto Delimitado (Bounded Context) de Fichas Postoperatorias y Órdenes de Recuperación.
 */

const http = require('http');
const {
  InMemoryPostOpRecordRepository,
} = require('./infrastructure/persistence/InMemoryPostOpRecordRepository');
const { ClinicalOrdersUseCases } = require('./application/use-cases/ClinicalOrdersUseCases');
const { ClinicalOrdersController } = require('./infrastructure/http/ClinicalOrdersController');

/**
 * Parsea el cuerpo JSON de una petición HTTP entrante.
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
 * Levanta el servidor HTTP para el microservicio de Órdenes Clínicas.
 * @param {number} [port=4002] - Puerto de escucha.
 * @returns {import('http').Server} Instancia del servidor HTTP.
 */
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
