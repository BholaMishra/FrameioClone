export const COLORS = {
  primary: '#6366f1',
  secondary: '#f59e0b',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  light: '#f8fafc',
  dark: '#1f2937',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

export const DRAWING_COLORS = [
  '#ff0000', // Red
  '#00ff00', // Green
  '#0000ff', // Blue
  '#ffff00', // Yellow
  '#ff00ff', // Magenta
  '#00ffff', // Cyan
  '#ffa500', // Orange
  '#800080', // Purple
  '#000000', // Black
  '#ffffff', // White
];

export const VIDEO_URLS = {
  SAMPLE: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  SAMPLE_2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  SAMPLE_3: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
};

export const APP_CONFIG = {
  VIDEO_UPDATE_INTERVAL: 100, // milliseconds
  COMMENT_TIME_TOLERANCE: 2, // seconds
  MAX_COMMENT_LENGTH: 500,
  DRAWING_STROKE_WIDTH: 3,
  AUTO_SAVE_INTERVAL: 5000, // milliseconds
};

export const DIMENSIONS = {
  VIDEO_HEIGHT_RATIO: 0.35,
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 60,
};

export const STORAGE_KEYS = {
  COMMENTS: '@frameio_comments',
  DRAWINGS: '@frameio_drawings',
  USER_PREFERENCES: '@frameio_preferences',
  LAST_VIDEO_TIME: '@frameio_last_video_time',
};

export const SCREEN_NAMES = {
  HOME: 'Home',
  VIDEO_REVIEW: 'VideoReview',
};

export const GESTURE_STATES = {
  BEGAN: 'BEGAN',
  END: 'END',
  ACTIVE: 'ACTIVE',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED',
};

export const MEDIA_TYPES = {
  VIDEO: 'video',
  IMAGE: 'image',
};

export const ERROR_MESSAGES = {
  VIDEO_LOAD_ERROR: 'Unable to load video. Please check your connection and try again.',
  STORAGE_ERROR: 'Unable to save data. Please try again.',
  PERMISSION_DENIED: 'Permission denied. Please allow access in settings.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
};