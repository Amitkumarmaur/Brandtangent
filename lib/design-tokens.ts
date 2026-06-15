/**
 * Brandtangent Design System Tokens
 * Reference for colors, spacing, typography, and other design values
 */

export const colors = {
  // Primary Palette
  navy: '#1A3A5C',
  skyBlue: '#0066CC',
  orange: '#FF7A2F',

  // Supporting Palette
  lightGrayBlue: '#F7F9FB',
  slateGray: '#5A6A7A',
  white: '#FFFFFF',
  borderBlue: '#E0E8F0',

  // Accent Tints
  blueTint: '#E6F0FF',
  orangeTint: '#FFF0E6',
  tealTint: '#E6F5F0',

  // Additional
  destructive: '#DC2626',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
  '2xl': '64px',
  '3xl': '96px',
} as const;

export const radius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  full: '999px',
} as const;

export const shadows = {
  sm: '0 2px 8px rgba(26, 58, 92, 0.06)',
  md: '0 2px 12px rgba(26, 58, 92, 0.08)',
  lg: '0 6px 24px rgba(26, 58, 92, 0.14)',
} as const;

export const typography = {
  fontFamily: {
    sans: "'Inter', 'DM Sans', system-ui, sans-serif",
    display: "'Sora', 'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'Geist Mono', monospace",
  },
  fontSize: {
    heroTitle: { size: '48px', weight: '700' },
    h2: { size: '32px', weight: '600' },
    h3: { size: '22px', weight: '600' },
    body: { size: '16px', weight: '400' },
    button: { size: '14px', weight: '500' },
    caption: { size: '12px', weight: '400' },
  },
} as const;

export const buttonStyles = {
  primary: {
    background: colors.orange,
    text: colors.white,
    border: 'none',
    radius: radius.sm,
    padding: '10px 22px',
    hoverBackground: '#E86920',
  },
  secondary: {
    background: 'transparent',
    text: colors.navy,
    border: `1.5px solid ${colors.navy}`,
    radius: radius.sm,
    padding: '10px 22px',
    hoverBackground: '#F0F5FB',
  },
  ghost: {
    background: 'transparent',
    text: colors.skyBlue,
    border: 'none',
    hoverText: 'underline',
  },
} as const;

export const componentGuides = {
  navbar: {
    background: colors.navy,
    logoColor: colors.white,
    navLinkColor: 'rgba(255,255,255,0.75)',
    navLinkHoverColor: colors.white,
    ctaButton: colors.orange,
  },
  heroSection: {
    background: colors.lightGrayBlue,
    eyebrowColor: colors.skyBlue,
    eyebrowSize: '11px',
    eyebrowWeight: 'bold',
    headlineColor: colors.navy,
    subtextColor: colors.slateGray,
  },
  serviceCard: {
    background: colors.white,
    border: colors.borderBlue,
    titleColor: colors.navy,
    titleWeight: '600',
    descriptionColor: colors.slateGray,
  },
  footer: {
    background: colors.navy,
    textColor: 'rgba(255,255,255,0.7)',
    linkHoverColor: colors.white,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
} as const;
