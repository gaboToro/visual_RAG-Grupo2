class PharmacyPricingController {

  constructor(useCases) {
    this.useCases = useCases;
  }

  async handleRequest(req, res, parsedBody, urlObj) {
    const pathname = urlObj.pathname;
    const method = req.method;

    try {

      if ((method === 'GET' || method === 'POST') && pathname === '/recommendations') {
        const postOpDay = Number(urlObj.searchParams.get('postOpDay')) || parsedBody.postOpDay || 79;
        const woundClassification =
          urlObj.searchParams.get('woundClassification') ||
          parsedBody.woundClassification ||
          'Cicatrización Normal';
        const prescribedMedications = parsedBody.prescribedMedications || [];

        const data = await this.useCases.getRecommendationsForPatient({
          postOpDay,
          woundClassification,
          prescribedMedications,
        });
        return this.sendJson(res, 200, data);
      }

      if (method === 'GET' && pathname === '/catalog') {
        const q = urlObj.searchParams.get('q') || '';
        const items = await this.useCases.getFullCatalog(q);
        return this.sendJson(res, 200, { items });
      }

      if ((method === 'GET' || method === 'POST') && pathname === '/scrape') {
        const q = urlObj.searchParams.get('q') || parsedBody.q || 'clorhexidina';
        const result = await this.useCases.scrapeLivePrices(q);
        return this.sendJson(res, 200, result);
      }

      if ((method === 'GET' || method === 'POST') && pathname === '/scrape-sync') {
        const q = urlObj.searchParams.get('q') || parsedBody.q || 'clorhexidina';
        const result = await this.useCases.syncLivePricesToCatalog(q);
        return this.sendJson(res, 200, result);
      }

      if (method === 'GET' && pathname === '/health') {
        return this.sendJson(res, 200, {
          service: 'pharmacy-pricing-service',
          boundedContext: 'Pharmacy & Best-Price Medication Recommendations',
          status: 'UP',
        });
      }

      return this.sendJson(res, 404, {
        error: `Ruta no encontrada en pharmacy-pricing-service: ${pathname}`,
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

module.exports = { PharmacyPricingController };
