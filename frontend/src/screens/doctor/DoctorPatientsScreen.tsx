import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import {
  SearchLoupeIcon,
  UserAvatarCircleIcon,
} from '../../components/icons/FigmaIcons';

export function DoctorPatientsScreen(): React.JSX.Element {
  const {
    patients,
    selectedDoctorPatientId,
    setSelectedDoctorPatientId,
    setActiveDoctorTab,
    assignNewPatientToDoctor,
    removePatientFromDoctor,
    theme,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newCedula, setNewCedula] = useState<string>('');
  const [newBloodType, setNewBloodType] = useState<string>('O+');

  function getFilteredPatients(): UserProfile[] {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter((p) => {
      const nameMatch = p.fullName.toLowerCase().includes(query);
      const emailMatch = p.email.toLowerCase().includes(query);
      const cedulaMatch = (p.clinicalInfo.cedula || '').toLowerCase().includes(query);
      return nameMatch || emailMatch || cedulaMatch;
    });
  }

  function handleOpenPostOpRecord(patientId: string): void {
    setSelectedDoctorPatientId(patientId);
    setActiveDoctorTab('RECORD');
  }

  function handleRemovePatient(patient: UserProfile): void {
    Alert.alert(
      'Desvincular Paciente',
      `¿Desea desvincular a ${patient.fullName} de su lista de pacientes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desvincular',
          style: 'destructive',
          onPress: () => removePatientFromDoctor(patient.id),
        },
      ]
    );
  }

  function handleConfirmAssignPatient(): void {
    const cleanName = newFullName.trim();
    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanCedula = newCedula.trim();

    if (!cleanName || !cleanEmail || !cleanCedula) {
      Alert.alert(
        'Campos requeridos',
        'Por favor complete el nombre, correo electrónico y cédula del paciente.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      Alert.alert('Correo inválido', 'Ingrese una dirección de correo electrónico válida.');
      return;
    }

    if (!/^\d{10}$/.test(cleanCedula)) {
      Alert.alert('Cédula inválida', 'La cédula de identidad debe contener 10 dígitos numéricos.');
      return;
    }

    if (patients.some((p) => p.email.toLowerCase() === cleanEmail)) {
      Alert.alert(
        'Paciente duplicado',
        'Ya existe un paciente registrado con ese correo electrónico.'
      );
      return;
    }

    assignNewPatientToDoctor(
      cleanName,
      cleanEmail,
      cleanCedula,
      newBloodType.trim().toUpperCase() || 'O+'
    );
    setNewFullName('');
    setNewEmail('');
    setNewCedula('');
    setNewBloodType('O+');
    setShowAssignModal(false);
  }

  const filteredPatients = getFilteredPatients();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        { }
        <View style={styles.headerRow}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Mis Pacientes
          </Text>

          <TouchableOpacity
            style={[styles.assignButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
            onPress={() => setShowAssignModal(true)}
          >
            <Text style={styles.assignButtonText}>+ Asignar</Text>
          </TouchableOpacity>
        </View>

        { }
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <SearchLoupeIcon />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por nombre, cédula o correo..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
        </View>

        { }
        {filteredPatients.length === 0 && (
          <View
            style={[
              styles.emptySearchBox,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.emptySearchTitle, { color: theme.textPrimary }]}>
              Sin resultados de búsqueda
            </Text>
            <Text style={[styles.emptySearchSub, { color: theme.textSecondary }]}>
              No se encontraron pacientes que coincidan con &quot;{searchQuery}&quot;.
            </Text>
          </View>
        )}

        {filteredPatients.map((patient) => {
          const isSelected = patient.id === selectedDoctorPatientId;

          return (
            <View
              key={patient.id}
              style={[
                styles.patientCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: isSelected ? theme.primary : theme.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}
            >
              { }
              <TouchableOpacity
                style={styles.patientTopRow}
                activeOpacity={0.8}
                onPress={() => setSelectedDoctorPatientId(patient.id)}
              >
                <UserAvatarCircleIcon size={44} />
                <View style={styles.patientInfoCol}>
                  <Text style={[styles.patientName, { color: theme.textPrimary }]}>
                    {patient.fullName}
                  </Text>
                  <Text style={[styles.patientEmail, { color: theme.textSecondary }]}>
                    {patient.email}
                  </Text>
                </View>
              </TouchableOpacity>

              { }
              <View style={styles.badgesRow}>
                <View style={[styles.ciBadge, { backgroundColor: theme.surfaceMuted }]}>
                  <Text style={[styles.ciBadgeText, { color: theme.textSecondary }]}>
                    CI: {patient.clinicalInfo.cedula || '1751361054'}
                  </Text>
                </View>

                <View style={[styles.bloodBadge, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.bloodBadgeText, { color: theme.primary }]}>
                    Grupo: {patient.clinicalInfo.bloodType || 'O+'}
                  </Text>
                </View>

                <View style={[styles.ciBadge, { backgroundColor: theme.surfaceMuted }]}>
                  <Text style={[styles.ciBadgeText, { color: theme.textPrimary }]}>
                    Día {patient.clinicalInfo.currentPostOpDay || 1} PostOp
                  </Text>
                </View>
              </View>

              { }
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[styles.fichaButton, { backgroundColor: theme.primary }]}
                  activeOpacity={0.85}
                  onPress={() => handleOpenPostOpRecord(patient.id)}
                >
                  <Text style={styles.fichaButtonText}>Ficha Postoperatoria</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.removeButton,
                    {
                      backgroundColor: theme.dangerLight,
                      borderColor: theme.dangerBorder,
                    },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleRemovePatient(patient)}
                >
                  <Text style={[styles.removeButtonText, { color: theme.danger }]}>
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      { }
      <Modal
        visible={showAssignModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Asignar Nuevo Paciente
            </Text>

            <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>
              Nombre Completo:
            </Text>
            <TextInput
              value={newFullName}
              onChangeText={setNewFullName}
              placeholder="Ej. Carlos Andrés Pérez"
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.modalInput,
                {
                  color: theme.textPrimary,
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
            />

            <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>
              Correo Electrónico:
            </Text>
            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="carlos.perez@gmail.com"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              style={[
                styles.modalInput,
                {
                  color: theme.textPrimary,
                  borderColor: theme.border,
                  backgroundColor: theme.background,
                },
              ]}
            />

            <View style={styles.modalTwoCols}>
              <View style={styles.modalCol}>
                <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>
                  Cédula (CI):
                </Text>
                <TextInput
                  value={newCedula}
                  onChangeText={setNewCedula}
                  placeholder="1712345678"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  style={[
                    styles.modalInput,
                    {
                      color: theme.textPrimary,
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                    },
                  ]}
                />
              </View>

              <View style={styles.modalColSmall}>
                <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>
                  Grupo:
                </Text>
                <TextInput
                  value={newBloodType}
                  onChangeText={setNewBloodType}
                  placeholder="O+"
                  placeholderTextColor={theme.textSecondary}
                  style={[
                    styles.modalInput,
                    {
                      color: theme.textPrimary,
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
                onPress={() => setShowAssignModal(false)}
              >
                <Text style={{ color: theme.textSecondary, fontWeight: '600' }}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSaveBtn, { backgroundColor: theme.primary }]}
                onPress={handleConfirmAssignPatient}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                  Asignar Paciente
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  assignButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchBar: {
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '500',
  },
  emptySearchBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  emptySearchTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySearchSub: {
    fontSize: 12,
    textAlign: 'center',
  },
  patientCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  patientTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientInfoCol: {
    marginLeft: 12,
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  patientEmail: {
    fontSize: 12,
    fontWeight: '500',
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  ciBadge: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ciBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bloodBadge: {
    height: 22,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  fichaButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fichaButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  removeButton: {
    width: 38,
    height: 36,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  modalLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  modalInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
    marginBottom: 12,
  },
  modalTwoCols: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCol: {
    flex: 2,
  },
  modalColSmall: {
    flex: 1,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  modalCancelBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveBtn: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
