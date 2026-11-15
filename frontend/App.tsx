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

function PatientPortalNavigator(): React.JSX.Element {
  const { activePatientTab, theme } = useApp();

  function renderActivePatientScreen(): React.JSX.Element {
    switch (activePatientTab) {
      case 'EVAL':
        return <EvaluationScreen />;
      case 'REPORTS':
      case 'REP':
        return <SavedReportsScreen />;
      case 'PHARMACY':
      case 'PHARM':
        return <PharmacyScreen />;
      case 'ORDERS':
      case 'ORD':
        return <MedicalOrdersScreen />;
      case 'PROFILE':
      case 'PROF':
      default:
        return <PatientProfileScreen />;
    }
  }

  return (
    <View style={[styles.portalContainer, { backgroundColor: theme.background }]}>
      <TopHeader role="PATIENT" />
      <View style={styles.mainViewport}>{renderActivePatientScreen()}</View>
      <PatientBottomBar />
      { }
      <ReportDetailModal />
    </View>
  );
}

function DoctorPortalNavigator(): React.JSX.Element {
  const { activeDoctorTab, theme } = useApp();

  function renderActiveDoctorScreen(): React.JSX.Element {
    switch (activeDoctorTab) {
      case 'PATIENTS':
        return <DoctorPatientsScreen />;
      case 'RECORD':
      case 'RESTRICTIONS':
        return <PostOpRecordScreen />;
      case 'PROFILE':
      default:
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
