import { useCallback } from 'react'

export function useConfetti() {
  const shoot = useCallback((emojis: string[] = ['🎉','✨','🌈','🪩','🍩','🦄']) => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const container = document.createElement('div')
    container.setAttribute('aria-hidden', 'true')
    Object.assign(container.style, {
      position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: '9999', overflow: 'hidden',
    })
    document.body.appendChild(container)

    const count = 40
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span')
      span.textContent = emojis[i % emojis.length]
      const startX = Math.random() * 100
      const duration = 800 + Math.random() * 800
      const delay = Math.random() * 200
      Object.assign(span.style, {
        position: 'absolute',
        left: startX + 'vw',
        top: '-10vh',
        fontSize: (16 + Math.random() * 18) + 'px',
        transform: 'translateY(0) rotate(0deg)',
        animation: `confetti-fall ${duration}ms linear ${delay}ms forwards`,
      } as CSSStyleDeclaration)
      container.appendChild(span)
    }

    setTimeout(() => {
      container.remove()
    }, 2200)
  }, [])

  return { confetti: shoot }
}