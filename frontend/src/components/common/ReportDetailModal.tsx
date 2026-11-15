import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import {
  OfficialRibbonIcon,
  WoundIncisionGraphic,
  VerifiedShieldIcon,
  DownloadPdfIcon,
} from '../icons/FigmaIcons';

export function ReportDetailModal(): React.JSX.Element | null {
  const { selectedReportForModal, setSelectedReportForModal, theme } = useApp();

  if (!selectedReportForModal) {
    return null;
  }

  function handleCloseModal(): void {
    setSelectedReportForModal(null);
  }

  function handleDownloadPdf(): void {
    if (!selectedReportForModal) return;
    Alert.alert(
      'Reporte Clínico en PDF',
      `El documento oficial ${selectedReportForModal.folio} de ${selectedReportForModal.patientName} (Día ${selectedReportForModal.postOpDay}) se ha generado y guardado correctamente en su dispositivo.`,
      [{ text: 'Entendido' }]
    );
  }

  const customUris = selectedReportForModal.photoUris || [];

  return (
    <Modal
      visible={Boolean(selectedReportForModal)}
      transparent
      animationType="fade"
      onRequestClose={handleCloseModal}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.modalSheet,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            { }
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalTitleGroup}>
                <View style={[styles.ribbonBadge, { backgroundColor: theme.primaryLight }]}>
                  <OfficialRibbonIcon />
                </View>
                <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
                  Reporte Clínico Oficial
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: theme.surfaceMuted }]}
                activeOpacity={0.75}
                onPress={handleCloseModal}
              >
                <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>
                  X
                </Text>
              </TouchableOpacity>
            </View>

            { }
            <View
              style={[
                styles.folioBox,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.folioCode, { color: theme.primary }]}>
                FOLIO: {selectedReportForModal.folio}
              </Text>
              <Text style={[styles.folioPatient, { color: theme.textPrimary }]}>
                Paciente: {selectedReportForModal.patientName}
              </Text>
              <Text style={[styles.folioDate, { color: theme.textSecondary }]}>
                Fecha: {selectedReportForModal.formattedDate} • Día {selectedReportForModal.postOpDay}
              </Text>
            </View>

            { }
            <View style={styles.photosRow}>
              { }
              <View style={styles.photoCard}>
                {customUris[0] && customUris[0].startsWith('http') ? (
                  <Image source={{ uri: customUris[0] }} style={styles.capturedImage} />
                ) : (
                  <View style={styles.graphicCenter}>
                    <WoundIncisionGraphic variant={1} />
                  </View>
                )}
                <View style={styles.photoLabelPill}>
                  <Text style={styles.photoLabelText}>Foto #1</Text>
                </View>
              </View>

              { }
              <View style={styles.photoCard}>
                {customUris[1] && customUris[1].startsWith('http') ? (
                  <Image source={{ uri: customUris[1] }} style={styles.capturedImage} />
                ) : (
                  <View style={styles.graphicCenter}>
                    <WoundIncisionGraphic variant={2} />
                  </View>
                )}
                <View style={styles.photoLabelPill}>
                  <Text style={styles.photoLabelText}>Foto #2</Text>
                </View>
              </View>
            </View>

            { }
            <Text style={[styles.sectionHeaderLabel, { color: theme.textSecondary }]}>
              EVALUACIÓN DE INCISIÓN
            </Text>

            <View
              style={[
                styles.evalBox,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.diagnosisTitle, { color: theme.textPrimary }]}>
                {selectedReportForModal.diagnosisTitle}
              </Text>
              <View style={styles.statusDotRow}>
                <View style={styles.emeraldDot} />
                <Text style={styles.statusRowText}>
                  Estado: {selectedReportForModal.statusBadge} • {selectedReportForModal.photosCount} fotos analizadas
                </Text>
              </View>
            </View>

            { }
            <Text style={[styles.sectionHeaderLabel, { color: theme.textSecondary }]}>
              SUGERENCIAS CLÍNICAS
            </Text>

            <View
              style={[
                styles.suggestionsBox,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.suggestionsText, { color: theme.textPrimary }]}>
                {selectedReportForModal.clinicalSuggestions}
              </Text>
            </View>

            { }
            <View
              style={[
                styles.verifiedBanner,
                {
                  backgroundColor: theme.primaryLight,
                  borderColor: theme.primary,
                },
              ]}
            >
              <VerifiedShieldIcon />
              <Text style={[styles.verifiedBannerText, { color: theme.primary }]}>
                {selectedReportForModal.verifiedSignature}
              </Text>
            </View>

            { }
            <TouchableOpacity
              style={[styles.downloadPdfButton, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
              onPress={handleDownloadPdf}
            >
              <DownloadPdfIcon color="#FFFFFF" />
              <Text style={styles.downloadPdfButtonText}>
                Descargar Reporte en PDF
              </Text>
            </TouchableOpacity>
          </ScrollView>

          { }
          <View style={styles.homeIndicatorContainer}>
            <View style={styles.homeIndicator} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    width: '100%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
    paddingHorizontal: 20,
    paddingBottom: 12,
    maxHeight: '92%',
  },
  scrollContent: {
    paddingBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ribbonBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  folioBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  folioCode: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  folioPatient: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  folioDate: {
    fontSize: 12,
    fontWeight: '500',
  },
  photosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  photoCard: {
    flex: 1,
    height: 130,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  graphicCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoLabelPill: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  photoLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  sectionHeaderLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  evalBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  diagnosisTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emeraldDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusRowText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  suggestionsBox: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  suggestionsText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  verifiedBanner: {
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifiedBannerText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 10,
  },
  downloadPdfButton: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  downloadPdfButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  homeIndicatorContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
  },
});
