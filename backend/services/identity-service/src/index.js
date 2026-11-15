/**
 * @file index.js
 * @description Punto de entrada del Microservicio 1: Identity Service (Puerto 4001).
 * Ensambla las capas de Dominio, Aplicación e Infraestructura siguiendo Domain-Driven Design (DDD).
 */

const http = require('http');
const { InMemoryUserRepository } = require('./infrastructure/persistence/InMemoryUserRepository');
const { IdentityUseCases } = require('./application/use-cases/IdentityUseCases');
const { IdentityController } = require('./infrastructure/http/IdentityController');

/**
 * Parsea el cuerpo JSON de una petición HTTP de forma asíncrona.
 * @param {import('http').IncomingMessage} req - Petición HTTP.
 * @returns {Promise<Object>} Cuerpo parseado como objeto JSON.
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
 * Inicializa y levanta el servidor HTTP para el microservicio de Identidad.
 * @param {number} [port=4001] - Puerto donde escuchará el microservicio.
 * @returns {import('http').Server} Instancia del servidor HTTP.
 */
function startIdentityService(port = process.env.IDENTITY_PORT || 4001) {
  const userRepository = new InMemoryUserRepository();
  const identityUseCases = new IdentityUseCases(userRepository);
  const controller = new IdentityController(identityUseCases);

  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      return controller.sendJson(res, 200, { ok: true });
    }
    const urlObj = new URL(req.url, `http://localhost:${port}`);
    const body = await parseRequestBody(req);
    await controller.handleRequest(req, res, body, urlObj);
  });

  server.listen(port, () => {
    console.log(`[DDD Microservice] Identity-Service activo en http://localhost:${port}`);
  });

  return server;
}

if (require.main === module) {
  startIdentityService();
}

module.exports = { startIdentityService };
