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
  DoctorHeaderScopeIcon,
  ThemeModeIcon,
} from '../../components/icons/FigmaIcons';

export function DoctorProfileScreen(): React.JSX.Element {
  const {
    doctorProfile,
    isDarkMode,
    toggleDarkMode,
    updateDoctorProfessionalInfo,
    logout,
    theme,
  } = useApp();

  const [specialty, setSpecialty] = useState<string>(
    doctorProfile.clinicalInfo.specialty || 'Cirugía General y Laparoscópica'
  );
  const [hospital, setHospital] = useState<string>(
    doctorProfile.clinicalInfo.hospital || 'Hospital Metropolitano'
  );

  async function handleSaveProfessionalData(): Promise<void> {
    await updateDoctorProfessionalInfo(specialty, hospital);
    Alert.alert(
      'Datos Profesionales Guardados',
      'Su especialidad y centro hospitalario se han actualizado y sincronizado correctamente.'
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      { }
      <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
        Perfil y Configuración
      </Text>

      { }
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <DoctorHeaderScopeIcon size={60} />

        <View style={styles.summaryInfoCol}>
          <Text style={[styles.doctorName, { color: theme.textPrimary }]}>
            {doctorProfile.fullName}
          </Text>
          <Text style={[styles.doctorEmail, { color: theme.textSecondary }]}>
            {doctorProfile.email}
          </Text>

          <View style={styles.badgesRow}>
            <View style={[styles.regBadge, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.regBadgeText, { color: theme.primary }]}>
                Reg: {doctorProfile.clinicalInfo.medicalLicense || 'MSP-178942'}
              </Text>
            </View>

            <View style={[styles.hospBadge, { backgroundColor: theme.surfaceMuted }]}>
              <Text style={[styles.hospBadgeText, { color: theme.textSecondary }]}>
                {doctorProfile.clinicalInfo.hospital || 'H. Metropolitano'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      { }
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
          <Text style={[styles.themeTitle, { color: theme.textPrimary }]}>
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

      { }
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
          Datos Profesionales
        </Text>

        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
          Especialidad:
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
            value={specialty}
            onChangeText={setSpecialty}
            style={[styles.inputText, { color: theme.textPrimary }]}
            placeholder="Cirugía General y Laparoscópica"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
          Hospital / Clínica:
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
            value={hospital}
            onChangeText={setHospital}
            style={[styles.inputText, { color: theme.textPrimary }]}
            placeholder="Hospital Metropolitano"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveProfessionalBtn, { backgroundColor: theme.primary }]}
          activeOpacity={0.85}
          onPress={handleSaveProfessionalData}
        >
          <Text style={styles.saveProfessionalBtnText}>
            Guardar Datos Profesionales
          </Text>
        </TouchableOpacity>
      </View>

      { }
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
  summaryCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryInfoCol: {
    marginLeft: 14,
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  doctorEmail: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  regBadge: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  hospBadge: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospBadgeText: {
    fontSize: 10,
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
  themeTitle: {
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
  saveProfessionalBtn: {
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveProfessionalBtnText: {
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
