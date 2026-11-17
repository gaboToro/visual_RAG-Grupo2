import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { SparklesAiIcon, RefreshIcon } from '../../components/icons/FigmaIcons';

export function PharmacyScreen(): React.JSX.Element {
  const { pharmacyData, refreshMedicalOrders, theme } = useApp();
  const comparison = pharmacyData.priceComparison;

  async function handleRefreshPharmacy(): Promise<void> {
    const synced = await refreshMedicalOrders();
    Alert.alert(
      'Catálogo de Farmacia',
      synced
        ? 'Las ofertas y recomendaciones se han actualizado desde el microservicio de precios.'
        : 'Mostrando las mejores ofertas verificadas para su tratamiento actual.'
    );
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
      { }
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

      { }
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

      { }
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
          { }
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

          { }
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

      { }
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
              <Text style={[styles.medName, { color: theme.textPrimary }]}>
                {item.name}
              </Text>
              {Boolean(item.category) && (
                <Text style={[styles.medCategory, { color: theme.primary }]}>
                  {item.category}
                </Text>
              )}
              <Text style={[styles.medSubtitle, { color: theme.textSecondary }]}>
                {item.subtitle}
                {item.alternativePharmacyName && item.alternativeFormattedPrice
                  ? ` • En ${item.alternativePharmacyName}: ${item.alternativeFormattedPrice}`
                  : ''}
              </Text>
            </View>
          </View>

          <View style={styles.medBottomRow}>
            <Text style={[styles.medPrice, { color: theme.textPrimary }]}>
              {item.formattedPrice}
            </Text>

            <TouchableOpacity
              style={[styles.orderButton, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
              onPress={() =>
                handleOrderOnline(
                  item.name,
                  item.pharmacyName,
                  item.formattedPrice,
                  item.orderUrl
                )
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
    paddingTop: 18,
    paddingBottom: 28,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  topHeaderTitles: {
    flex: 1,
    marginRight: 10,
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  aiTipCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  aiTipTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  aiTipTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  aiTipSummary: {
    fontSize: 12,
    fontWeight: '500',
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
