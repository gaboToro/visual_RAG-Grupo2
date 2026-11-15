import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useApp } from '../../context/AppContext';
import {
  PatientHeaderHeartIcon,
  DoctorHeaderScopeIcon,
} from '../icons/FigmaIcons';

interface TopHeaderProps {
  role: 'PATIENT' | 'DOCTOR';
}

function StatusBarIcons({ color }: { color: string }): React.JSX.Element {
  return (
    <View style={styles.statusRightRow}>
      <Svg width={17} height={11} viewBox="0 0 17 11" fill="none">
        <Rect x={0} y={7} width={3} height={4} rx={1} fill={color} />
        <Rect x={4.5} y={5} width={3} height={6} rx={1} fill={color} />
        <Rect x={9} y={2.5} width={3} height={8.5} rx={1} fill={color} />
        <Rect x={13.5} y={0} width={3} height={11} rx={1} fill={color} />
      </Svg>
      <Svg width={15} height={11} viewBox="0 0 15 11" fill="none">
        <Path
          d="M7.5 11C8.32843 11 9 10.3284 9 9.5C9 8.67157 8.32843 8 7.5 8C6.67157 8 6 8.67157 6 9.5C6 10.3284 6.67157 11 7.5 11Z"
          fill={color}
        />
        <Path
          d="M4.2 6.8C6.1 5.1 8.9 5.1 10.8 6.8"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Path
          d="M1.5 4C5 1 10 1 13.5 4"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </Svg>
      <Svg width={25} height={12} viewBox="0 0 25 12" fill="none">
        <Rect
          x={0.5}
          y={0.5}
          width={21}
          height={11}
          rx={2.5}
          stroke={color}
          strokeOpacity={0.4}
        />
        <Rect x={2} y={2} width={18} height={8} rx={1.5} fill={color} />
        <Path d="M23 4V8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
    </View>
  );
}

export function TopHeader({ role }: TopHeaderProps): React.JSX.Element {
  const { currentUser, postOpRecords, patients, doctorProfile, theme } = useApp();

  const isPatient = role === 'PATIENT';
  const patientRecord = postOpRecords[currentUser?.id || 'pat-1'] || postOpRecords['pat-1'];
  const currentDay = patientRecord?.schedule?.currentDay ?? 79;

  const portalLabel = isPatient ? 'PORTAL PACIENTE' : 'PORTAL MÉDICO';
  const displayName = isPatient
    ? currentUser?.fullName || 'Nelson Steven Casa'
    : currentUser?.fullName || doctorProfile.fullName || 'Dr. Nelson Casa';

  const badgeText = isPatient
    ? `Día ${currentDay}`
    : `${patients.length === 1 ? '1 Paciente' : `${patients.length} Pacientes`}`;

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.surface,
          borderBottomColor: theme.border,
        },
      ]}
    >
      { }
      <View style={styles.statusBar}>
        <Text style={[styles.statusTime, { color: theme.textPrimary }]}>9:41</Text>
        <StatusBarIcons color={theme.textPrimary} />
      </View>

      { }
      <View style={styles.headerContainer}>
        <View style={styles.leftRow}>
          {isPatient ? <PatientHeaderHeartIcon /> : <DoctorHeaderScopeIcon size={40} />}
          <View style={styles.titleBlock}>
            <Text style={[styles.portalSubtitle, { color: theme.textSecondary }]}>
              {portalLabel}
            </Text>
            <Text
              style={[styles.userName, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {displayName}
            </Text>
          </View>
        </View>

        <View style={[styles.pillBadge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.pillBadgeText, { color: theme.primary }]}>
            {badgeText}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderBottomWidth: 1,
  },
  statusBar: {
    height: 44,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTime: {
    fontSize: 15,
    fontWeight: '600',
  },
  statusRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerContainer: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  titleBlock: {
    marginLeft: 12,
    flex: 1,
  },
  portalSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  pillBadge: {
    height: 28,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
