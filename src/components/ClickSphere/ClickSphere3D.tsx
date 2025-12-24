import { memo, useRef, useEffect, useCallback, useState } from 'react'
import styles from './ClickSphere3D.module.scss'

interface ClickSphere3DProps {
  onClick: () => void
  size?: number
  disabled?: boolean
}

interface ClickAnimation {
  id: number
  startTime: number
  intensity: number
}

let animationIdCounter = 0

export const ClickSphere3D = memo(function ClickSphere3D({
  onClick,
  size = 260,
  disabled = false
}: ClickSphere3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sphereRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [activeAnimations, setActiveAnimations] = useState<ClickAnimation[]>([])
  const lastClickTimeRef = useRef<number>(0)

  // Анимационный цикл для кликов
  useEffect(() => {
    if (activeAnimations.length === 0) return

    const interval = setInterval(() => {
      const currentTime = Date.now()
      setActiveAnimations(prev => prev.filter(animation => {
        const elapsed = currentTime - animation.startTime
        return elapsed < 300 // Удаляем завершенные анимации через 300ms
      }))
    }, 16) // ~60 FPS

    return () => clearInterval(interval)
  }, [activeAnimations.length])

  // Обработка кликов
  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (disabled || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Вычисляем расстояние от центра для определения интенсивности клика
    const distanceFromCenter = Math.sqrt(
      Math.pow(event.clientX - centerX, 2) + Math.pow(event.clientY - centerY, 2)
    )
    const maxDistance = Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2))
    const distanceRatio = Math.max(0, 1 - distanceFromCenter / maxDistance)

    // Добавляем новую анимацию клика
    const currentTime = Date.now()
    const timeSinceLastClick = currentTime - lastClickTimeRef.current

    // Увеличиваем интенсивность при быстрых кликах
    const baseIntensity = 1
    const rapidClickBonus = timeSinceLastClick < 100 ? 0.5 : 0
    const intensity = Math.min(baseIntensity + rapidClickBonus, 2)

    const animation: ClickAnimation = {
      id: ++animationIdCounter,
      startTime: currentTime,
      intensity: intensity * (0.5 + distanceRatio * 0.5),
    }

    setActiveAnimations(prev => {
      const newAnimations = [...prev, animation]
      // Ограничиваем количество одновременных анимаций
      return newAnimations.length > 5 ? newAnimations.slice(-5) : newAnimations
    })

    lastClickTimeRef.current = currentTime
    onClick()
  }, [onClick, disabled])

  // Вычисляем текущий масштаб на основе активных анимаций
  const currentScale = 1 + activeAnimations.reduce((total, animation) => {
    const elapsed = Date.now() - animation.startTime
    const progress = Math.min(elapsed / 300, 1)
    const dampedProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease-out
    return total + (animation.intensity * 0.15 * (1 - dampedProgress))
  }, 0)

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${disabled ? styles.disabled : ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onPointerDown={handlePointerDown}
    >
      {/* Внешнее свечение */}
      <div
        ref={glowRef}
        className={styles.glow}
        style={{
          width: `${size * 1.2}px`,
          height: `${size * 1.2}px`,
          transform: `scale(${currentScale})`,
        }}
      />

      {/* Основная сфера */}
      <div
        ref={sphereRef}
        className={styles.sphere}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `scale(${currentScale})`,
        }}
      />
      {/* Дополнительные эффекты для быстрых кликов */}
      {activeAnimations.length > 2 && (
        <div className={styles.pulseEffect} />
      )}
    </div>
  )
})
