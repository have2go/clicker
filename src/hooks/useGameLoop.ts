import { useEffect, useRef } from 'react'
import { useGameStore } from '../stores/gameStore'

// Конфигурация оптимизации
const CONFIG = {
  // RAF работает на полной скорости для плавности
  rafEnabled: true,
  
  // Throttling для тяжелых обновлений (если понадобится)
  heavyUpdateInterval: 100, // ms
}

export function useGameLoop() {
  const updateFromDelta = useGameStore((state) => state.updateFromDelta)
  const lastTimeRef = useRef<number>(performance.now())
  const rafIdRef = useRef<number | undefined>(undefined)
  const lastHeavyUpdateRef = useRef<number>(performance.now())

  useEffect(() => {
    // Устанавливаем начальное время для RAF цикла
    lastTimeRef.current = performance.now()
    lastHeavyUpdateRef.current = performance.now()

    const tick = (currentTime: number) => {
      const delta = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime
      
      // Основное обновление (всегда выполняется)
      updateFromDelta(delta)
      
      // Тяжелые обновления (throttled, если понадобится в будущем)
      const timeSinceHeavyUpdate = currentTime - lastHeavyUpdateRef.current
      if (timeSinceHeavyUpdate >= CONFIG.heavyUpdateInterval) {
        lastHeavyUpdateRef.current = currentTime
        // Здесь можно добавить тяжелые вычисления если понадобится
      }
      
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
