/**
 * @file DoctorBottomBar.tsx
 * @description Barra de navegación inferior de 3 pestañas para el Portal Médico
 * (Pacientes, Ficha, Perfil) basada en el nodo Figma 1:596.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { DoctorTab } from '../../types';
import {
  TabDoctorPatientsIcon,
  TabOrdersIcon,
  TabProfileIcon,
} from '../icons/FigmaIcons';

interface DoctorTabConfig {
  key: DoctorTab;
  label: string;
}

const DOCTOR_TABS: DoctorTabConfig[] = [
  { key: 'PATIENTS', label: 'Pacientes' },
  { key: 'RECORD', label: 'Ficha' },
  { key: 'PROFILE', label: 'Perfil' },
];

/**
 * Renderiza el icono vectorial correspondiente a cada pestaña del Portal Médico.
 * @param {DoctorTab} tabKey - Identificador de la pestaña del doctor.
 * @param {string} color - Color activo (#0D9488) o inactivo (#64748B).
 */
function renderDoctorTabIcon(tabKey: DoctorTab, color: string): React.JSX.Element {
  switch (tabKey) {
    case 'PATIENTS':
      return <TabDoctorPatientsIcon color={color} />;
    case 'RECORD':
      return <TabOrdersIcon color={color} />;
    case 'PROFILE':
      return <TabProfileIcon color={color} />;
  }
}

/**
 * Componente de barra de navegación inferior para el Médico Cirujano.
 */
export function DoctorBottomBar(): React.JSX.Element {
  const { activeDoctorTab, setActiveDoctorTab, theme } = useApp();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
      ]}
    >
      <View style={styles.tabsRow}>
        {DOCTOR_TABS.map((tab) => {
          const isActive = activeDoctorTab === tab.key;
          const tintColor = isActive ? theme.primary : theme.textSecondary;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              activeOpacity={0.75}
              onPress={() => setActiveDoctorTab(tab.key)}
            >
              <View style={styles.iconSlot}>
                {renderDoctorTabIcon(tab.key, tintColor)}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: tintColor,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Barra indicadora inferior (Home Indicator 134x5 de Figma) */}
      <View style={styles.homeIndicatorWrapper}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 84,
    width: '100%',
    borderTopWidth: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSlot: {
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  homeIndicatorWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
  },
});
