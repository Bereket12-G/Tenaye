/**
 * Application constants and configuration
 */

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_TITLE || 'Challenge Portal',
  DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Wellness challenges and progress tracking',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  AUTHOR: 'Challenge Portal Team',
  REPOSITORY: 'https://github.com/your-username/challenge-portal'
} as const

// Feature Flags
export const FEATURES = {
  PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE === 'true',
  SERVICE_WORKER: import.meta.env.VITE_ENABLE_SERVICE_WORKER === 'true'
} as const

// Storage Keys
export const STORAGE_KEYS = {
  COMMUNITY_POSTS: 'community-board-posts-v1',
  COMMUNITY_PROFILE: 'community-board-profile-v1',
  LEADERBOARD_PLAYERS: 'leaderboard-joy-players-v1',
  PROGRESS_LOGS: 'progress-playground-logs-v1',
  TEAM_STEPS: 'team-steps-arena-v1',
  TEAM_STUDIO_TEAMS: 'team-studio-teams-v1',
  TEAM_STUDIO_MEMBERSHIP: 'team-studio-membership-v1',
  PARTY_MODE: 'party-mode-v1',
  ONBOARDING_CHALLENGE: 'onboarding-challenge',
  ONBOARDING_TEAM: 'onboarding-team'
} as const

// UI Constants
export const UI = {
  BREAKPOINTS: {
    XS: 475,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
    '3XL': 1600
  },
  ANIMATIONS: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500
    },
    EASING: {
      EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
      EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
      EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  COLORS: {
    BRAND: {
      50: '#eefcf5',
      100: '#d6f7e6',
      200: '#b0efcf',
      300: '#80e2b3',
      400: '#4cd496',
      500: '#23c37d',
      600: '#16a569',
      700: '#148356',
      800: '#136745',
      900: '#0f5238'
    }
  }
} as const

// Challenge Configuration
export const CHALLENGE_CONFIG = {
  DEFAULT_TARGET_DAYS: 14,
  MAX_TARGET_DAYS: 365,
  MIN_TARGET_DAYS: 1,
  DEFAULT_DAILY_MINUTES: 15,
  MAX_DAILY_MINUTES: 120,
  MIN_DAILY_MINUTES: 1
} as const

// Motion Sensor Configuration
export const MOTION_CONFIG = {
  DEFAULT_SENSITIVITY: 1.2,
  MIN_SENSITIVITY: 0.5,
  MAX_SENSITIVITY: 3.0,
  DEFAULT_DEBOUNCE: 350,
  MIN_DEBOUNCE: 100,
  MAX_DEBOUNCE: 1000,
  GRAVITY: 9.81
} as const

// Audio Configuration
export const AUDIO_CONFIG = {
  DEFAULT_FREQUENCY: 660,
  DEFAULT_DURATION: 80,
  FANFARE_FREQUENCIES: [523.25, 659.25, 783.99, 1046.5], // C5 E5 G5 C6
  FANFARE_DURATION: 250,
  FANFARE_INTERVAL: 120
} as const

// Emoji Sets
export const EMOJIS = {
  AVATARS: ['🦄', '🐝', '🐢', '🐼', '🦊', '🐧', '🦋', '🦒', '🐨', '🦁', '🐯', '🐸'],
  REACTIONS: ['😂', '💪', '🌟', '🫶'],
  MOODS: ['🧘', '😄', '🌈', '🎉', '💪'],
  FOOTWEAR: ['👟', '🧦', '🦶', '👡', '🥾', '👢', '🩴', '👞'],
  TEAMS: ['🦦', '🍌', '🧘', '🦄', '🐼', '🐨', '🦋', '🌵', '🧁', '☄️'],
  FUN: ['✨', '🌈', '🧘', '🎉', '💪']
} as const

// Text Content
export const TEXT = {
  PLACEHOLDERS: {
    TEAM_NAME: 'Enter team name',
    TEAM_CHANT: 'Enter team chant',
    SEARCH_TEAMS: 'Search teams...',
    SEARCH_POSTS: 'Search posts',
    COMMENT: 'Add a comment...',
    DISPLAY_NAME: 'Display name',
    VIBE_KEYWORDS: 'Your vibe keywords (e.g., zen, snacks)',
    POST_CONTENT: 'Lighthearted thoughts, progress, or tips...'
  },
  MESSAGES: {
    NO_TEAMS: 'Join some teams to see them here!',
    NO_POSTS: 'No posts found for this category.',
    NO_SNAPSHOTS: 'No data yet. Export from the main Leaderboard, then import files here.',
    STORAGE_ERROR: 'Failed to save data. Please check your browser settings.',
    MOTION_NOT_SUPPORTED: 'Motion sensor not supported on this device.',
    AUDIO_ERROR: 'Audio playback not available.'
  }
} as const

// Validation Rules
export const VALIDATION = {
  TEAM_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50
  },
  POST_CONTENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500
  },
  COMMENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200
  },
  USER_NAME: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 30
  }
} as const

// Performance Configuration
export const PERFORMANCE = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  CACHE_DURATION: parseInt(import.meta.env.VITE_CACHE_DURATION || '3600'),
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
} as const