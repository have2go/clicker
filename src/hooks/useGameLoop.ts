import { useEffect, useRef } from 'react'
import { useGameStore } from '../stores/gameStore'
import { measureGameLoopUpdate } from '../utils/performanceMonitor'

// Конфигурация оптимизации
const CONFIG = {
  // RAF работает на полной скорости для плавности
  rafEnabled: true,
}

export function useGameLoop() {
  const updateFromDelta = useGameStore((state) => state.updateFromDelta)
  const lastTimeRef = useRef<number>(performance.now())
  const rafIdRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    // Устанавливаем начальное время для RAF цикла
    lastTimeRef.current = performance.now()

    const tick = (currentTime: number) => {
      const delta = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      // Основное обновление (всегда выполняется) с мониторингом производительности
      measureGameLoopUpdate(() => updateFromDelta(delta), delta)

      rafIdRef.current = requestAnimationFrame(tick)
    }

    if (CONFIG.rafEnabled) {
      rafIdRef.current = requestAnimationFrame(tick)
    }

    // Очистка при размонтировании
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [updateFromDelta])
}
