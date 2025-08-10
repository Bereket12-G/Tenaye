/**
 * Helper utilities for Challenge Portal
 */

import { EMOJIS } from './constants'

/**
 * Merge class names with conditional logic
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Pick a random item from an array
 */
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return date.toLocaleString(undefined, { ...defaultOptions, ...options })
}

/**
 * Format a timestamp to a readable string
 */
export function formatTimestamp(timestamp: number, options?: Intl.DateTimeFormatOptions): string {
  return formatDate(new Date(timestamp), options)
}

/**
 * Get the start of a day
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Convert a date to a key string (YYYY-MM-DD)
 */
export function dateToKey(date: Date): string {
  return startOfDay(date).toISOString().slice(0, 10)
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return dateToKey(date) === dateToKey(today)
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return dateToKey(date) === dateToKey(yesterday)
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  return 'Just now'
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

/**
 * Generate a random emoji from a category
 */
export function randomEmoji(category: keyof typeof EMOJIS = 'FUN'): string {
  return pickRandom([...EMOJIS[category]])
}

/**
 * Generate a random name
 */
export function generateRandomName(): string {
  const adjectives = ['Sparkly', 'Cozy', 'Giggle', 'Zen', 'Turbo', 'Chaotic', 'Glorious', 'Sneaky', 'Cosmic', 'Wholesome']
  const nouns = ['Otters', 'Yogis', 'Ninjas', 'Wizards', 'Pandas', 'Koalas', 'Fireflies', 'Cacti', 'Muffins', 'Comets']
  
  return `The ${pickRandom(adjectives)} ${pickRandom(nouns)}`
}

/**
 * Generate a random flair
 */
export function generateFlair(keywords: string = ''): string {
  const vibes = ['Zen', 'Sparkly', 'Turbo', 'Cozy', 'Chaotic', 'Wholesome', 'Sneaky', 'Glorious', 'Giggle', 'Cosmic']
  const nouns = ['Noodle', 'Ninja', 'Walrus', 'Wizard', 'Tornado', 'Muffin', 'Comet', 'Yogi', 'Disco', 'Koala']
  const extras = ['of Joy', 'of Calm', 'of Snacks', 'of Chaos', 'of Vibes', 'of Sunshine', 'of Shenanigans']
  const emojis = ['✨', '🌈', '🧘', '🎉', '💪']
  
  const kw = keywords.trim()
  const kwPart = kw ? ` ${kw.split(/[,\s]+/).filter(Boolean)[0]}` : ''
  
  return `${pickRandom(vibes)} ${pickRandom(nouns)}${kwPart} ${pickRandom(extras)} ${pickRandom(emojis)}`
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.min(100, Math.round((value / total) * 100))
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Check if device supports motion sensors
 */
export function supportsMotionSensors(): boolean {
  return 'DeviceMotionEvent' in window || 'Accelerometer' in window
}

/**
 * Check if device supports audio context
 */
export function supportsAudioContext(): boolean {
  return 'AudioContext' in window || 'webkitAudioContext' in window
}

/**
 * Check if running in PWA mode
 */
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true
}

/**
 * Check if running on mobile device
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  return /Android/.test(navigator.userAgent)
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    }
  } catch (error) {
    console.warn('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Download data as a file
 */
export function downloadFile(data: string, filename: string, type: string = 'application/json'): void {
  const blob = new Blob([data], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length) + suffix
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}

/**
 * Generate a random color
 */
export function randomColor(): string {
  const colors = ['emerald', 'sky', 'violet', 'amber', 'rose', 'indigo', 'lime', 'pink', 'cyan', 'orange']
  return pickRandom(colors)
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await sleep(baseDelay * Math.pow(2, i))
      }
    }
  }
  
  throw lastError!
}