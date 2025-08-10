/**
 * Analytics utilities for Challenge Portal
 * Provides a simple analytics system for tracking user interactions
 */

import { APP_CONFIG } from './constants'

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
  userId?: string
  sessionId: string
}

export interface AnalyticsConfig {
  enabled: boolean
  endpoint?: string
  batchSize: number
  flushInterval: number
  sessionTimeout: number
}

class Analytics {
  private config: AnalyticsConfig
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private userId?: string
  private lastActivity: number
  private flushTimer?: NodeJS.Timeout

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? false,
      batchSize: config.batchSize ?? 10,
      flushInterval: config.flushInterval ?? 30000, // 30 seconds
      sessionTimeout: config.sessionTimeout ?? 1800000, // 30 minutes
      ...config
    }

    this.sessionId = this.generateSessionId()
    this.lastActivity = Date.now()

    if (this.config.enabled) {
      this.startFlushTimer()
      this.trackPageView()
    }
  }

  /**
   * Track a custom event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.config.enabled) return

    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    }

    this.events.push(event)
    this.lastActivity = Date.now()

    // Flush if batch size is reached
    if (this.events.length >= this.config.batchSize) {
      this.flush()
    }
  }

  /**
   * Track page view
   */
  trackPageView(page?: string): void {
    const currentPage = page || window.location.pathname
    this.track('page_view', { page: currentPage, referrer: document.referrer })
  }

  /**
   * Track user interaction
   */
  trackInteraction(element: string, action: string, properties?: Record<string, any>): void {
    this.track('interaction', {
      element,
      action,
      ...properties
    })
  }

  /**
   * Track challenge events
   */
  trackChallengeEvent(action: string, challengeId: string, properties?: Record<string, any>): void {
    this.track('challenge_event', {
      action,
      challenge_id: challengeId,
      ...properties
    })
  }

  /**
   * Track progress events
   */
  trackProgressEvent(action: string, properties?: Record<string, any>): void {
    this.track('progress_event', {
      action,
      ...properties
    })
  }

  /**
   * Track community events
   */
  trackCommunityEvent(action: string, properties?: Record<string, any>): void {
    this.track('community_event', {
      action,
      ...properties
    })
  }

  /**
   * Track team events
   */
  trackTeamEvent(action: string, teamId: string, properties?: Record<string, any>): void {
    this.track('team_event', {
      action,
      team_id: teamId,
      ...properties
    })
  }

  /**
   * Track error events
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context
    })
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId
  }

  /**
   * Get analytics data
   */
  getAnalyticsData(): {
    events: AnalyticsEvent[]
    sessionId: string
    userId?: string
    lastActivity: number
  } {
    return {
      events: [...this.events],
      sessionId: this.sessionId,
      userId: this.userId,
      lastActivity: this.lastActivity
    }
  }

  /**
   * Flush events to storage or server
   */
  private async flush(): Promise<void> {
    if (this.events.length === 0) return

    const eventsToFlush = [...this.events]
    this.events = []

    try {
      // Store events in localStorage for now
      const storedEvents = this.getStoredEvents()
      storedEvents.push(...eventsToFlush)
      this.storeEvents(storedEvents)

      // If endpoint is configured, send to server
      if (this.config.endpoint) {
        await this.sendToServer(eventsToFlush)
      }
    } catch (error) {
      console.warn('Failed to flush analytics events:', error)
      // Restore events if flush failed
      this.events.unshift(...eventsToFlush)
    }
  }

  /**
   * Send events to server
   */
  private async sendToServer(events: AnalyticsEvent[]): Promise<void> {
    if (!this.config.endpoint) return

    const response = await fetch(this.config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app: APP_CONFIG.NAME,
        version: APP_CONFIG.VERSION,
        events
      })
    })

    if (!response.ok) {
      throw new Error(`Analytics server responded with ${response.status}`)
    }
  }

  /**
   * Get stored events from localStorage
   */
  private getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('challenge-portal-analytics')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * Store events in localStorage
   */
  private storeEvents(events: AnalyticsEvent[]): void {
    try {
      // Keep only last 1000 events to prevent localStorage overflow
      const limitedEvents = events.slice(-1000)
      localStorage.setItem('challenge-portal-analytics', JSON.stringify(limitedEvents))
    } catch (error) {
      console.warn('Failed to store analytics events:', error)
    }
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Start flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  /**
   * Stop analytics
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    this.flush()
  }

  /**
   * Check if session is still active
   */
  isSessionActive(): boolean {
    return Date.now() - this.lastActivity < this.config.sessionTimeout
  }

  /**
   * Reset session
   */
  resetSession(): void {
    this.sessionId = this.generateSessionId()
    this.lastActivity = Date.now()
    this.trackPageView()
  }
}

// Create global analytics instance
export const analytics = new Analytics({
  enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
})

// Auto-track common events
if (analytics) {
  // Track navigation
  window.addEventListener('popstate', () => {
    analytics.trackPageView()
  })

  // Track clicks on interactive elements
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const element = target.closest('[data-analytics]')
    
    if (element) {
      const eventName = element.getAttribute('data-analytics')
      const properties = element.getAttribute('data-analytics-props')
      
      if (eventName) {
        analytics.trackInteraction(
          eventName,
          'click',
          properties ? JSON.parse(properties) : undefined
        )
      }
    }
  })

  // Track errors
  window.addEventListener('error', (event) => {
    analytics.trackError(event.error || new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), {
      type: 'unhandledrejection'
    })
  })
}

export default analytics