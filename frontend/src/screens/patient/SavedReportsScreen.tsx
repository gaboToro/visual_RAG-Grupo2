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
import { WoundReportDTO } from '../../types';
import {
  RefreshIcon,
  SparklesAiIcon,
  DownloadPdfIcon,
} from '../../components/icons/FigmaIcons';

export function SavedReportsScreen(): React.JSX.Element {
  const { savedReports, setSelectedReportForModal, theme } = useApp();

  function handleOpenReportDetail(report: WoundReportDTO): void {
    setSelectedReportForModal(report);
  }

  function handleDownloadReportPdf(report: WoundReportDTO): void {
    Alert.alert(
      'Descargar PDF',
      `El reporte clínico ${report.folio} (${report.diagnosisTitle}) se ha descargado en formato PDF.`,
      [{ text: 'Aceptar' }]
    );
  }

  function handleRefreshReports(): void {
    Alert.alert(
      'Sincronizado',
      'Los reportes clínicos están actualizados con el servidor Visual RAG.'
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      { }
      <View style={styles.sectionHeaderRow}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Reportes Clínicos Guardados
        </Text>
        <TouchableOpacity
          style={[styles.refreshBtn, { backgroundColor: theme.primaryLight }]}
          activeOpacity={0.75}
          onPress={handleRefreshReports}
        >
          <RefreshIcon />
        </TouchableOpacity>
      </View>

      { }
      {savedReports.map((report) => (
        <View
          key={report.folio}
          style={[
            styles.reportCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          { }
          <View style={styles.cardTopRow}>
            <View style={[styles.folioPill, { backgroundColor: theme.surfaceMuted }]}>
              <Text style={[styles.folioPillText, { color: theme.textPrimary }]}>
                {report.folio}
              </Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: theme.emeraldLight }]}>
              <Text style={[styles.statusBadgeText, { color: theme.emerald }]}>
                {report.statusBadge}
              </Text>
            </View>
          </View>

          { }
          <Text style={[styles.diagnosisTitle, { color: theme.textPrimary }]}>
            {report.diagnosisTitle}
          </Text>
          <Text style={[styles.reportDateText, { color: theme.textSecondary }]}>
            Día {report.postOpDay} • {report.formattedDate}
          </Text>

          { }
          <View
            style={[
              styles.planBox,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.planTitleRow}>
              <SparklesAiIcon />
              <Text style={[styles.planTitleText, { color: theme.primary }]}>
                Plan Médico del Día:
              </Text>
            </View>
            <Text style={[styles.planStateText, { color: theme.textSecondary }]}>
              {report.medicalPlanHeader}
            </Text>
          </View>

          { }
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.downloadPdfBtn, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
              onPress={() => handleDownloadReportPdf(report)}
            >
              <DownloadPdfIcon color="#FFFFFF" />
              <Text style={styles.downloadPdfBtnText}>Descargar PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.viewDetailBtn,
                {
                  backgroundColor: theme.surface,
                  borderColor: '#CBD5E1',
                },
              ]}
              activeOpacity={0.85}
              onPress={() => handleOpenReportDetail(report)}
            >
              <Text style={[styles.viewDetailBtnText, { color: theme.textPrimary }]}>
                Ver Detalle
              </Text>
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
  sectionHeaderRow: {
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
  reportCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  folioPill: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folioPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  diagnosisTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  reportDateText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 12,
  },
  planBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  planTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  planTitleText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },
  planStateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  downloadPdfBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadPdfBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  viewDetailBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
