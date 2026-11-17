class ClinicalOrdersController {

  constructor(useCases) {
    this.useCases = useCases;
  }

  async handleRequest(req, res, parsedBody, urlObj) {
    const pathname = urlObj.pathname;
    const method = req.method;

    try {

      if (method === 'GET' && pathname === '/orders') {
        const records = await this.useCases.listAllPostOpRecords();
        return this.sendJson(res, 200, { records });
      }

      const getMatch = pathname.match(/^\/orders\/([^/]+)$/);
      if (method === 'GET' && getMatch) {
        const patientId = getMatch[1];
        const record = await this.useCases.getPatientPostOpRecord(patientId);
        return this.sendJson(res, 200, { record });
      }

      if (method === 'PUT' && getMatch) {
        const patientId = getMatch[1];
        const updatedRecord = await this.useCases.savePatientPostOpRecord(patientId, parsedBody);
        return this.sendJson(res, 200, { record: updatedRecord });
      }

      if (method === 'DELETE' && getMatch) {
        const patientId = getMatch[1];
        const result = await this.useCases.deletePatientPostOpRecord(patientId);
        return this.sendJson(res, 200, result);
      }

      if (method === 'GET' && pathname === '/health') {
        return this.sendJson(res, 200, {
          service: 'clinical-orders-service',
          boundedContext: 'Postoperative Orders & Medical Care',
          status: 'UP',
        });
      }

      return this.sendJson(res, 404, {
        error: `Ruta no encontrada en clinical-orders-service: ${pathname}`,
      });
    } catch (error) {
      return this.sendJson(res, error.statusCode || 400, { error: error.message });
    }
  }

  sendJson(res, statusCode, payload) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end(JSON.stringify(payload));
  }
}

module.exports = { ClinicalOrdersController };
