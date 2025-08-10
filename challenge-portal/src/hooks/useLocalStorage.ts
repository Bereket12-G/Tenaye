import { useState, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage'

/**
 * Custom hook for localStorage operations with error handling
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Get from localStorage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storage.get(key, initialValue) ?? initialValue
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to localStorage
      storage.set(key, valueToStore)
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      storage.remove(key)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const parsed = JSON.parse(e.newValue)
          setStoredValue(parsed.value)
        } catch (error) {
          console.warn(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue, removeValue]
}

/**
 * Custom hook for localStorage with versioning support
 */
export function useVersionedLocalStorage<T>(
  key: string,
  initialValue: T,
  version: string
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storage.get(key, initialValue)
    if (item && typeof item === 'object' && 'version' in item && 'value' in item) {
      const versionedItem = item as { version: string; value: T }
      if (versionedItem.version === version) {
        return versionedItem.value
      }
    }
    return initialValue
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      const versionedValue = {
        value: valueToStore,
        version,
        timestamp: Date.now()
      }
      
      storage.set(key, versionedValue)
    } catch (error) {
      console.warn(`Error setting versioned localStorage key "${key}":`, error)
    }
  }, [key, storedValue, version])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      storage.remove(key)
    } catch (error) {
      console.warn(`Error removing versioned localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Custom hook for localStorage with expiration support
 */
export function useExpiringLocalStorage<T>(
  key: string,
  initialValue: T,
  ttl: number = 24 * 60 * 60 * 1000 // 24 hours default
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = storage.get(key, initialValue)
    if (item && typeof item === 'object' && 'timestamp' in item && 'value' in item) {
      const expiringItem = item as { timestamp: number; value: T }
      const now = Date.now()
      
      if (now - expiringItem.timestamp < ttl) {
        return expiringItem.value
      } else {
        // Item has expired, remove it
        storage.remove(key)
      }
    }
    return initialValue
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      const expiringValue = {
        value: valueToStore,
        timestamp: Date.now()
      }
      
      storage.set(key, expiringValue)
    } catch (error) {
      console.warn(`Error setting expiring localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      storage.remove(key)
    } catch (error) {
      console.warn(`Error removing expiring localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}