const http = require('http');
const { InMemoryUserRepository } = require('./infrastructure/persistence/InMemoryUserRepository');
const { IdentityUseCases } = require('./application/use-cases/IdentityUseCases');
const { IdentityController } = require('./infrastructure/http/IdentityController');

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
