class VisualRagController {

  constructor(useCases) {
    this.useCases = useCases;
  }

  async handleRequest(req, res, parsedBody, urlObj) {
    const pathname = urlObj.pathname;
    const method = req.method;

    try {

      if (method === 'POST' && pathname === '/evaluate') {
        const report = await this.useCases.evaluatePatientWoundPhotos(parsedBody);
        return this.sendJson(res, 201, { report });
      }

      const patientMatch = pathname.match(/^\/reports\/patient\/([^/]+)$/);
      if (method === 'GET' && patientMatch) {
        const patientId = patientMatch[1];
        const reports = await this.useCases.getSavedReportsByPatient(patientId);
        return this.sendJson(res, 200, { reports });
      }

      const folioMatch = pathname.match(/^\/reports\/folio\/([^/]+)$/);
      if (method === 'GET' && folioMatch) {
        const folio = folioMatch[1];
        const report = await this.useCases.getReportDetailByFolio(folio);
        return this.sendJson(res, 200, { report });
      }

      if (method === 'GET' && pathname === '/health') {
        return this.sendJson(res, 200, {
          service: 'visual-rag-service',
          boundedContext: 'Visual RAG & ML Wound Evaluation',
          status: 'UP',
        });
      }

      return this.sendJson(res, 404, {
        error: `Ruta no encontrada en visual-rag-service: ${pathname}`,
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

module.exports = { VisualRagController };
