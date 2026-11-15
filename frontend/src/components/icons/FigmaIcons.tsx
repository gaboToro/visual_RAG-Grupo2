/**
 * @file FigmaIcons.tsx
 * @description Colección de componentes vectoriales SVG (react-native-svg) construidos con los
 * trazos (`d`), dimensiones raíz (`width`, `height`) y `viewBox` exactos de los assets de Figma.
 */

import React from 'react';
import Svg, { Path, Circle, Rect, G, Line } from 'react-native-svg';

/**
 * Icono del Logo Principal de Visual RAG (Pantalla 01: Login Screen - nodo 1:20 + 1:21).
 */
export function LoginCrosshairLogo(): React.JSX.Element {
  return (
    <Svg width={88} height={88} viewBox="0 0 88 88" fill="none">
      <Circle cx={44} cy={44} r={43} fill="#CCFBF1" stroke="#0D9488" strokeWidth={1.5} />
      <G transform="translate(28.5, 28.5)">
        <Path
          d="M15.5 1.5V29.5M1.5 15.5H29.5"
          stroke="#0D9488"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Path
          d="M23.5 15.5C23.5 19.9183 19.9183 23.5 15.5 23.5C11.0817 23.5 7.5 19.9183 7.5 15.5C7.5 11.0817 11.0817 7.5 15.5 7.5C19.9183 7.5 23.5 11.0817 23.5 15.5Z"
          stroke="#0D9488"
          strokeWidth={2.5}
        />
      </G>
    </Svg>
  );
}

/**
 * Icono de Corazón del Portal Paciente en el TopHeader (nodo 1:65 + 1:66).
 */
export function PatientHeaderHeartIcon(): React.JSX.Element {
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
      <Rect width={40} height={40} rx={12} fill="#CCFBF1" />
      <G transform="translate(9.2, 10.5)">
        <Path
          d="M10 19L8.6 17.7C3.5 13.2 0 10 0 6C0 2.7 2.7 0 6 0C7.9 0 9.7 0.899999 10.8 2.3C11.9 0.899999 13.7 0 15.6 0C18.9 0 21.6 2.7 21.6 6C21.6 10 18.1 13.2 13 17.7L10 19Z"
          fill="#0D9488"
        />
      </G>
    </Svg>
  );
}

/**
 * Icono de Estetoscopio / Médico del Portal Médico en el TopHeader (nodo 1:548 + 1:549 + 1:550).
 */
