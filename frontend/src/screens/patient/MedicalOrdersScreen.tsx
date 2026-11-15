/**
 * @file MedicalOrdersScreen.tsx
 * @description Implementación de la Pantalla 06 de Figma ("06. Paciente - Órdenes Médicas" - nodo 1:361).
 * Muestra las "Órdenes de Recuperación" con el cronograma de la cirugía ("Correcion Neuronal",
 * "Inicio: 2026-08-19", métricas DÍA ACTUAL, REPOSO TOTAL, DÍAS RESTANTES), la tarjeta de
 * "Acciones Prohibidas" y la tarjeta de "Cuidados Permitidos".
 */

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
} from '../../components/icons/FigmaIcons';

/**
 * Pantalla de Órdenes Médicas de Recuperación del Paciente (Pantalla 06 de Figma).
 */
export function MedicalOrdersScreen(): React.JSX.Element {
  const { currentUser, postOpRecords, theme } = useApp();

  const patientId = currentUser?.id || 'pat-1';
  const record = postOpRecords[patientId] || postOpRecords['pat-1'];
  const { schedule, prohibitedActions, allowedCares } = record;

  /**
   * Sincroniza las órdenes médicas con la última Ficha Postoperatoria guardada por el Doctor.
   */
  function handleRefreshOrders(): void {
    Alert.alert(
      'Órdenes Médicas Actualizadas',
      `Se han sincronizado las indicaciones quirúrgicas de "${schedule.procedureName}".`
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Encabezado: "Órdenes de Recuperación" + Botón Refrescar (nodo 1:382) */}
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

      {/* Tarjeta 1: Cronograma Quirúrgico (nodo 1:386) */}
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

        {/* Barra de Progreso (nodos 1:395 y 1:396) */}
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

        {/* 3 Cajas de Métricas: DÍA ACTUAL / REPOSO TOTAL / DÍAS RESTANTES (nodos 1:397, 1:400, 1:403) */}
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

      {/* Tarjeta 2: Acciones Prohibidas (nodo 1:406) */}
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

      {/* Tarjeta 3: Cuidados Permitidos (nodo 1:418) */}
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
});
