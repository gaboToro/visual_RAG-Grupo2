/**
 * @file PatientProfileScreen.tsx
 * @description Implementación de la Pantalla 07 de Figma ("07. Paciente - Perfil Clínico" - nodo 1:450).
 * Muestra "Perfil y Configuración", tarjeta con avatar y datos del paciente ("Nelson Steven Casa",
 * "nelsoncasa@gmail.com", "Grupo: O+", "CI: 1751361054"), tarjeta de "Modo de Visualización",
 * formulario de "Datos Clínicos" ("Nombre Completo:", "Contacto de Emergencia:") y botón "Cerrar Sesión".
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import {
  UserAvatarCircleIcon,
  ThemeModeIcon,
} from '../../components/icons/FigmaIcons';

/**
 * Pantalla de Perfil Clínico y Configuración del Paciente (Pantalla 07 de Figma).
 */
export function PatientProfileScreen(): React.JSX.Element {
  const {
    currentUser,
    isDarkMode,
    toggleDarkMode,
    updatePatientClinicalInfo,
    logout,
    theme,
  } = useApp();

  const [fullName, setFullName] = useState<string>(
    currentUser?.fullName || 'Nelson Steven Casa'
  );
  const [emergencyContact, setEmergencyContact] = useState<string>(
    currentUser?.clinicalInfo?.emergencyContact || 'Carmen Casa (Madre) - 0987654321'
  );

  /**
   * Guarda los cambios realizados en los Datos Clínicos del paciente.
   */
  function handleSaveClinicalData(): void {
    updatePatientClinicalInfo(fullName, emergencyContact);
    Alert.alert(
      'Datos Clínicos Guardados',
      'La información clínica del paciente se ha actualizado correctamente.'
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Título de Sección (nodo 1:471) */}
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Perfil y Configuración
      </Text>

      {/* Tarjeta de Resumen del Paciente (nodo 1:472) */}
      <View
        style={[
          styles.profileSummaryCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <UserAvatarCircleIcon size={60} />

        <View style={styles.profileSummaryInfo}>
          <Text style={[styles.profileName, { color: theme.textPrimary }]}>
            {currentUser?.fullName || 'Nelson Steven Casa'}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
            {currentUser?.email || 'nelsoncasa@gmail.com'}
          </Text>

          <View style={styles.badgesRow}>
            <View style={[styles.tealBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.tealBadgeText, { color: theme.primary }]}>
                Grupo: {currentUser?.clinicalInfo?.bloodType || 'O+'}
              </Text>
            </View>

            <View style={[styles.slateBadge, { backgroundColor: theme.surfaceMuted }]}>
              <Text style={[styles.slateBadgeText, { color: theme.textSecondary }]}>
                CI: {currentUser?.clinicalInfo?.cedula || '1751361054'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tarjeta de Modo de Visualización (nodo 1:483) */}
      <View
        style={[
          styles.themeCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.themeLeftCol}>
          <Text style={[styles.themeCardTitle, { color: theme.textPrimary }]}>
            Modo de Visualización
          </Text>
          <View style={styles.themeStatusRow}>
            <ThemeModeIcon />
            <Text style={[styles.themeStatusText, { color: theme.textSecondary }]}>
              {isDarkMode ? 'Modo Oscuro Activado' : 'Modo Claro Activado'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.changeThemeBtn, { backgroundColor: theme.primaryLight }]}
          activeOpacity={0.8}
          onPress={toggleDarkMode}
        >
          <Text style={[styles.changeThemeBtnText, { color: theme.primary }]}>
            Cambiar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tarjeta Formulario de Datos Clínicos (nodo 1:492) */}
      <View
        style={[
          styles.formCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.formCardTitle, { color: theme.textPrimary }]}>
          Datos Clínicos
        </Text>

        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
          Nombre Completo:
        </Text>
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={[styles.inputText, { color: theme.textPrimary }]}
            placeholder="Nelson Steven Casa"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
          Contacto de Emergencia:
        </Text>
        <View
          style={[
            styles.inputBox,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <TextInput
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            style={[styles.inputText, { color: theme.textPrimary }]}
            placeholder="Nombre y teléfono de emergencia"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveClinicalBtn, { backgroundColor: theme.primary }]}
          activeOpacity={0.85}
          onPress={handleSaveClinicalData}
        >
          <Text style={styles.saveClinicalBtnText}>Guardar Datos Clínicos</Text>
        </TouchableOpacity>
      </View>

      {/* Botón Cerrar Sesión (nodo 1:503) */}
      <TouchableOpacity
        style={[
          styles.logoutBtn,
          {
            backgroundColor: theme.dangerLight,
            borderColor: theme.dangerBorder,
          },
        ]}
        activeOpacity={0.85}
        onPress={logout}
      >
        <Text style={[styles.logoutBtnText, { color: theme.danger }]}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  profileSummaryCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileSummaryInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tealBadge: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tealBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  slateBadge: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slateBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  themeCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  themeLeftCol: {
    flex: 1,
  },
  themeCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  themeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeStatusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 10,
  },
  changeThemeBtn: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeThemeBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  formCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputBox: {
    height: 38,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 12,
  },
  inputText: {
    fontSize: 12,
    fontWeight: '500',
  },
  saveClinicalBtn: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveClinicalBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
