/**
 * Admin Design System Tokens
 *
 * Centralized design tokens for consistent UI across the admin dashboard.
 * Use these instead of arbitrary Tailwind values.
 */

// ─── Border Radius Scale ───────────────────────────────────────
export const radius = {
  none: '0px',
  sm: '8px',      // Small: buttons, small inputs
  md: '12px',     // Medium: badges, chips
  lg: '16px',     // Large: cards, modals
  xl: '20px',     // Extra large: featured cards
  '2xl': '24px',  // 2XL: main cards, panels
  '3xl': '32px',  // 3XL: hero sections
  full: '9999px', // Pill-shaped: buttons, tags
} as const;

export type RadiusKey = keyof typeof radius;

// ─── Border Width ──────────────────────────────────────────────
export const borderWidth = {
  none: '0px',
  hair: '1px',
  normal: '2px',
} as const;

// ─── Border Colors (Light Mode / Dark Mode) ────────────────────
export const borderColor = {
  subtle: { light: 'border-gray-200', dark: 'dark:border-white/5' },
  default: { light: 'border-gray-300', dark: 'dark:border-white/10' },
  strong: { light: 'border-gray-400', dark: 'dark:border-white/20' },
  primary: { light: 'border-primary', dark: 'dark:border-primary/20' },
} as const;

// ─── Background Colors ─────────────────────────────────────────
export const background = {
  // Page backgrounds
  page: { light: 'bg-gray-50', dark: 'dark:bg-[#050505]' },
  surface: { light: 'bg-white', dark: 'dark:bg-[#0A0A0A]' },
  surfaceAlt: { light: 'bg-gray-50', dark: 'dark:bg-[#111111]' },

  // Interactive
  hover: { light: 'bg-gray-100', dark: 'dark:bg-white/5' },
  active: { light: 'bg-gray-200', dark: 'dark:bg-white/10' },

  // Status backgrounds (subtle)
  success: { light: 'bg-green-50', dark: 'dark:bg-green-500/10' },
  warning: { light: 'bg-amber-50', dark: 'dark:bg-amber-500/10' },
  error: { light: 'bg-red-50', dark: 'dark:bg-red-500/10' },
  info: { light: 'bg-blue-50', dark: 'dark:bg-blue-500/10' },
} as const;

// ─── Text Colors ───────────────────────────────────────────────
export const text = {
  primary: { light: 'text-gray-900', dark: 'dark:text-white' },
  secondary: { light: 'text-gray-600', dark: 'dark:text-gray-300' },
  tertiary: { light: 'text-gray-500', dark: 'dark:text-gray-400' },
  muted: { light: 'text-gray-400', dark: 'dark:text-gray-500' },

  // Status colors
  success: 'text-green-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
  info: 'text-blue-500',
} as const;

// ─── Font Sizes ────────────────────────────────────────────────
export const fontSize = {
  xs: '10px',     // Micro labels, badges
  sm: '11px',     // Small labels, timestamps
  base: '13px',   // Body text (compact UI)
  lg: '15px',     // Large body
  xl: '18px',     // Small headings
  '2xl': '20px',  // Section titles
  '3xl': '24px',  // Page titles
  '4xl': '32px',  // Hero, stats
} as const;

// ─── Font Weights ──────────────────────────────────────────────
export const fontWeight = {
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// ─── Spacing Scale ─────────────────────────────────────────────
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
} as const;

// ─── Shadow Definitions ────────────────────────────────────────
export const shadow = {
  sm: 'shadow-sm',
  default: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  primary: 'shadow-primary/20',
  none: 'shadow-none',
} as const;

// ─── Transition Classes ────────────────────────────────────────
export const transition = {
  fast: 'transition-all duration-200',
  default: 'transition-all duration-300',
  slow: 'transition-all duration-500',
  premium: 'transition-premium', // Custom class from globals.css
} as const;

// ─── Helper: Build card class with consistent styling ─────────
export function cardClasses(extraClasses?: string): string {
  const base = 'rounded-[24px] border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0A0A0A] shadow-sm';
  const hover = 'hover:border-primary/50 transition-all duration-300';
  return [base, hover, extraClasses].filter(Boolean).join(' ');
}

// ─── Helper: Button variants ───────────────────────────────────
export function buttonVariant(variant: 'primary' | 'secondary' | 'ghost' | 'danger'): string {
  switch (variant) {
    case 'primary':
      return 'bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:scale-95';
    case 'secondary':
      return 'bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs px-4 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm';
    case 'ghost':
      return 'text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-all';
    case 'danger':
      return 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-bold text-xs px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95';
  }
}

// ─── Helper: Status badge classes ──────────────────────────────
export const statusBadge = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20',
  paid: 'bg-blue-500/10 text-blue-600 dark:text-blue-500 border-blue-500/20',
  office: 'bg-purple-500/10 text-purple-600 dark:text-purple-500 border-purple-500/20',
  confirmed: 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20',
  completed: 'bg-gray-500/10 text-gray-600 dark:text-gray-500 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-600 dark:text-red-500 border-red-500/20',
  overbooked: 'bg-red-600/10 text-red-600 dark:text-red-600 border-red-600/20 animate-pulse',
  active: 'bg-green-500/10 text-green-600 dark:text-green-500 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-600 dark:text-gray-500 border-gray-500/20',
} as const;