import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { PatientTab } from '../../types';
import {
  SmallCameraIcon,
  TabReportsIcon,
  TabOrdersIcon,
  TabProfileIcon,
} from '../icons/FigmaIcons';

interface TabConfig {
  key: PatientTab;
  label: string;
}

const PATIENT_TABS: TabConfig[] = [
  { key: 'EVAL', label: 'Evaluación' },
  { key: 'REPORTS', label: 'Reportes' },
  { key: 'PHARMACY', label: 'Farmacia' },
  { key: 'ORDERS', label: 'Órdenes' },
  { key: 'PROFILE', label: 'Perfil' },
];

function renderPatientTabIcon(tabKey: PatientTab, color: string): React.JSX.Element {
  switch (tabKey) {
    case 'EVAL':
      return <SmallCameraIcon color={color} />;
    case 'REPORTS':
    case 'REP':
      return <TabReportsIcon color={color} />;
    case 'PHARMACY':
    case 'PHARM':
      return (
        <Text style={[styles.pharmacyPlusIcon, { color }]}>+</Text>
      );
    case 'ORDERS':
    case 'ORD':
      return <TabOrdersIcon color={color} />;
    case 'PROFILE':
    case 'PROF':
    default:
      return <TabProfileIcon color={color} />;
  }
}

export function PatientBottomBar(): React.JSX.Element {
  const { activePatientTab, setActivePatientTab, theme } = useApp();

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
        {PATIENT_TABS.map((tab) => {
          const isActive = activePatientTab === tab.key;
          const tintColor = isActive ? theme.primary : theme.textSecondary;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              activeOpacity={0.75}
              onPress={() => setActivePatientTab(tab.key)}
            >
              <View style={styles.iconSlot}>
                {renderPatientTabIcon(tab.key, tintColor)}
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

      { }
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
    paddingHorizontal: 6,
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
  pharmacyPlusIcon: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
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
