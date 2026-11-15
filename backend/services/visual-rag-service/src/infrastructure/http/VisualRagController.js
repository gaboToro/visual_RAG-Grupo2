/**
 * @file VisualRagController.js
 * @description Controlador HTTP (Infrastructure Layer - DDD) del microservicio Visual RAG.
 * Expone los endpoints para evaluar fotos de heridas con ML/RAG y consultar reportes guardados.
 */

class VisualRagController {
  /**
   * Inicializa el controlador inyectando los casos de uso de Visual RAG.
   * @param {import('../../application/use-cases/VisualRagUseCases').VisualRagUseCases} useCases
   */
  constructor(useCases) {
    this.useCases = useCases;
  }

  /**
   * Enruta las peticiones HTTP entrantes hacia el caso de uso correspondiente.
   * @param {import('http').IncomingMessage} req - Petición HTTP.
   * @param {import('http').ServerResponse} res - Respuesta HTTP.
   * @param {Object} parsedBody - Cuerpo JSON analizado.
   * @param {URL} urlObj - Objeto URL.
   */
  async handleRequest(req, res, parsedBody, urlObj) {
    const pathname = urlObj.pathname;
    const method = req.method;

    try {
      // POST /evaluate -> Evalúa de 1 a 4 fotos de la herida con el Dataset ML (RAG)
      if (method === 'POST' && pathname === '/evaluate') {
        const report = await this.useCases.evaluatePatientWoundPhotos(parsedBody);
        return this.sendJson(res, 201, { report });
      }

      // GET /reports/patient/:patientId -> Lista los reportes clínicos guardados del paciente
      const patientMatch = pathname.match(/^\/reports\/patient\/([^/]+)$/);
      if (method === 'GET' && patientMatch) {
        const patientId = patientMatch[1];
        const reports = await this.useCases.getSavedReportsByPatient(patientId);
        return this.sendJson(res, 200, { reports });
      }

      // GET /reports/folio/:folio -> Obtiene el detalle de un reporte clínico específico
      const folioMatch = pathname.match(/^\/reports\/folio\/([^/]+)$/);
      if (method === 'GET' && folioMatch) {
        const folio = folioMatch[1];
        const report = await this.useCases.getReportDetailByFolio(folio);
        return this.sendJson(res, 200, { report });
      }

      // GET /health -> Estado del microservicio
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

  /**
   * Envía una respuesta JSON con cabeceras CORS configuradas.
   * @param {import('http').ServerResponse} res - Respuesta HTTP.
   * @param {number} statusCode - Código de estado HTTP.
   * @param {Object} payload - Cuerpo JSON.
   */
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
