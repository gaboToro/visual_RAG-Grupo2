import React, { useState, useEffect } from 'react';
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
  SurgeryCalendarIcon,
  ProhibitedActionIcon,
  AllowedCareIcon,
  AlertTriangleIcon,
} from '../../components/icons/FigmaIcons';

export function PostOpRecordScreen(): React.JSX.Element {
  const {
    patients,
    selectedDoctorPatientId,
    setSelectedDoctorPatientId,
    postOpRecords,
    saveDoctorPostOpRecord,
    theme,
  } = useApp();

  const currentPatient =
    patients.find((p) => p.id === selectedDoctorPatientId) || patients[0];
  const activeRecord =
    postOpRecords[currentPatient?.id || 'pat-1'] || postOpRecords['pat-1'];

  const [expandedSection, setExpandedSection] = useState<number>(1);

  const [procedureName, setProcedureName] = useState<string>(
    activeRecord.schedule.procedureName
  );
  const [surgeryDate, setSurgeryDate] = useState<string>(
    activeRecord.schedule.surgeryDate
  );
  const [totalRestDays, setTotalRestDays] = useState<string>(
    String(activeRecord.schedule.totalRestDays)
  );
  const [prohibitedList, setProhibitedList] = useState<string[]>(
    activeRecord.prohibitedActions
  );
  const [allowedCaresList, setAllowedCaresList] = useState<string[]>(
    activeRecord.allowedCares
  );
  const [allergiesList, setAllergiesList] = useState<string[]>(
    activeRecord.allergiesAndAlerts
  );
  const [newProhibitedText, setNewProhibitedText] = useState<string>('');
  const [newCareText, setNewCareText] = useState<string>('');
  const [newAllergyText, setNewAllergyText] = useState<string>('');

  useEffect(() => {
    setProcedureName(activeRecord.schedule.procedureName);
    setSurgeryDate(activeRecord.schedule.surgeryDate);
    setTotalRestDays(String(activeRecord.schedule.totalRestDays));
    setProhibitedList(activeRecord.prohibitedActions);
    setAllowedCaresList(activeRecord.allowedCares);
    setAllergiesList(activeRecord.allergiesAndAlerts);
  }, [selectedDoctorPatientId, activeRecord]);

  function handleCycleSelectedPatient(): void {
    if (patients.length <= 1) return;
    const currentIndex = patients.findIndex((p) => p.id === currentPatient.id);
    const nextIndex = (currentIndex + 1) % patients.length;
    setSelectedDoctorPatientId(patients[nextIndex].id);
  }

  function handleToggleSection(sectionNumber: number): void {
    setExpandedSection((prev) => (prev === sectionNumber ? 0 : sectionNumber));
  }

  function handleAddProhibitedAction(): void {
    if (!newProhibitedText.trim()) return;
    setProhibitedList((prev) => [...prev, newProhibitedText.trim()]);
    setNewProhibitedText('');
  }

  function handleRemoveProhibitedAction(index: number): void {
    setProhibitedList((prev) => prev.filter((_, idx) => idx !== index));
  }

  function handleAddAllowedCare(): void {
    if (!newCareText.trim()) return;
    setAllowedCaresList((prev) => [...prev, newCareText.trim()]);
    setNewCareText('');
  }

  function handleRemoveAllowedCare(index: number): void {
    setAllowedCaresList((prev) => prev.filter((_, idx) => idx !== index));
  }

  function handleAddAllergyAlert(): void {
    if (!newAllergyText.trim()) return;
    setAllergiesList((prev) => [...prev, newAllergyText.trim()]);
    setNewAllergyText('');
  }

  function handleRemoveAllergyAlert(index: number): void {
    setAllergiesList((prev) => prev.filter((_, idx) => idx !== index));
  }

  async function handleSavePostOpFicha(): Promise<void> {
    await saveDoctorPostOpRecord(currentPatient.id, {
      procedureName: procedureName.trim() || 'Correcion Neuronal',
      surgeryDate: surgeryDate.trim() || '2026-08-19',
      totalRestDays: Number(totalRestDays) || 10,
      prohibitedActions: prohibitedList,
      allowedCares: allowedCaresList,
      allergiesAndAlerts: allergiesList,
    });

    Alert.alert(
      'Ficha Postoperatoria Guardada',
      `El plan quirúrgico de ${currentPatient.fullName} se ha actualizado y sincronizado con el motor Visual RAG y Farmacia.`
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      { }
      <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>
        Ficha Postoperatoria
      </Text>

      { }
      <View
        style={[
          styles.patientSelectorCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View style={styles.selectorLeftRow}>
          <UserAvatarCircleIcon size={40} />
          <View style={styles.selectorTextCol}>
            <Text style={[styles.selectorLabel, { color: theme.textSecondary }]}>
              PACIENTE SELECCIONADO
            </Text>
            <Text style={[styles.selectorPatientName, { color: theme.textPrimary }]}>
              {currentPatient?.fullName || 'Nelson Steven Casa'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.changePatientBtn, { backgroundColor: theme.primaryLight }]}
          activeOpacity={0.8}
          onPress={handleCycleSelectedPatient}
        >
          <Text style={[styles.changePatientBtnText, { color: theme.primary }]}>
            Cambiar v
          </Text>
        </TouchableOpacity>
      </View>

      { }
      <View
        style={[
          styles.accordionCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.accordionHeaderRow}
          activeOpacity={0.8}
          onPress={() => handleToggleSection(1)}
        >
          <View style={styles.accordionLeftRow}>
            <SurgeryCalendarIcon size={34} />
            <View style={styles.accordionTitleCol}>
              <Text style={[styles.accordionTitle, { color: theme.textPrimary }]}>
                1. Cirugía & Cronograma
              </Text>
              <Text style={[styles.accordionSubtitle, { color: theme.primary }]}>
                {procedureName} • {totalRestDays} días
              </Text>
            </View>
          </View>

          <Text style={[styles.chevronText, { color: theme.primary }]}>
            {expandedSection === 1 ? '^' : 'v'}
          </Text>
        </TouchableOpacity>

        {expandedSection === 1 && (
          <View style={styles.accordionBody}>
            <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
              Procedimiento Quirúrgico:
            </Text>
            <View
              style={[
                styles.fieldInputBox,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <TextInput
                value={procedureName}
                onChangeText={setProcedureName}
                style={[styles.fieldInputText, { color: theme.textPrimary }]}
                placeholder="Correcion Neuronal"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.scheduleTwoCols}>
              <View style={styles.scheduleCol}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                  Fecha de Cirugía:
                </Text>
                <View
                  style={[
                    styles.fieldInputBox,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      marginBottom: 0,
                    },
                  ]}
                >
                  <TextInput
                    value={surgeryDate}
                    onChangeText={setSurgeryDate}
                    style={[styles.fieldInputText, { color: theme.textPrimary }]}
                    placeholder="2026-08-19"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </View>

              <View style={styles.scheduleColSmall}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                  Días Reposo:
                </Text>
                <View
                  style={[
                    styles.fieldInputBox,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                      marginBottom: 0,
                    },
                  ]}
                >
                  <TextInput
                    value={totalRestDays}
                    onChangeText={setTotalRestDays}
                    keyboardType="numeric"
                    style={[styles.fieldInputText, { color: theme.textPrimary }]}
                    placeholder="10"
                    placeholderTextColor={theme.textSecondary}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      { }
      <View
        style={[
          styles.accordionCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.accordionHeaderRow}
          activeOpacity={0.8}
          onPress={() => handleToggleSection(2)}
        >
          <View style={styles.accordionLeftRow}>
            <ProhibitedActionIcon size={34} />
            <View style={styles.accordionTitleCol}>
              <Text style={[styles.accordionTitle, { color: theme.textPrimary }]}>
                2. Acciones Prohibidas
              </Text>
              <Text style={[styles.accordionSubtitleMuted, { color: theme.textSecondary }]}>
                {prohibitedList.length} indicación(es) registrada(s)
              </Text>
            </View>
          </View>

          <Text style={[styles.chevronText, { color: theme.textSecondary }]}>
            {expandedSection === 2 ? '^' : 'v'}
          </Text>
        </TouchableOpacity>

        {expandedSection === 2 && (
          <View style={styles.accordionBody}>
            {prohibitedList.map((item, idx) => (
              <View
                key={`proh-${idx}`}
                style={[
                  styles.listItemRow,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.listItemText, { color: theme.textPrimary }]}>
                  • {item}
                </Text>
                <TouchableOpacity
                  style={styles.removeItemBtn}
                  onPress={() => handleRemoveProhibitedAction(idx)}
                >
                  <Text style={[styles.removeItemBtnText, { color: theme.danger }]}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addRow}>
              <TextInput
                value={newProhibitedText}
                onChangeText={setNewProhibitedText}
                placeholder="Nueva restricción postoperatoria..."
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.addInput,
                  {
                    color: theme.textPrimary,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
              />
              <TouchableOpacity
                style={[styles.addSmallBtn, { backgroundColor: theme.primary }]}
                onPress={handleAddProhibitedAction}
              >
                <Text style={styles.addSmallBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      { }
      <View
        style={[
          styles.accordionCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.accordionHeaderRow}
          activeOpacity={0.8}
          onPress={() => handleToggleSection(3)}
        >
          <View style={styles.accordionLeftRow}>
            <AllowedCareIcon size={34} />
            <View style={styles.accordionTitleCol}>
              <Text style={[styles.accordionTitle, { color: theme.textPrimary }]}>
                3. Cuidados & Curaciones
              </Text>
              <Text style={[styles.accordionSubtitleMuted, { color: theme.textSecondary }]}>
                {allowedCaresList.length} indicación(es) registrada(s)
              </Text>
            </View>
          </View>

          <Text style={[styles.chevronText, { color: theme.textSecondary }]}>
            {expandedSection === 3 ? '^' : 'v'}
          </Text>
        </TouchableOpacity>

        {expandedSection === 3 && (
          <View style={styles.accordionBody}>
            {allowedCaresList.map((item, idx) => (
              <View
                key={`care-${idx}`}
                style={[
                  styles.listItemRow,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.listItemText, { color: theme.textPrimary }]}>
                  • {item}
                </Text>
                <TouchableOpacity
                  style={styles.removeItemBtn}
                  onPress={() => handleRemoveAllowedCare(idx)}
                >
                  <Text style={[styles.removeItemBtnText, { color: theme.danger }]}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addRow}>
              <TextInput
                value={newCareText}
                onChangeText={setNewCareText}
                placeholder="Nuevo cuidado o curación..."
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.addInput,
                  {
                    color: theme.textPrimary,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
              />
              <TouchableOpacity
                style={[styles.addSmallBtn, { backgroundColor: theme.primary }]}
                onPress={handleAddAllowedCare}
              >
                <Text style={styles.addSmallBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      { }
      <View
        style={[
          styles.accordionCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.accordionHeaderRow}
          activeOpacity={0.8}
          onPress={() => handleToggleSection(4)}
        >
          <View style={styles.accordionLeftRow}>
            <AlertTriangleIcon size={34} />
            <View style={styles.accordionTitleCol}>
              <Text style={[styles.accordionTitle, { color: theme.textPrimary }]}>
                4. Alergias & Urgencias
              </Text>
              <Text style={[styles.accordionSubtitleMuted, { color: theme.textSecondary }]}>
                Configurar signos de alerta
              </Text>
            </View>
          </View>

          <Text style={[styles.chevronText, { color: theme.textSecondary }]}>
            {expandedSection === 4 ? '^' : 'v'}
          </Text>
        </TouchableOpacity>

        {expandedSection === 4 && (
          <View style={styles.accordionBody}>
            {allergiesList.map((item, idx) => (
              <View
                key={`allergy-${idx}`}
                style={[
                  styles.listItemRow,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.listItemText, { color: theme.textPrimary }]}>
                  • {item}
                </Text>
                <TouchableOpacity
                  style={styles.removeItemBtn}
                  onPress={() => handleRemoveAllergyAlert(idx)}
                >
                  <Text style={[styles.removeItemBtnText, { color: theme.danger }]}>
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.addRow}>
              <TextInput
                value={newAllergyText}
                onChangeText={setNewAllergyText}
                placeholder="Signo de alarma o alergia..."
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.addInput,
                  {
                    color: theme.textPrimary,
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
              />
              <TouchableOpacity
                style={[styles.addSmallBtn, { backgroundColor: theme.primary }]}
                onPress={handleAddAllergyAlert}
              >
                <Text style={styles.addSmallBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      { }
      <TouchableOpacity
        style={[styles.saveFichaButton, { backgroundColor: theme.primary }]}
        activeOpacity={0.85}
        onPress={handleSavePostOpFicha}
      >
        <Text style={styles.saveFichaButtonText}>
          Guardar Ficha Postoperatoria
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
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  patientSelectorCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  selectorLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectorTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  selectorLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  selectorPatientName: {
    fontSize: 14,
    fontWeight: '700',
  },
  changePatientBtn: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePatientBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  accordionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  accordionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accordionTitleCol: {
    marginLeft: 12,
    flex: 1,
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  accordionSubtitle: {
    fontSize: 10,
    fontWeight: '600',
  },
  accordionSubtitleMuted: {
    fontSize: 10,
    fontWeight: '500',
  },
  chevronText: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 6,
  },
  accordionBody: {
    marginTop: 12,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  fieldInputBox: {
    height: 34,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 8,
  },
  fieldInputText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scheduleTwoCols: {
    flexDirection: 'row',
    gap: 10,
  },
  scheduleCol: {
    flex: 1.5,
  },
  scheduleColSmall: {
    flex: 1,
  },
  listItemRow: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
  removeItemBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  removeItemBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  addInput: {
    flex: 1,
    height: 34,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 11,
  },
  addSmallBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSmallBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  saveFichaButton: {
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  saveFichaButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
