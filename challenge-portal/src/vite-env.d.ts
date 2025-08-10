/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG_MODE: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_API_KEY?: string
  readonly VITE_SOCIAL_TITLE: string
  readonly VITE_SOCIAL_DESCRIPTION: string
  readonly VITE_SOCIAL_IMAGE: string
  readonly VITE_ENABLE_SERVICE_WORKER: string
  readonly VITE_CACHE_DURATION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global type declarations
declare global {
  interface Window {
    __CHALLENGE_PORTAL_VERSION__: string
  }
}
