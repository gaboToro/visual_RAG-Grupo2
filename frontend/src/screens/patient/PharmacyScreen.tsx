import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { SparklesAiIcon, RefreshIcon } from '../../components/icons/FigmaIcons';
import {
  scrapeLiveMedicationsViaGateway,
  syncScrapedMedicationsViaGateway,
} from '../../services/apiClient';
import { RecommendedMedicationItemDTO } from '../../types';

const POPULAR_QUERIES = ['clorhexidina', 'gasa', 'tegaderm', 'paracetamol'];

export function PharmacyScreen(): React.JSX.Element {
  const { pharmacyData, refreshMedicalOrders, theme } = useApp();
  const comparison = pharmacyData.priceComparison;

  const [scrapeQuery, setScrapeQuery] = useState('clorhexidina');
  const [isScraping, setIsScraping] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [scrapedProducts, setScrapedProducts] = useState<RecommendedMedicationItemDTO[]>([]);
  const [scrapedStatusMsg, setScrapedStatusMsg] = useState<string | null>(null);

  async function handleRefreshPharmacy(): Promise<void> {
    const synced = await refreshMedicalOrders();
    Alert.alert(
      'Catálogo de Farmacia',
      synced
        ? 'Las ofertas y recomendaciones se han actualizado desde el microservicio de precios.'
        : 'Mostrando las mejores ofertas verificadas para su tratamiento actual.'
    );
  }

  async function handleTriggerScraper(targetTerm?: string): Promise<void> {
    const q = (targetTerm || scrapeQuery || 'clorhexidina').trim();
    setIsScraping(true);
    setScrapedStatusMsg(null);

    try {
      const result = await scrapeLiveMedicationsViaGateway(q);
      if (result && Array.isArray(result.items) && result.items.length > 0) {
        setScrapedProducts(result.items);
        setScrapedStatusMsg(
          `✅ ${result.items.length} productos obtenidos en vivo (${result.source})`
        );
        Alert.alert(
          'Scraper Web Finalizado',
          `Se extrajeron con éxito ${result.items.length} productos en tiempo real para "${q}".`
        );
      } else {
        setScrapedStatusMsg('No se obtuvieron resultados en la búsqueda web.');
        Alert.alert('Scraper Web', `No se encontraron ofertas web para "${q}".`);
      }
    } catch (_err) {
      Alert.alert('Error', 'No se pudo comunicar con el servicio de scraping.');
    } finally {
      setIsScraping(false);
    }
  }

  async function handleSyncScrapedToCatalog(): Promise<void> {
    if (scrapedProducts.length === 0) {
      Alert.alert('Sincronización', 'Primero ejecute una búsqueda con el scraper.');
      return;
    }
    setIsSyncing(true);
    try {
      const syncRes = await syncScrapedMedicationsViaGateway(scrapeQuery);
      if (syncRes) {
        await refreshMedicalOrders();
        Alert.alert(
          'Sincronización Exitosa',
          `Se incorporaron ${syncRes.syncedCount} medicamentos scrapeados al catálogo activo de la aplicación.`
        );
      }
    } catch (_err) {
      Alert.alert('Error', 'Error al sincronizar con el catálogo.');
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleOrderOnline(
    medicationName: string,
    pharmacyName: string,
    formattedPrice: string,
    url: string
  ): Promise<void> {
    Alert.alert(
      'Pedido en Farmacia Aliada',
      `¿Desea solicitar "${medicationName}" en ${pharmacyName} al mejor precio de ${formattedPrice}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ir a Farmacia Online',
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              }
            } catch {
              // fallback
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.topHeaderRow}>
        <View style={styles.topHeaderTitles}>
          <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>
            Farmacia & Insumos
          </Text>
          <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
            {pharmacyData.headerSubtitle}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.refreshBtn, { backgroundColor: theme.primaryLight }]}
          activeOpacity={0.75}
          onPress={handleRefreshPharmacy}
        >
          <RefreshIcon />
        </TouchableOpacity>
      </View>

      {/* AI Recovery Tip */}
      <View
        style={[
          styles.aiTipCard,
          {
            backgroundColor: theme.primaryLight,
            borderColor: theme.primary,
          },
        ]}
      >
        <View style={styles.aiTipTitleRow}>
          <View style={styles.aiIconCircle}>
            <SparklesAiIcon />
          </View>
          <Text style={[styles.aiTipTitle, { color: theme.primary }]}>
            {pharmacyData.aiRecoveryTip.title}
          </Text>
        </View>
        <Text style={[styles.aiTipSummary, { color: theme.textPrimary }]}>
          {pharmacyData.aiRecoveryTip.summary}
        </Text>
      </View>

      {/* Scraper Web en Vivo Card */}
      <View
        style={[
          styles.scraperCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.primary,
          },
        ]}
      >
        <View style={styles.scraperHeaderRow}>
          <Text style={[styles.scraperTitle, { color: theme.textPrimary }]}>
            📡 Scraper Web en Vivo (Fybeca & Cruz Azul)
          </Text>
          <View style={[styles.liveBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.liveBadgeText, { color: theme.primary }]}>ACTIVO</Text>
          </View>
        </View>
        <Text style={[styles.scraperDescription, { color: theme.textSecondary }]}>
          Extrae precios y productos en tiempo real consultando la web oficial de farmacias.
        </Text>

        {/* Quick query chips */}
        <View style={styles.chipsRow}>
          {POPULAR_QUERIES.map((q) => (
            <TouchableOpacity
              key={q}
              style={[
                styles.chipBtn,
                {
                  backgroundColor: scrapeQuery === q ? theme.primary : theme.background,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => {
                setScrapeQuery(q);
                handleTriggerScraper(q);
              }}
            >
              <Text
                style={[
                  styles.chipBtnText,
                  { color: scrapeQuery === q ? '#FFFFFF' : theme.textPrimary },
                ]}
              >
                {q.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search input & Scrape button */}
        <View style={styles.scraperInputRow}>
          <TextInput
            style={[
              styles.scraperInput,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.textPrimary,
              },
            ]}
            value={scrapeQuery}
            onChangeText={setScrapeQuery}
            placeholder="Medicamento a scrapear..."
            placeholderTextColor={theme.textSecondary}
          />
          <TouchableOpacity
            style={[styles.scrapeActionBtn, { backgroundColor: theme.primary }]}
            activeOpacity={0.8}
            onPress={() => handleTriggerScraper()}
            disabled={isScraping}
          >
            {isScraping ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.scrapeActionBtnText}>Scrapear</Text>
            )}
          </TouchableOpacity>
        </View>

        {Boolean(scrapedStatusMsg) && (
          <Text style={[styles.scrapedStatusText, { color: theme.emerald }]}>
            {scrapedStatusMsg}
          </Text>
        )}

        {/* Scraped items results list */}
        {scrapedProducts.length > 0 && (
          <View style={styles.scrapedResultsContainer}>
            <View style={styles.scrapedResultsHeader}>
              <Text style={[styles.scrapedResultsTitle, { color: theme.textPrimary }]}>
                Resultados Scrapeados ({scrapedProducts.length}):
              </Text>
              <TouchableOpacity
                style={[styles.syncBtn, { backgroundColor: theme.emerald }]}
                activeOpacity={0.8}
                onPress={handleSyncScrapedToCatalog}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.syncBtnText}>Incorporar al Catálogo</Text>
                )}
              </TouchableOpacity>
            </View>

            {scrapedProducts.slice(0, 4).map((p) => (
              <View
                key={p.id}
                style={[
                  styles.scrapedItemRow,
                  { backgroundColor: theme.background, borderColor: theme.border },
                ]}
              >
                <View style={styles.scrapedItemInfo}>
                  <Text style={[styles.scrapedItemName, { color: theme.textPrimary }]}>
                    {p.name}
                  </Text>
                  <Text style={[styles.scrapedItemSub, { color: theme.textSecondary }]}>
                    {p.pharmacyName} ({p.formattedPrice}) vs {p.alternativePharmacyName} (
                    {p.alternativeFormattedPrice})
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.scrapedBuyBtn, { backgroundColor: theme.primary }]}
                  onPress={() =>
                    handleOrderOnline(p.name, p.pharmacyName, p.formattedPrice, p.orderUrl)
                  }
                >
                  <Text style={styles.scrapedBuyBtnText}>Ver ↗</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Comparison Card (Figma Native) */}
      <View
        style={[
          styles.comparisonCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.comparisonHeaderRow}>
          <Text style={[styles.comparisonTitle, { color: theme.textPrimary }]}>
            Comparativa de Precios
          </Text>
          {Boolean(pharmacyData.totalSavingsLabel) && (
            <View style={[styles.totalSavingsPill, { backgroundColor: theme.emeraldLight }]}>
              <Text style={[styles.totalSavingsPillText, { color: theme.emerald }]}>
                {pharmacyData.totalSavingsLabel}
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.savingsSubtitle, { color: theme.emerald }]}>
          {comparison.savingsLabel} ({comparison.medicationName})
        </Text>

        <View style={styles.offersRow}>
          <View
            style={[
              styles.bestOfferBox,
              {
                backgroundColor: theme.emeraldLight,
                borderColor: '#10B981',
              },
            ]}
          >
            <Text style={[styles.offerPharmacyName, { color: theme.emerald }]}>
              {comparison.bestOffer.pharmacyName}
            </Text>
            <Text style={[styles.offerPriceText, { color: theme.textPrimary }]}>
              {comparison.bestOffer.formattedPrice}
            </Text>
            <Text style={[styles.offerBadgeText, { color: theme.emerald }]}>
              {comparison.bestOffer.badgeLabel}
            </Text>
          </View>

          <View
            style={[
              styles.altOfferBox,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.offerPharmacyName, { color: theme.textSecondary }]}>
              {comparison.alternativeOffer.pharmacyName}
            </Text>
            <Text style={[styles.offerPriceText, { color: theme.textPrimary }]}>
              {comparison.alternativeOffer.formattedPrice}
            </Text>
            <Text style={[styles.offerBadgeText, { color: theme.textSecondary }]}>
              {comparison.alternativeOffer.badgeLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Recommended Items List */}
      {pharmacyData.recommendedItems.map((item) => (
        <View
          key={item.id}
          style={[
            styles.medCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.medTopRow}>
            <View style={[styles.medPlusIconBox, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.medPlusSign, { color: theme.primary }]}>+</Text>
            </View>
            <View style={styles.medInfoCol}>
              <Text style={[styles.medName, { color: theme.textPrimary }]} numberOfLines={2}>
                {item.name}
              </Text>
              {Boolean(item.category) && (
                <Text style={[styles.medCategory, { color: theme.primary }]} numberOfLines={1}>
                  {item.category.toUpperCase()}
                </Text>
              )}
              <Text style={[styles.medSubtitle, { color: theme.textSecondary }]}>
                {item.subtitle}
              </Text>
            </View>
          </View>

          <View style={styles.medBottomRow}>
            <Text style={[styles.medPrice, { color: theme.textPrimary }]}>
              {item.formattedPrice}
            </Text>
            <TouchableOpacity
              style={[styles.orderButton, { backgroundColor: theme.primary }]}
              activeOpacity={0.8}
              onPress={() =>
                handleOrderOnline(item.name, item.pharmacyName, item.formattedPrice, item.orderUrl)
              }
            >
              <Text style={styles.orderButtonText}>Pedir Online ↗</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  topHeaderTitles: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  aiTipCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  aiTipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  aiTipTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  aiTipSummary: {
    fontSize: 12,
    lineHeight: 18,
  },
  scraperCard: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  scraperHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scraperTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  liveBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  scraperDescription: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  chipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipBtnText: {
    fontSize: 10,
    fontWeight: '700',
  },
  scraperInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  scraperInput: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 12,
  },
  scrapeActionBtn: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrapeActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrapedStatusText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 8,
  },
  scrapedResultsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  scrapedResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scrapedResultsTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  syncBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  scrapedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },
  scrapedItemInfo: {
    flex: 1,
    marginRight: 8,
  },
  scrapedItemName: {
    fontSize: 11,
    fontWeight: '700',
  },
  scrapedItemSub: {
    fontSize: 10,
    marginTop: 2,
  },
  scrapedBuyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scrapedBuyBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  comparisonCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  comparisonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalSavingsPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  totalSavingsPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  savingsSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 12,
  },
  offersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  bestOfferBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  altOfferBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  offerPharmacyName: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  offerPriceText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  offerBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  medCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  medTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medPlusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medPlusSign: {
    fontSize: 22,
    fontWeight: '700',
  },
  medInfoCol: {
    flex: 1,
  },
  medName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  medCategory: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  medSubtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  medBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  orderButton: {
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
