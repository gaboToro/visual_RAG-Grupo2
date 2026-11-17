import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import {
  RefreshIcon,
  SurgeryCalendarIcon,
  ProhibitedActionIcon,
  AllowedCareIcon,
  AlertTriangleIcon,
} from '../../components/icons/FigmaIcons';

export function MedicalOrdersScreen(): React.JSX.Element {
  const {
    currentUser,
    postOpRecords,
    refreshMedicalOrders,
    setActivePatientTab,
    theme,
  } = useApp();

  const patientId = currentUser?.id || 'pat-1';
  const record = postOpRecords[patientId] || postOpRecords['pat-1'];
  const {
    schedule,
    prohibitedActions,
    allowedCares,
    allergiesAndAlerts = [],
    prescribedMedications = [],
  } = record;

  async function handleRefreshOrders(): Promise<void> {
    const synced = await refreshMedicalOrders();
    Alert.alert(
      'Órdenes Médicas Actualizadas',
      synced
        ? `Se han sincronizado las indicaciones quirúrgicas de "${schedule.procedureName}" con el servidor.`
        : `Indicaciones quirúrgicas de "${schedule.procedureName}" verificadas.`
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      { }
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Órdenes de Recuperación
        </Text>
        <TouchableOpacity
          style={[styles.refreshBtn, { backgroundColor: theme.primaryLight }]}
          activeOpacity={0.75}
          onPress={handleRefreshOrders}
        >
          <RefreshIcon />
        </TouchableOpacity>
      </View>

      { }
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.surgeryHeaderRow}>
          <View style={styles.surgeryHeaderLeft}>
            <SurgeryCalendarIcon size={38} />
            <View style={styles.surgeryTitleBlock}>
              <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
                {schedule.procedureName}
              </Text>
              <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>
                Inicio: {schedule.surgeryDate}
              </Text>
            </View>
          </View>

          <View style={[styles.percentBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.percentBadgeText, { color: theme.primary }]}>
              {schedule.completionPercentage}%
            </Text>
          </View>
        </View>

        { }
        <View style={[styles.progressTrack, { backgroundColor: theme.surfaceMuted }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.primary,
                width: `${Math.min(100, schedule.completionPercentage)}%`,
              },
            ]}
          />
        </View>

        { }
        <View style={styles.metricsRow}>
          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              DÍA ACTUAL
            </Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
              Día {schedule.currentDay}
            </Text>
          </View>

          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              REPOSO TOTAL
            </Text>
            <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
              {schedule.totalRestDays} Días
            </Text>
          </View>

          <View
            style={[
              styles.metricBox,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>
              DÍAS RESTANTES
            </Text>
            <Text style={[styles.metricValue, { color: theme.primary }]}>
              {schedule.remainingDays} Días
            </Text>
          </View>
        </View>
      </View>

      { }
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.cardHeaderIconRow}>
          <ProhibitedActionIcon size={38} />
          <Text style={[styles.cardSectionTitle, { color: theme.textPrimary }]}>
            Acciones Prohibidas
          </Text>
        </View>

        {prohibitedActions.map((action, idx) => (
          <View
            key={`prohibited-${idx}`}
            style={[
              styles.indicationItemBox,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={[styles.bulletDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.indicationText, { color: theme.textPrimary }]}>
              {action}
            </Text>
          </View>
        ))}
      </View>

      { }
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.cardHeaderIconRow}>
          <AllowedCareIcon size={38} />
          <Text style={[styles.cardSectionTitle, { color: theme.textPrimary }]}>
            Cuidados Permitidos
          </Text>
        </View>

        {allowedCares.map((care, idx) => (
          <View
            key={`care-${idx}`}
            style={[
              styles.indicationItemBox,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={[styles.bulletDot, { backgroundColor: theme.primary }]} />
            <Text style={[styles.indicationText, { color: theme.textPrimary }]}>
              {care}
            </Text>
          </View>
        ))}
      </View>

      {allergiesAndAlerts.length > 0 && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.dangerBorder,
            },
          ]}
        >
          <View style={styles.cardHeaderIconRow}>
            <AlertTriangleIcon size={38} />
            <Text style={[styles.cardSectionTitle, { color: theme.textPrimary }]}>
              Signos de Alerta y Alergias
            </Text>
          </View>

          {allergiesAndAlerts.map((alertText, idx) => (
            <View
              key={`alert-${idx}`}
              style={[
                styles.indicationItemBox,
                {
                  backgroundColor: theme.dangerLight,
                  borderColor: theme.dangerBorder,
                },
              ]}
            >
              <View style={[styles.bulletDot, { backgroundColor: theme.danger }]} />
              <Text style={[styles.indicationText, { color: theme.textPrimary }]}>
                {alertText}
              </Text>
            </View>
          ))}
        </View>
      )}

      {prescribedMedications.length > 0 && (
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.medsHeaderRow}>
            <Text style={[styles.medsSectionTitle, { color: theme.textPrimary }]}>
              Insumos y Medicamentos Recetados
            </Text>
            <TouchableOpacity
              style={[styles.goPharmacyBtn, { backgroundColor: theme.primaryLight }]}
              activeOpacity={0.8}
              onPress={() => setActivePatientTab('PHARMACY')}
            >
              <Text style={[styles.goPharmacyBtnText, { color: theme.primary }]}>
                Ver Precios ↗
              </Text>
            </TouchableOpacity>
          </View>

          {prescribedMedications.map((med, idx) => (
            <View
              key={`rx-${idx}`}
              style={[
                styles.indicationItemBox,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={[styles.bulletDot, { backgroundColor: theme.emerald }]} />
              <Text style={[styles.indicationText, { color: theme.textPrimary }]}>
                {med}
              </Text>
            </View>
          ))}
        </View>
      )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  refreshBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  surgeryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  surgeryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surgeryTitleBlock: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  percentBadge: {
    width: 44,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardHeaderIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 12,
  },
  indicationItemBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    marginRight: 10,
  },
  indicationText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
  medsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  medsSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  goPharmacyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  goPharmacyBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
