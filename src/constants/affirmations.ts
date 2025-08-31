export interface Affirmation {
  id: string;
  text: string;
  category: string;
  isPremium?: boolean;
}

export const CATEGORIES = {
  MOTIVATION: 'motivation',
  LOVE: 'love',
  FOCUS: 'focus',
  GRATITUDE: 'gratitude',
} as const;

export type CategoryType = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const DEFAULT_AFFIRMATIONS: Affirmation[] = [
  // Free affirmations
  {
    id: '1',
    text: 'I am capable of amazing things.',
    category: CATEGORIES.MOTIVATION,
  },
  {
    id: '2',
    text: 'I choose to focus on what I can control.',
    category: CATEGORIES.FOCUS,
  },
  {
    id: '3',
    text: 'I am grateful for all the opportunities in my life.',
    category: CATEGORIES.GRATITUDE,
  },
  {
    id: '4',
    text: 'I am worthy of love and respect.',
    category: CATEGORIES.LOVE,
  },
  {
    id: '5',
    text: 'Every day I am becoming a better version of myself.',
    category: CATEGORIES.MOTIVATION,
  },
  
  // Premium affirmations
  {
    id: '6',
    text: 'I trust in my ability to overcome any challenge.',
    category: CATEGORIES.MOTIVATION,
    isPremium: true,
  },
  {
    id: '7',
    text: 'My mind is clear and focused on my goals.',
    category: CATEGORIES.FOCUS,
    isPremium: true,
  },
  {
    id: '8',
    text: 'I attract abundance and prosperity into my life.',
    category: CATEGORIES.GRATITUDE,
    isPremium: true,
  },
  {
    id: '9',
    text: 'I radiate love and positivity to everyone around me.',
    category: CATEGORIES.LOVE,
    isPremium: true,
  },
  {
    id: '10',
    text: 'I am the architect of my own happiness.',
    category: CATEGORIES.MOTIVATION,
    isPremium: true,
  },
];

export const FREE_DAILY_LIMIT = 1;
export const STORAGE_KEYS = {
  FAVORITES: '@affirmation_favorites',
  DAILY_USAGE: '@daily_usage',
  LAST_USED_DATE: '@last_used_date',
  PREMIUM_STATUS: '@premium_status',
} as const;