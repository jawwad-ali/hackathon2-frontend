/**
 * Design Tokens - TypeScript Constants
 *
 * These constants mirror the CSS custom properties defined in globals.css.
 * Use these for type-safe access to design tokens in components.
 */

// ============================================
// Colors
// ============================================

export const colors = {
  // Primary Colors
  primary: '#10B981',
  primaryLight: '#D1FAE5',
  primaryDark: '#059669',

  // Neutral Colors
  bgPage: '#F9FAFB',
  bgCard: '#FFFFFF',
  borderLight: '#E5E7EB',
  borderMedium: '#D1D5DB',

  // Text Colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',

  // Dark/Button Colors
  dark: '#1F2937',
  darkHover: '#374151',

  // Gradient for Pro Plan Card
  gradientStart: '#10B981',
  gradientEnd: '#34D399',
} as const;

// ============================================
// Shadows
// ============================================

export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
} as const;

// ============================================
// Border Radius
// ============================================

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

// ============================================
// Spacing
// ============================================

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
} as const;

// ============================================
// Typography
// ============================================

export const fontSize = {
  xs: '12px',
  sm: '13px',
  base: '14px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
} as const;

export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.625,
} as const;

export const fontFamily = {
  sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
} as const;

// ============================================
// Layout Constants
// ============================================

export const layout = {
  headerHeight: '64px',
  sidebarWidth: '300px',
  floatingActionsWidth: '80px',
  maxContentWidth: '1400px',
  containerPadding: '24px',
  messageMaxWidth: '70%',
} as const;

// ============================================
// Navigation Items
// ============================================

export const navItems = [
  { label: 'Chat', href: '/', active: true },
  { label: 'My Project', href: '/projects', active: false },
  { label: 'Brand Voice', href: '/brand-voice', active: false },
  { label: 'Templates', href: '/templates', active: false },
  { label: 'Tools', href: '/tools', active: false },
] as const;

// ============================================
// Mock History Items (for sidebar)
// ============================================

export const mockHistoryItems = [
  {
    id: '1',
    text: 'Write a persuasive email to convince potential customers to try our service',
  },
  {
    id: '2',
    text: 'Write a script for a training video on how to use our software',
  },
  {
    id: '3',
    text: 'Generate a script for a 30-second commercial promoting our new product',
  },
  {
    id: '4',
    text: 'Tell me what is Artificial Intelligence?',
  },
  {
    id: '5',
    text: 'What can Artificial Intelligence do?',
  },
] as const;

// ============================================
// Animation/Transition
// ============================================

export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
} as const;

// ============================================
// Z-Index Scale
// ============================================

export const zIndex = {
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
} as const;

// ============================================
// Type Exports
// ============================================

export type NavItem = (typeof navItems)[number];
export type HistoryItem = (typeof mockHistoryItems)[number];
