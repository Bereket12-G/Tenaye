/**
 * Global type definitions for Challenge Portal
 */

// Challenge Types
export interface Challenge {
  id: string
  title: string
  description: string
  category: string
  durationDays: number
  estimatedDailyMinutes: number
  guidelines: string[]
}

// Community Types
export interface Profile {
  name: string
  avatar: string
  flair: string
}

export interface Comment {
  id: string
  author: Profile
  content: string
  ts: number
}

export interface Post {
  id: string
  author: Profile
  content: string
  mood?: string
  ts: number
  reactions: Record<string, number>
  comments: Comment[]
}

// Leaderboard Types
export interface Player {
  id: string
  userId?: string
  name: string
  emoji: string
  kindness: number
  streak: number
  highFives: number
  flair: string
}

export interface Snapshot {
  deviceId: string
  capturedAt: number
  players: Player[]
}

// Progress Types
export interface ProgressLog {
  date: string
  emoji: string
}

export interface Badge {
  name: string
  icon: string
  desc: string
}

// Team Types
export interface Runner {
  id: string
  name: string
  emoji: string
  color: string
  steps: number
}

export interface RaceState {
  target: number
  autoSim: boolean
  youId: string | null
  runners: Runner[]
  winnerId: string | null
}

export interface Team {
  id: string
  name: string
  emoji: string
  colorId: string
  chant: string
  members: number
  cheers: number
  createdAt: number
}

// Storage Types
export interface StorageItem<T> {
  value: T
  timestamp: number
  version?: string
}

// UI Types
export interface Theme {
  id: string
  name: string
  classes: string
}

// Audio Types
export interface AudioConfig {
  frequency: number
  duration: number
  type: 'square' | 'sine' | 'triangle' | 'sawtooth'
}

// Motion Types
export interface MotionConfig {
  sensitivity: number
  debounce: number
  enabled: boolean
}

// App Configuration Types
export interface AppConfig {
  name: string
  description: string
  version: string
  author: string
  repository: string
}

export interface FeatureFlags {
  pwa: boolean
  analytics: boolean
  debugMode: boolean
  serviceWorker: boolean
}

// Validation Types
export interface ValidationRule {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  required?: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Performance Types
export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  storageUsage: number
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: number
}

// Event Types
export interface AppEvent {
  type: string
  data: any
  timestamp: number
  userId?: string
}

// Navigation Types
export interface NavigationItem {
  path: string
  label: string
  icon?: string
  badge?: number
  disabled?: boolean
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio'
  value: any
  required?: boolean
  validation?: ValidationRule[]
  options?: { label: string; value: any }[]
  placeholder?: string
  helperText?: string
}

export interface FormState {
  fields: Record<string, FormField>
  errors: Record<string, string[]>
  isValid: boolean
  isDirty: boolean
  isSubmitting: boolean
}

// API Types (for future use)
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

export interface ApiError {
  code: string
  message: string
  details?: any
  status: number
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredFields<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type Nullable<T> = T | null

export type Undefinable<T> = T | undefined

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = Awaited<ReturnType<T>>

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  text?: string
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export interface TooltipProps extends BaseComponentProps {
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  disabled?: boolean
}

// Animation Types
export interface AnimationConfig {
  duration: number
  easing: string
  delay?: number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  iterationCount?: number | 'infinite'
}

// Accessibility Types
export interface A11yProps {
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-labelledby'?: string
  'aria-hidden'?: boolean
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-checked'?: boolean
  'aria-selected'?: boolean
  'aria-disabled'?: boolean
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  role?: string
  tabIndex?: number
}