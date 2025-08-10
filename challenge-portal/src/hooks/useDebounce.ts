import { useState, useEffect } from 'react'

/**
 * Custom hook for debouncing values
 * Useful for search inputs, API calls, and other operations that should be delayed
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Custom hook for debouncing with immediate option
 */
export function useDebounceWithImmediate<T>(
  value: T,
  delay: number,
  immediate: boolean = false
): [T, boolean] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  const [isPending, setIsPending] = useState<boolean>(false)

  useEffect(() => {
    if (immediate) {
      setDebouncedValue(value)
      setIsPending(false)
      return
    }

    setIsPending(true)
    const handler = setTimeout(() => {
      setDebouncedValue(value)
      setIsPending(false)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay, immediate])

  return [debouncedValue, isPending]
}