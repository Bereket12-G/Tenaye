import { useEffect, useState } from 'react'

const STORAGE_KEY = 'party-mode-v1'
const EVENT_KEY = 'party-mode-change'

export function usePartyMode() {
  const [on, setOn] = useState<boolean>(() => {
    try { 
      return localStorage.getItem(STORAGE_KEY) === 'on' 
    } catch {
      return false
    }
  })

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail
      setOn(detail)
    }
    window.addEventListener(EVENT_KEY, handler as EventListener)
    return () => window.removeEventListener(EVENT_KEY, handler as EventListener)
  }, [])

  const toggle = () => {
    const next = !on
    setOn(next)
    try { 
      localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off') 
    } catch {
      // Handle localStorage errors silently
    }
    window.dispatchEvent(new CustomEvent<boolean>(EVENT_KEY, { detail: next }))
  }

  return { partyOn: on, toggleParty: toggle }
}