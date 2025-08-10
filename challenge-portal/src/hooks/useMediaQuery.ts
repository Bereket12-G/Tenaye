import { useState, useEffect } from 'react'

/**
 * Custom hook for media queries
 * Returns true if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      // Legacy browsers
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [query])

  return matches
}

/**
 * Predefined media query hooks for common breakpoints
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsLargeScreen(): boolean {
  return useMediaQuery('(min-width: 1280px)')
}

export function useIsExtraLargeScreen(): boolean {
  return useMediaQuery('(min-width: 1536px)')
}

export function useIsPortrait(): boolean {
  return useMediaQuery('(orientation: portrait)')
}

export function useIsLandscape(): boolean {
  return useMediaQuery('(orientation: landscape)')
}

export function usePrefersDarkMode(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function usePrefersHighContrast(): boolean {
  return useMediaQuery('(prefers-contrast: high)')
}

export function useIsTouchDevice(): boolean {
  return useMediaQuery('(pointer: coarse)')
}

export function useIsHoverDevice(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

/**
 * Hook to get current screen size category
 */
export function useScreenSize(): 'mobile' | 'tablet' | 'desktop' | 'large' | 'xl' {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isLarge = useIsLargeScreen()
  const isXL = useIsExtraLargeScreen()

  if (isMobile) return 'mobile'
  if (isTablet) return 'tablet'
  if (isXL) return 'xl'
  if (isLarge) return 'large'
  return 'desktop'
}

/**
 * Hook to get responsive values based on screen size
 */
export function useResponsiveValue<T>(
  mobile: T,
  tablet?: T,
  desktop?: T,
  large?: T,
  xl?: T
): T {
  const screenSize = useScreenSize()
  
  switch (screenSize) {
    case 'mobile':
      return mobile
    case 'tablet':
      return tablet ?? mobile
    case 'desktop':
      return desktop ?? tablet ?? mobile
    case 'large':
      return large ?? desktop ?? tablet ?? mobile
    case 'xl':
      return xl ?? large ?? desktop ?? tablet ?? mobile
    default:
      return mobile
  }
}