import { useState, useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { performanceMonitor } from '../../utils/performanceMonitor'
import styles from './PerformanceOverlay.module.scss'

interface Position {
  x: number
  y: number
}

interface PerformanceOverlayProps {
  isVisible: boolean
}

export function PerformanceOverlay({ isVisible }: PerformanceOverlayProps) {
  const [sessionMetrics, setSessionMetrics] = useState<Record<string, number> | null>(null)
  const [updatedCells, setUpdatedCells] = useState<Set<string>>(new Set())
  const [position, setPosition] = useState<Position>(() => {
    // Начальная позиция: правый край, чуть выше середины
    const overlayWidth = 280 // приблизительная ширина
    const overlayHeight = 200 // приблизительная высота
    return {
      x: window.innerWidth - overlayWidth - 20, // 20px от правого края
      y: window.innerHeight / 2 - overlayHeight / 2 - 50 // чуть выше середины
    }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 })
  const [hasStartedSession, setHasStartedSession] = useState(false)
  const prevSessionMetrics = useRef<Record<string, number> | null>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Импортируем useGameStore для совместимости
  const {} = useGameStore()

  const updateMetrics = useCallback(() => {
    const sessionStartTime = (performanceMonitor as any).sessionStartTime

    if (sessionStartTime) {
      const sessionSummary = performanceMonitor.getMetricsSummary(undefined, (performanceMonitor as any).currentSessionId)

      // Определяем изменившиеся ячейки
      const newUpdatedCells = new Set<string>()

      // Сравниваем метрики сессии
      if (prevSessionMetrics.current) {
        Object.entries(sessionSummary).forEach(([key, newValue]) => {
          const oldValue = prevSessionMetrics.current![key] || 0
          if (newValue !== oldValue) {
            newUpdatedCells.add(`session-${key}`)
          }
        })
      }

      // Обновляем ref с предыдущими значениями
      prevSessionMetrics.current = { ...sessionSummary }

      setSessionMetrics(sessionSummary)
      setUpdatedCells(newUpdatedCells)

      // Снимаем выделение через 2 секунды
      setTimeout(() => setUpdatedCells(new Set()), 2000)
    }
  }, [])

  const startNewSession = useCallback(() => {
    performanceMonitor.startNewSession()
    prevSessionMetrics.current = null
  }, [])

  const handleStartNewSession = useCallback(() => {
    startNewSession()
    updateMetrics()
  }, [startNewSession, updateMetrics])

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Allow dragging only if clicked on overlay background (not on buttons or table cells)
    const target = e.target as HTMLElement

    // Don't start dragging if clicked on buttons
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return
    }

    // Don't start dragging if clicked on table cells (but allow clicking on table background)
    if (target.tagName === 'TD' || target.tagName === 'TH' ||
        target.closest('td') || target.closest('th')) {
      return
    }

    e.preventDefault()
    setIsDragging(true)

    // Получаем текущие координаты overlay
    if (overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect()
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y

      // Ограничиваем позицию, чтобы overlay не уходил за границы экрана
      const maxX = window.innerWidth - 280 // Предполагаем ширину overlay
      const maxY = window.innerHeight - 200 // Предполагаем высоту overlay

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Инициализация метрик при показе overlay
  useEffect(() => {
    if (isVisible) {
      updateMetrics()
    }
  }, [isVisible, updateMetrics])

  // Слушаем события обновления метрик
  useEffect(() => {
    if (!isVisible) return

    const handleMetricsUpdate = () => {
      // Немедленное обновление при событиях сохранения или пересчета
      updateMetrics()
    }

    window.addEventListener('performanceMetricsUpdate', handleMetricsUpdate as EventListener)

    return () => {
      window.removeEventListener('performanceMetricsUpdate', handleMetricsUpdate as EventListener)
    }
  }, [isVisible, updateMetrics])

  // Инициализация при показе
  useEffect(() => {
    if (isVisible) {
      // При первом показе автоматически стартуем сессию
      if (!hasStartedSession) {
        setHasStartedSession(true)
        startNewSession()
      }

      updateMetrics()
    }
  }, [isVisible, updateMetrics, hasStartedSession, startNewSession])

  if (!isVisible) return null

  return (
    <div
      ref={overlayRef}
      className={`${styles.overlay} ${isDragging ? styles.dragging : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.content}>
        <div className={styles.buttonRow}>
          <button
            onClick={handleStartNewSession}
            className={styles.button}
            title="Начать новую сессию"
          >
            NEW
          </button>
          <button
            onClick={updateMetrics}
            className={styles.button}
            title="Обновить метрики"
          >
            🔄
          </button>
        </div>

        <div className={styles.metricsDisplay}>
          <div className={styles.metricsTable}>
            {sessionMetrics && Object.entries(sessionMetrics).map(([key, value]) => (
              <div key={key} className={styles.metricRow}>
                <span className={styles.metricName}>{key}</span>
                <span className={`${styles.metricValue} ${updatedCells.has(`session-${key}`) ? styles.updated : ''}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
