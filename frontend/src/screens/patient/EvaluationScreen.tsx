/**
 * @file EvaluationScreen.tsx
 * @description Implementación de la Pantalla 02 de Figma ("02. Paciente - Evaluación" - nodo 1:49).
 * Muestra la tarjeta de progreso quirúrgico ("Correcion Neuronal", "Reposo: Día 79 de 10", "100%")
 * y la tarjeta de captura ("Tomar Fotografía", "Puedes ingresar de 1 a 4 fotos de tu incisión",
 * botones "Abrir Cámara" y "Galería") conectada al motor Visual RAG.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../../context/AppContext';
import {
  PulseSurgeryIcon,
  LargeCameraCircleIcon,
  SmallCameraIcon,
  GalleryIcon,
  WoundIncisionGraphic,
} from '../../components/icons/FigmaIcons';

/**
 * Pantalla de Evaluación Postoperatoria del Paciente (Pantalla 02 de Figma).
 */
export function EvaluationScreen(): React.JSX.Element {
  const {
    currentUser,
    postOpRecords,
    capturedPhotos,
    addCapturedPhoto,
    clearCapturedPhotos,
    evaluateCapturedWoundPhotos,
    isEvaluatingRag,
    setActivePatientTab,
    theme,
  } = useApp();

  const patientId = currentUser?.id || 'pat-1';
  const record = postOpRecords[patientId] || postOpRecords['pat-1'];
  const schedule = record.schedule;

  /**
   * Abre la cámara del dispositivo (o añade una captura clínica simulada si se ejecuta en emulador sin cámara)
   * permitiendo registrar de 1 a 4 fotografías de la herida postoperatoria.
   */
  async function handleOpenCamera(): Promise<void> {
    if (capturedPhotos.length >= 4) {
      Alert.alert(
        'Límite alcanzado',
        'Puedes ingresar un máximo de 4 fotos de tu incisión por evaluación.'
      );
      return;
    }

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.granted) {
        const result = await ImagePicker.launchCameraAsync({
          quality: 0.8,
          allowsEditing: true,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          addCapturedPhoto(result.assets[0].uri);
          return;
        }
      }
    } catch {
      // Fallback en entorno web o emulador sin hardware de cámara
    }

    // Agrega muestra de incisión postoperatoria si no se seleccionó desde hardware físico
    addCapturedPhoto(`Foto #${capturedPhotos.length + 1}`);
  }

  /**
   * Abre la galería fotográfica del dispositivo para seleccionar de 1 a 4 fotos de la herida.
   */
  async function handleOpenGallery(): Promise<void> {
    if (capturedPhotos.length >= 4) {
      Alert.alert(
        'Límite alcanzado',
        'Puedes ingresar un máximo de 4 fotos de tu incisión por evaluación.'
      );
      return;
    }

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.granted) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          addCapturedPhoto(result.assets[0].uri);
          return;
        }
      }
    } catch {
      // Fallback en caso de permisos restringidos en simulador
    }

    addCapturedPhoto(`Foto #${capturedPhotos.length + 1}`);
  }

  /**
   * Envía las fotografías capturadas al microservicio Visual RAG (Dataset ML + Tratamiento del Doctor)
   * y abre el modal de Reporte Clínico Oficial (Pantalla 04).
   */
  async function handleRunVisualRagEvaluation(): Promise<void> {
    await evaluateCapturedWoundPhotos();
    setActivePatientTab('REPORTS');
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Tarjeta Superior de Progreso Quirúrgico (SurgeryCard - nodo 1:72) */}
      <View
        style={[
          styles.surgeryCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.surgeryTopRow}>
          <View style={styles.surgeryLeftRow}>
            <PulseSurgeryIcon />
            <View style={styles.surgeryTitles}>
              <Text style={[styles.surgeryTitle, { color: theme.textPrimary }]}>
                {schedule.procedureName}
              </Text>
              <Text style={[styles.surgerySubtitle, { color: theme.textSecondary }]}>
                Reposo: Día {schedule.currentDay} de {schedule.totalRestDays}
              </Text>
            </View>
          </View>

          <View style={[styles.percentBadge, { backgroundColor: theme.primaryLight }]}>
            <Text style={[styles.percentBadgeText, { color: theme.primary }]}>
              {schedule.completionPercentage}%
            </Text>
          </View>
        </View>

        {/* Barra de Progreso de Recuperación (nodos 1:81 y 1:82) */}
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
      </View>

      {/* Tarjeta Principal de Captura Fotográfica con Borde Punteado (CaptureCard - nodo 1:83) */}
      <View
        style={[
          styles.captureCard,
          {
            backgroundColor: theme.surface,
            borderColor: '#CBD5E1',
          },
        ]}
      >
        <View style={styles.cameraCircleWrapper}>
          <LargeCameraCircleIcon />
        </View>

        <Text style={[styles.captureTitle, { color: theme.textPrimary }]}>
          Tomar Fotografía
        </Text>
        <Text style={[styles.captureSubtitle, { color: theme.textSecondary }]}>
          Puedes ingresar de 1 a 4 fotos de tu incisión
        </Text>

        {/* Vista previa cuando el paciente ha agregado de 1 a 4 fotos */}
        {capturedPhotos.length > 0 && (
          <View style={styles.previewSection}>
            <View style={styles.previewGrid}>
              {capturedPhotos.map((item, idx) => (
                <View key={`${item}-${idx}`} style={styles.previewThumb}>
                  <WoundIncisionGraphic variant={idx % 2 === 0 ? 1 : 2} />
                  <View style={styles.previewBadge}>
                    <Text style={styles.previewBadgeText}>Foto #{idx + 1}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.previewActionsRow}>
              <TouchableOpacity
                style={[styles.evaluateRagBtn, { backgroundColor: theme.emerald }]}
                activeOpacity={0.85}
                onPress={handleRunVisualRagEvaluation}
                disabled={isEvaluatingRag}
              >
                {isEvaluatingRag ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.evaluateRagBtnText}>
                    Analizar {capturedPhotos.length} Foto(s) con Visual RAG
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.clearPhotosBtn}
                onPress={clearCapturedPhotos}
              >
                <Text style={[styles.clearPhotosText, { color: theme.textSecondary }]}>
                  Limpiar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Botones Abrir Cámara y Galería (nodo 1:92) */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.cameraButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
            onPress={handleOpenCamera}
          >
            <SmallCameraIcon color="#FFFFFF" />
            <Text style={styles.cameraButtonText}>Abrir Cámara</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.galleryButton,
              {
                backgroundColor: theme.surface,
                borderColor: '#CBD5E1',
              },
            ]}
            activeOpacity={0.85}
            onPress={handleOpenGallery}
          >
            <GalleryIcon color={theme.textPrimary} />
            <Text style={[styles.galleryButtonText, { color: theme.textPrimary }]}>
              Galería
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 16,
    paddingBottom: 28,
  },
  surgeryCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  surgeryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  surgeryLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surgeryTitles: {
    marginLeft: 12,
    flex: 1,
  },
  surgeryTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  surgerySubtitle: {
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
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  captureCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 36,
    alignItems: 'center',
    minHeight: 380,
    justifyContent: 'center',
  },
  cameraCircleWrapper: {
    marginBottom: 22,
  },
  captureTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  captureSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 28,
  },
  previewSection: {
    width: '100%',
    marginBottom: 20,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 12,
  },
  previewThumb: {
    width: 140,
    height: 76,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  previewBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#0F172A',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  previewBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  previewActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  evaluateRagBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  evaluateRagBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  clearPhotosBtn: {
    paddingHorizontal: 10,
    height: 44,
    justifyContent: 'center',
  },
  clearPhotosText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonsRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cameraButton: {
    flex: 1.25,
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  galleryButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  galleryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
