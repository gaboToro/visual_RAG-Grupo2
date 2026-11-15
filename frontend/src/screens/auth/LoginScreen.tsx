/**
 * @file LoginScreen.tsx
 * @description Implementación de la Pantalla 01 de Figma ("01. Login Screen" - nodo 1:6).
 * Incluye el logo circular Visual RAG, subtítulo "TRIAGE & POSTOP MONITOR", selector segmentado
 * entre "Paciente" y "Médico Cirujano", formulario de correo/contraseña, recuadro de credenciales
 * demo y botón "Ingresar al Portal".
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { LoginCrosshairLogo } from '../../components/icons/FigmaIcons';

/**
 * Renderiza la barra de estado móvil (44px) en la pantalla de Login según el nodo Figma 1:7.
 */
function LoginStatusBar({ color }: { color: string }): React.JSX.Element {
  return (
    <View style={styles.statusBar}>
      <Text style={[styles.statusTime, { color }]}>9:41</Text>
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
    </View>
  );
}

/**
 * Pantalla de Inicio de Sesión de Visual RAG (Pantalla 01 de Figma).
 */
export function LoginScreen(): React.JSX.Element {
  const { login, theme } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT');
  const [email, setEmail] = useState<string>('nelsoncasa@gmail.com');
  const [password, setPassword] = useState<string>('nelson123');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Cambia el rol seleccionado entre "Paciente" y "Médico Cirujano" y autocompleta
   * las credenciales de demostración correspondientes.
   * @param {UserRole} role - Rol elegido por el usuario.
   */
  function handleSelectRole(role: UserRole): void {
    setSelectedRole(role);
    if (role === 'PATIENT') {
      setEmail('nelsoncasa@gmail.com');
      setPassword('nelson123');
    } else {
      setEmail('nelson.doctor@gmail.com');
      setPassword('doctor123');
    }
  }

  /**
   * Ejecuta la autenticación contra el servicio de identidad y redirige al portal correspondiente.
   */
  async function handleLoginSubmit(): Promise<void> {
    setIsSubmitting(true);
    try {
      await login(email, password, selectedRole);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LoginStatusBar color={theme.textPrimary} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Sección de Marca y Logo (nodo 1:19) */}
        <View style={styles.brandSection}>
          <LoginCrosshairLogo />
          <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
            Visual RAG
          </Text>
          <Text style={[styles.brandSubtitle, { color: theme.primary }]}>
            TRIAGE & POSTOP MONITOR
          </Text>
        </View>

        {/* Tarjeta del Formulario de Inicio de Sesión (nodo 1:25) */}
        <View
          style={[
            styles.loginCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          {/* Selector Segmentado de Rol: Paciente vs Médico Cirujano (nodo 1:26) */}
          <View
            style={[
              styles.roleToggleContainer,
              { backgroundColor: theme.surfaceMuted },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === 'PATIENT' && [
                  styles.roleOptionActive,
                  { backgroundColor: theme.surface },
                ],
              ]}
              activeOpacity={0.85}
              onPress={() => handleSelectRole('PATIENT')}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  {
                    color:
                      selectedRole === 'PATIENT'
                        ? theme.textPrimary
                        : theme.textSecondary,
                    fontWeight: selectedRole === 'PATIENT' ? '700' : '600',
                  },
                ]}
              >
                Paciente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleOption,
                selectedRole === 'DOCTOR' && [
                  styles.roleOptionActive,
                  { backgroundColor: theme.surface },
                ],
              ]}
              activeOpacity={0.85}
              onPress={() => handleSelectRole('DOCTOR')}
            >
              <Text
                style={[
                  styles.roleOptionText,
                  {
                    color:
                      selectedRole === 'DOCTOR'
                        ? theme.textPrimary
                        : theme.textSecondary,
                    fontWeight: selectedRole === 'DOCTOR' ? '700' : '600',
                  },
                ]}
              >
                Médico Cirujano
              </Text>
            </TouchableOpacity>
          </View>

          {/* Campo Correo Electrónico (nodos 1:31 y 1:32) */}
          <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
            Correo Electrónico:
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="nelsoncasa@gmail.com"
              placeholderTextColor={theme.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.textInput, { color: theme.textPrimary }]}
            />
          </View>

          {/* Campo Contraseña (nodos 1:34 y 1:35) */}
          <Text style={[styles.inputLabel, { color: theme.textPrimary }]}>
            Contraseña:
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              style={[styles.textInput, { color: theme.textPrimary }]}
            />
          </View>

          {/* Recuadro de Credenciales Demo (nodo 1:37) */}
          <View
            style={[
              styles.demoBox,
              {
                backgroundColor: theme.primaryLight,
                borderColor: theme.primary,
              },
            ]}
          >
            <Text style={[styles.demoBoxTitle, { color: theme.primary }]}>
              {selectedRole === 'PATIENT'
                ? 'Cuenta Paciente Demo:'
                : 'Cuenta Médico Demo:'}
            </Text>
            <Text style={[styles.demoBoxCredentials, { color: theme.textPrimary }]}>
              {selectedRole === 'PATIENT'
                ? 'nelsoncasa@gmail.com / nelson123'
                : 'nelson.doctor@gmail.com / doctor123'}
            </Text>
          </View>

          {/* Botón Ingresar al Portal (nodo 1:40) */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
            onPress={handleLoginSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Ingresando...' : 'Ingresar al Portal'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Home Indicator inferior (nodo 1:42) */}
      <View style={styles.homeIndicatorBarWrapper}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 14,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 6,
  },
  loginCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  roleToggleContainer: {
    height: 44,
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    marginBottom: 20,
  },
  roleOption: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleOptionActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  roleOptionText: {
    fontSize: 13,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    justifyContent: 'center',
    marginBottom: 16,
  },
  textInput: {
    fontSize: 14,
    fontWeight: '500',
  },
  demoBox: {
    height: 56,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  demoBoxTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  demoBoxCredentials: {
    fontSize: 11,
    fontWeight: '500',
  },
  submitButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  homeIndicatorBarWrapper: {
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#CBD5E1',
  },
});
