const { FybecaPharmacyScraper } = require('./FybecaPharmacyScraper');

async function main() {
  const query = process.argv[2] || 'clorhexidina';
  console.log('==============================================================');
  console.log(`  EJECUTANDO SCRAPER WEB DE FARMACIAS EN VIVO (DDD)           `);
  console.log(`  Buscando en tiempo real: "${query}"                        `);
  console.log('==============================================================');

  const scraper = new FybecaPharmacyScraper();
  const startTime = Date.now();
  const products = await scraper.scrapeLiveProducts(query);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n✅ Scraper finalizado en ${duration}s. Resultados encontrados: ${products.length}\n`);

  products.forEach((p, idx) => {
    const dto = p.toRecommendedItemDTO();
    console.log(`[${idx + 1}] ${dto.name}`);
    console.log(`    Categoría:     ${dto.category}`);
    console.log(`    Mejor Oferta:  ${dto.pharmacyName} -> ${dto.formattedPrice} (${dto.deliveryInfo})`);
    console.log(`    Comparativa:   ${dto.alternativePharmacyName} -> ${dto.alternativeFormattedPrice}`);
    console.log(`    Ahorro:        $${dto.savingsAmount.toFixed(2)}`);
    console.log(`    Enlace Compra: ${dto.orderUrl}`);
    console.log('--------------------------------------------------------------');
  });
}

main().catch((err) => {
  console.error('Error en ejecución de scraper:', err);
  process.exit(1);
});
