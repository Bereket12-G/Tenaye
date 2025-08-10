import { useMemo } from 'react'

const KEY = 'device-id-v1'

export function useDeviceId() {
  const id = useMemo(() => {
    try {
      const existing = localStorage.getItem(KEY)
      if (existing) return existing
      const next = crypto.randomUUID()
      localStorage.setItem(KEY, next)
      return next
    } catch {
      return 'unknown-device'
    }
  }, [])
  return id
}