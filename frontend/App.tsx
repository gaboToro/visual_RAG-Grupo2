/**
 * @file App.tsx
 * @description Punto de entrada principal de la aplicación móvil Visual RAG administrada por Expo.
 * Orquesta las 10 pantallas del prototipo de Figma (Login, Portal Paciente de 5 pestañas + Modal Oficial,
 * y Portal Médico de 3 pestañas) junto con el proveedor de contexto global.
 */

import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { TopHeader } from './src/components/common/TopHeader';
import { PatientBottomBar } from './src/components/common/PatientBottomBar';
import { DoctorBottomBar } from './src/components/common/DoctorBottomBar';
import { ReportDetailModal } from './src/components/common/ReportDetailModal';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { EvaluationScreen } from './src/screens/patient/EvaluationScreen';
import { SavedReportsScreen } from './src/screens/patient/SavedReportsScreen';
import { PharmacyScreen } from './src/screens/patient/PharmacyScreen';
import { MedicalOrdersScreen } from './src/screens/patient/MedicalOrdersScreen';
import { PatientProfileScreen } from './src/screens/patient/PatientProfileScreen';
import { DoctorPatientsScreen } from './src/screens/doctor/DoctorPatientsScreen';
import { PostOpRecordScreen } from './src/screens/doctor/PostOpRecordScreen';
import { DoctorProfileScreen } from './src/screens/doctor/DoctorProfileScreen';

/**
 * Renderiza la vista activa dentro del Portal Paciente según la pestaña seleccionada en la barra inferior.
 */
function PatientPortalNavigator(): React.JSX.Element {
  const { activePatientTab, theme } = useApp();

  /**
   * Determina qué pantalla del Paciente mostrar (Pantallas 02, 03, 05, 06 o 07 de Figma).
   */
  function renderActivePatientScreen(): React.JSX.Element {
    switch (activePatientTab) {
      case 'EVAL':
        return <EvaluationScreen />;
      case 'REPORTS':
        return <SavedReportsScreen />;
      case 'PHARMACY':
        return <PharmacyScreen />;
      case 'ORDERS':
        return <MedicalOrdersScreen />;
      case 'PROFILE':
        return <PatientProfileScreen />;
    }
  }

  return (
    <View style={[styles.portalContainer, { backgroundColor: theme.background }]}>
      <TopHeader role="PATIENT" />
      <View style={styles.mainViewport}>{renderActivePatientScreen()}</View>
      <PatientBottomBar />
      {/* Modal de Detalle "Reporte Clínico Oficial" (Pantalla 04 de Figma) */}
      <ReportDetailModal />
    </View>
  );
}

/**
 * Renderiza la vista activa dentro del Portal Médico según la pestaña seleccionada en la barra inferior.
 */
function DoctorPortalNavigator(): React.JSX.Element {
  const { activeDoctorTab, theme } = useApp();

  /**
   * Determina qué pantalla del Médico Cirujano mostrar (Pantallas 08, 09 o 10 de Figma).
   */
  function renderActiveDoctorScreen(): React.JSX.Element {
    switch (activeDoctorTab) {
      case 'PATIENTS':
        return <DoctorPatientsScreen />;
      case 'RECORD':
        return <PostOpRecordScreen />;
      case 'PROFILE':
        return <DoctorProfileScreen />;
    }
  }

  return (
    <View style={[styles.portalContainer, { backgroundColor: theme.background }]}>
      <TopHeader role="DOCTOR" />
      <View style={styles.mainViewport}>{renderActiveDoctorScreen()}</View>
      <DoctorBottomBar />
    </View>
  );
}

/**
 * Enrutador raíz que alterna entre la pantalla de Login (Pantalla 01), el Portal Paciente
 * y el Portal Médico según la sesión activa.
 */
function RootRouter(): React.JSX.Element {
  const { currentUser, isDarkMode, theme } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {!currentUser ? (
        <LoginScreen />
      ) : currentUser.role === 'PATIENT' ? (
        <PatientPortalNavigator />
      ) : (
        <DoctorPortalNavigator />
      )}
    </SafeAreaView>
  );
}

/**
 * Componente raíz exportado por defecto para Expo.
 */
export default function App(): React.JSX.Element {
  return (
    <AppProvider>
      <RootRouter />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  portalContainer: {
    flex: 1,
  },
  mainViewport: {
    flex: 1,
  },
});