export function DoctorHeaderScopeIcon({ size = 40 }: { size?: number }): React.JSX.Element {
  const isLarge = size === 60;
  if (isLarge) {
    return (
      <Svg width={60} height={60} viewBox="0 0 60 60" fill="none">
        <Circle cx={30} cy={30} r={30} fill="#CCFBF1" />
        <G transform="translate(23, 18)">
          <Path
            d="M12 10C12 12.7614 9.76142 15 7 15C4.23858 15 2 12.7614 2 10C2 7.23858 4.23858 5 7 5C9.76142 5 12 7.23858 12 10Z"
            stroke="#0D9488"
            strokeWidth={2}
          />
          <Path
            d="M7 1V6M7 1H2M7 1H12M4 16V18C4 19.6569 5.34315 21 7 21C8.65685 21 10 19.6569 10 18V16"
            stroke="#0D9488"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    );
  }
  return (
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
      <Rect width={40} height={40} rx={12} fill="#CCFBF1" />
      <G transform="translate(14, 9)">
        <Path
          d="M11 11C11 13.7614 8.76142 16 6 16C3.23858 16 1 13.7614 1 11C1 8.23858 3.23858 6 6 6C8.76142 6 11 8.23858 11 11Z"
          stroke="#0D9488"
          strokeWidth={2}
        />
        <Path
          d="M6 1V6M6 1H1M6 1H11M3 16V18C3 19.6569 4.34315 21 6 21C7.65685 21 9 19.6569 9 18V16"
          stroke="#0D9488"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
}

/**
 * Icono de Pulso / ECG en la tarjeta de Cirugía de Evaluación (nodo 1:73 + 1:74).
 */
export function PulseSurgeryIcon(): React.JSX.Element {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
      <Rect width={36} height={36} rx={10} fill="#CCFBF1" />
      <G transform="translate(6.9, 9.9)">
        <Path
          d="M1.1 8.10001H4.1L7.1 1.10001L11.1 15.1L14.1 5.10001L17.1 8.10001H21.1"
          stroke="#0D9488"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

/**
 * Icono circular grande de Cámara en la tarjeta "Tomar Fotografía" (nodo 1:85 + 1:86).
 */
export function LargeCameraCircleIcon(): React.JSX.Element {
  return (
    <Svg width={96} height={96} viewBox="0 0 96 96" fill="none">
      <Circle cx={48} cy={48} r={48} fill="#CCFBF1" />
      <G transform="translate(25.5, 31.5)">
        <Path
          d="M7.5 1.5H37.5C40.8137 1.5 43.5 4.18629 43.5 7.5V25.5C43.5 28.8137 40.8137 31.5 37.5 31.5H7.5C4.18629 31.5 1.5 28.8137 1.5 25.5V7.5C1.5 4.18629 4.18629 1.5 7.5 1.5Z"
          stroke="#0D9488"
          strokeWidth={3}
        />
        <Path
          d="M30.5 16.5C30.5 20.9183 26.9183 24.5 22.5 24.5C18.0817 24.5 14.5 20.9183 14.5 16.5C14.5 12.0817 18.0817 8.5 22.5 8.5C26.9183 8.5 30.5 12.0817 30.5 16.5Z"
          stroke="#0D9488"
          strokeWidth={3}
        />
        <Path
          d="M33.5 9.5C34.6046 9.5 35.5 8.60457 35.5 7.5C35.5 6.39543 34.6046 5.5 33.5 5.5C32.3954 5.5 31.5 6.39543 31.5 7.5C31.5 8.60457 32.3954 9.5 33.5 9.5Z"
          fill="#0D9488"
        />
      </G>
    </Svg>
  );
}

/**
 * Icono pequeño de Cámara para el botón "Abrir Cámara" y la pestaña Evaluación (nodo 1:95 / 1:110).
 */
export function SmallCameraIcon({ color = '#FFFFFF' }: { color?: string }): React.JSX.Element {
  return (
    <Svg width={22} height={16} viewBox="0 0 22 16" fill="none">
      <Path
        d="M4 1H18C19.6569 1 21 2.34315 21 4V12C21 13.6569 19.6569 15 18 15H4C2.34315 15 1 13.6569 1 12V4C1 2.34315 2.34315 1 4 1Z"
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M14.5 8C14.5 9.933 12.933 11.5 11 11.5C9.067 11.5 7.5 9.933 7.5 8C7.5 6.067 9.067 4.5 11 4.5C12.933 4.5 14.5 6.067 14.5 8Z"
        stroke={color}
        strokeWidth={1.8}
      />
    </Svg>
  );
}

/**
 * Icono de Galería para el botón "Galería" (nodo 1:101).
 */
export function GalleryIcon({ color = '#0F172A' }: { color?: string }): React.JSX.Element {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M4 1H16C17.6569 1 19 2.34315 19 4V16C19 17.6569 17.6569 19 16 19H4C2.34315 19 1 17.6569 1 16V4C1 2.34315 2.34315 1 4 1Z"
        stroke={color}
        strokeWidth={2}
      />
      <Path
        d="M6 7.5C6.82843 7.5 7.5 6.82843 7.5 6C7.5 5.17157 6.82843 4.5 6 4.5C5.17157 4.5 4.5 5.17157 4.5 6C4.5 6.82843 5.17157 7.5 6 7.5Z"
        fill={color}
      />
      <Path
        d="M1 15L6 10L10 14L15 8L19 15"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Icono de Refrescar / Actualizar en encabezados de sección (nodo 1:155, 1:385).
 */
export function RefreshIcon(): React.JSX.Element {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Path
        d="M16.9995 9.08617C16.9796 10.9358 16.3194 12.7214 15.1311 14.139C13.9429 15.5566 12.3001 16.5187 10.4824 16.8615C8.66471 17.2042 6.78438 16.9065 5.16147 16.019C3.53856 15.1314 2.27336 13.7089 1.5812 11.9936C0.889035 10.2782 0.812685 8.37599 1.36514 6.61067C1.9176 4.84535 3.06473 3.32603 4.61129 2.31128C6.15785 1.29653 8.00826 0.849064 9.84759 1.04504C11.6869 1.24102 13.4015 2.06833 14.6995 3.38617L16.9995 6.08617M11.9995 6.08617H16.9995V1.08617"
        stroke="#0D9488"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Icono de Destellos IA (Sparkles) en "Plan Médico del Día" y "Consejo de Recuperación IA" (nodo 1:167, 1:303).
 */
export function SparklesAiIcon(): React.JSX.Element {
  return (
    <Svg width={13} height={14} viewBox="0 0 12.7 13.4" fill="none">
      <Path
        d="M4 0L5 3L8 4L5 5L4 8L3 5L0 4L3 3L4 0ZM10 8L10.7 10L12.7 10.7L10.7 11.4L10 13.4L9.3 11.4L7.3 10.7L9.3 10L10 8Z"
        fill="#0D9488"
      />
    </Svg>
  );
}

/**
 * Icono de Descarga para "Descargar PDF" y "Descargar Reporte en PDF" (nodo 1:173, 1:270).
 */
export function DownloadPdfIcon({ color = '#FFFFFF' }: { color?: string }): React.JSX.Element {
  return (
    <Svg width={14} height={12} viewBox="0 0 14 12" fill="none">
      <Path
        d="M1 7V11H13V7M7 1V9M10 6L7 9L4 6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Icono de Medalla / Insignia Oficial en el Modal "Reporte Clínico Oficial" (nodo 1:232 + 1:233).
 */
export function OfficialRibbonIcon(): React.JSX.Element {
  return (
    <Svg width={18} height={24} viewBox="0 0 18 24" fill="none">
      <Circle cx={9} cy={9} r={8} stroke="#0D9488" strokeWidth={2} />
      <Path d="M1 16L4 23L9 20L14 23L17 16" fill="#0D9488" />
    </Svg>
  );
}

/**
 * Ilustración vectorial de la incisión quirúrgica con línea de sutura para Foto #1 y Foto #2 del Modal (nodo 1:242).
 */
export function WoundIncisionGraphic({ variant = 1 }: { variant?: 1 | 2 }): React.JSX.Element {
  if (variant === 2) {
    return (
      <Svg width={128} height={35} viewBox="0 0 128 35" fill="none">
        <Path
          d="M4 24C29 9 44 49 64 19C84 -11 104 34 124 4"
          stroke="#CBD5E1"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <Line
          x1={14}
          y1={20}
          x2={114}
          y2={20}
          stroke="#0D9488"
          strokeWidth={3}
          strokeDasharray="4 4"
        />
      </Svg>
    );
  }
  return (
    <Svg width={118} height={29} viewBox="0 0 118 29" fill="none">
      <Path
        d="M4 23.28C24 -1.72 44 43.28 64 13.28C84 -16.72 99 38.28 114 8.28"
        stroke="#CBD5E1"
        strokeWidth={8}
        strokeLinecap="round"
      />
      <Line
        x1={14}
        y1={19}
        x2={104}
        y2={19}
        stroke="#0D9488"
        strokeWidth={3}
        strokeDasharray="4 4"
      />
    </Svg>
  );
}

/**
 * Icono de Escudo de Verificación en "Documento Clínico Digital Verificado • Visual RAG" (nodo 1:266).
 */
export function VerifiedShieldIcon(): React.JSX.Element {
  return (
    <Svg width={18} height={22} viewBox="0 0 18 21.2" fill="none">
      <Path
        d="M9 1.068L17 4.068V10.068C17 15.068 13 18.068 9 20.068C5 18.068 1 15.068 1 10.068V4.068L9 1.068Z"
        stroke="#0D9488"
        strokeWidth={2}
      />
    </Svg>
  );
}

/**
 * Icono de Calendario / Cronograma Quirúrgico (nodo 1:389 + 1:390, 1:652 + 1:653).
 */
export function SurgeryCalendarIcon({ size = 38 }: { size?: number }): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 38 38" fill="none">
      <Rect width={38} height={38} rx={10} fill="#CCFBF1" />
      <Rect
        x={7}
        y={8}
        width={24}
        height={22}
        rx={4}
        stroke="#0D9488"
        strokeWidth={2}
      />
      <Line x1={7} y1={14} x2={31} y2={14} stroke="#0D9488" strokeWidth={1.8} />
    </Svg>
  );
}

/**
 * Icono de Acciones Prohibidas (nodo 1:407 + 1:408 + 1:409, 1:663 + 1:664).
 */
export function ProhibitedActionIcon({ size = 38 }: { size?: number }): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 38 38" fill="none">
      <Rect width={38} height={38} rx={10} fill="#CCFBF1" />
      <Circle cx={19} cy={19} r={10} stroke="#0D9488" strokeWidth={2.2} />
      <Line x1={12} y1={12} x2={26} y2={26} stroke="#0D9488" strokeWidth={2.2} />
    </Svg>
  );
}

/**
 * Icono de Cuidados Permitidos / Curaciones (nodo 1:419 + 1:420 + 1:421, 1:671 + 1:672).
 */
export function AllowedCareIcon({ size = 38 }: { size?: number }): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 38 38" fill="none">
      <Rect width={38} height={38} rx={10} fill="#CCFBF1" />
      <Circle cx={19} cy={19} r={10} stroke="#0D9488" strokeWidth={2.2} />
      <Path
        d="M14 19.5L17.5 23L24 16"
        stroke="#0D9488"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Icono de Alergias & Urgencias (Triángulo de Alerta - nodo 1:679 + 1:680).
 */
export function AlertTriangleIcon({ size = 34 }: { size?: number }): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 34 34" fill="none">
      <Rect width={34} height={34} rx={10} fill="#CCFBF1" />
      <Path
        d="M17 10L25 24H9L17 10Z"
        stroke="#0D9488"
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Avatar circular de Usuario / Paciente (nodos 1:476, 1:566, 1:642).
 */
export function UserAvatarCircleIcon({ size = 40 }: { size?: number }): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <Circle cx={30} cy={30} r={30} fill="#CCFBF1" />
      <Circle cx={30} cy={24} r={9} stroke="#0D9488" strokeWidth={2.5} />
      <Path
        d="M16 43C16 37.5 22.3 35 30 35C37.7 35 44 37.5 44 43"
        stroke="#0D9488"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Icono de Modo de Visualización (Claro/Oscuro) en Perfil (nodo 1:487 + 1:488).
 */
export function ThemeModeIcon(): React.JSX.Element {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Circle cx={14} cy={14} r={14} fill="#CCFBF1" />
      <Circle cx={14} cy={14} r={6} stroke="#0D9488" strokeWidth={2} />
    </Svg>
  );
}

/**
 * Icono de Lupa de Búsqueda en "Mis Pacientes" (nodo 1:561 + 1:562).
 */
export function SearchLoupeIcon(): React.JSX.Element {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
      <Circle cx={7.5} cy={7.5} r={6} stroke="#64748B" strokeWidth={1.8} />
      <Line
        x1={12.2}
        y1={12.2}
        x2={16.8}
        y2={16.8}
        stroke="#64748B"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Icono de pestaña Reportes en la barra de navegación inferior (nodo 1:114).
 */
export function TabReportsIcon({ color = '#64748B' }: { color?: string }): React.JSX.Element {
  return (
    <Svg width={18} height={20} viewBox="0 0 18 20" fill="none">
      <Rect x={1} y={1} width={16} height={18} rx={2.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

/**
 * Icono de pestaña Órdenes / Ficha en la barra de navegación inferior (nodo 1:119, 1:604).
 */
export function TabOrdersIcon({ color = '#64748B' }: { color?: string }): React.JSX.Element {
  return (
    <Svg width={18} height={20} viewBox="0 0 18 20" fill="none">
      <Rect x={1} y={1} width={16} height={18} rx={2.5} stroke={color} strokeWidth={2} />
      <Line x1={5} y1={6} x2={13} y2={6} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Line
        x1={5}
        y1={11}
        x2={13}
        y2={11}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Line
        x1={5}
        y1={15}
        x2={10}
        y2={15}
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * Icono de pestaña Perfil en la barra de navegación inferior (nodo 1:125, 1:609).
 */
export function TabProfileIcon({ color = '#64748B' }: { color?: string }): React.JSX.Element {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Circle cx={8} cy={6} r={4.5} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

/**
 * Icono de pestaña Pacientes en la barra inferior del Doctor (nodo 1:600 + 1:601).
 */
export function TabDoctorPatientsIcon({ color = '#0D9488' }: { color?: string }): React.JSX.Element {
  return (
    <Svg width={24} height={16} viewBox="0 0 24 16" fill="none">
      <Circle cx={7.5} cy={7.5} r={3.5} stroke={color} strokeWidth={2} />
      <Circle cx={17} cy={6} r={3} stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}
