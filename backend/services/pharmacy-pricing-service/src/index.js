/**
 * @file index.js
 * @description Punto de entrada del Microservicio 4: Pharmacy Pricing Service (Puerto 4004).
 * Recomienda medicamentos e insumos a mejores precios acorde al tratamiento médico y diagnóstico RAG.
 */

const http = require('http');
const {
  InMemoryMedicationRepository,
} = require('./infrastructure/persistence/InMemoryMedicationRepository');
const {
  BestPriceRecommenderService,
} = require('./domain/services/BestPriceRecommenderService');
const {
  PharmacyPricingUseCases,
} = require('./application/use-cases/PharmacyPricingUseCases');
const {
  PharmacyPricingController,
} = require('./infrastructure/http/PharmacyPricingController');

/**
 * Parsea el cuerpo JSON de una petición HTTP.
 * @param {import('http').IncomingMessage} req - Petición HTTP.
 * @returns {Promise<Object>} Cuerpo parseado.
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
 * Inicia el servidor HTTP para el microservicio de Farmacia y Precios.
 * @param {number} [port=4004] - Puerto de escucha.
 * @returns {import('http').Server} Instancia del servidor HTTP.
 */
function startPharmacyPricingService(port = process.env.PHARMACY_PORT || 4004) {
  const repository = new InMemoryMedicationRepository();
  const recommenderService = new BestPriceRecommenderService();
  const useCases = new PharmacyPricingUseCases(repository, recommenderService);
  const controller = new PharmacyPricingController(useCases);

  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      return controller.sendJson(res, 200, { ok: true });
    }
    const urlObj = new URL(req.url, `http://localhost:${port}`);
    const body = await parseRequestBody(req);
    await controller.handleRequest(req, res, body, urlObj);
  });

  server.listen(port, () => {
    console.log(`[DDD Microservice] Pharmacy-Pricing-Service activo en http://localhost:${port}`);
  });

  return server;
}

if (require.main === module) {
  startPharmacyPricingService();
}

module.exports = { startPharmacyPricingService };
