import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  PRIMARY: '#6C5CE7',
  SECONDARY: '#A29BFE',
  ACCENT: '#FD79A8',
  BACKGROUND: '#F8F9FA',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#2D3436',
  TEXT_SECONDARY: '#636E72',
  TEXT_LIGHT: '#B2BEC3',
  SUCCESS: '#00B894',
  WARNING: '#FDCB6E',
  ERROR: '#E17055',
  PREMIUM: '#F39C12',
} as const;

export const FONTS = {
  REGULAR: 'System',
  MEDIUM: 'System',
  BOLD: 'System',
  LIGHT: 'System',
} as const;

export const FONT_SIZES = {
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 20,
  EXTRA_LARGE: 24,
  TITLE: 32,
} as const;

export const SPACING = {
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  EXTRA_LARGE: 32,
} as const;

export const DIMENSIONS = {
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
  BORDER_RADIUS: 12,
  BUTTON_HEIGHT: 50,
} as const;

export const ANIMATIONS = {
  DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
  EASING: {
    EASE_IN_OUT: [0.4, 0, 0.2, 1],
    EASE_OUT: [0, 0, 0.2, 1],
    EASE_IN: [0.4, 0, 1, 1],
  },
} as const;