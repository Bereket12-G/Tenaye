/**
 * Storage utilities for Challenge Portal
 * Provides safe localStorage operations with error handling
 */

export interface StorageItem<T> {
  value: T
  timestamp: number
  version?: string
}

export class StorageManager {
  private static readonly APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'
  private static readonly DEFAULT_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

  /**
   * Safely get an item from localStorage
   */
  static get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return defaultValue || null

      const parsed: StorageItem<T> = JSON.parse(item)
      
      // Check if item is expired
      if (parsed.timestamp && Date.now() - parsed.timestamp > this.DEFAULT_TTL) {
        this.remove(key)
        return defaultValue || null
      }

      // Check version compatibility
      if (parsed.version && parsed.version !== this.APP_VERSION) {
        this.remove(key)
        return defaultValue || null
      }

      return parsed.value
    } catch (error) {
      console.warn(`Failed to get item from localStorage: ${key}`, error)
      return defaultValue || null
    }
  }

  /**
   * Safely set an item in localStorage
   */
  static set<T>(key: string, value: T): boolean {
    try {
      const item: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        version: this.APP_VERSION
      }
      localStorage.setItem(key, JSON.stringify(item))
      return true
    } catch (error) {
      console.warn(`Failed to set item in localStorage: ${key}`, error)
      return false
    }
  }

  /**
   * Safely remove an item from localStorage
   */
  static remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn(`Failed to remove item from localStorage: ${key}`, error)
      return false
    }
  }

  /**
   * Clear all app-related items from localStorage
   */
  static clear(): boolean {
    try {
      const keys = Object.keys(localStorage)
      const appKeys = keys.filter(key => 
        key.startsWith('challenge-portal') || 
        key.startsWith('community-board') ||
        key.startsWith('leaderboard-joy') ||
        key.startsWith('progress-playground') ||
        key.startsWith('team-steps-arena') ||
        key.startsWith('team-studio') ||
        key.startsWith('party-mode') ||
        key.startsWith('onboarding')
      )
      
      appKeys.forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.warn('Failed to clear localStorage', error)
      return false
    }
  }

  /**
   * Get storage usage statistics
   */
  static getStats(): { used: number; available: number; total: number } {
    try {
      const used = new Blob(
        Object.keys(localStorage).map(key => localStorage[key])
      ).size
      
      // Estimate available space (this is approximate)
      const testKey = '__storage_test__'
      const testValue = 'x'.repeat(1024 * 1024) // 1MB
      
      let available = 0
      try {
        localStorage.setItem(testKey, testValue)
        localStorage.removeItem(testKey)
        available = 5 * 1024 * 1024 // Assume 5MB available
      } catch {
        available = 0
      }
      
      return {
        used,
        available,
        total: used + available
      }
    } catch (error) {
      console.warn('Failed to get storage stats', error)
      return { used: 0, available: 0, total: 0 }
    }
  }
}

// Convenience functions
export const storage = {
  get: StorageManager.get.bind(StorageManager),
  set: StorageManager.set.bind(StorageManager),
  remove: StorageManager.remove.bind(StorageManager),
  clear: StorageManager.clear.bind(StorageManager),
  getStats: StorageManager.getStats.bind(StorageManager)
}