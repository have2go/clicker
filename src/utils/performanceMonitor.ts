/**
 * Утилиты для мониторинга производительности критических функций
 */

interface PerformanceMetrics {
  functionName: string
  executionTime: number
  timestamp: number
  sessionId?: string // ID сессии для фильтрации
  additionalData?: Record<string, any>
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private readonly maxMetrics = 100000 // Ограничение на количество метрик в памяти
  private currentSessionId: string | null = null // ID текущей сессии
  private sessionStartTime: number | null = null // Время начала сессии мониторинга
  private lastLogTime: number | null = null // Время последнего лога

  /**
   * Замеряет время выполнения функции
   * @param fn - функция для замера
   * @param functionName - имя функции для логирования
   * @param additionalData - дополнительные данные для метрики
   * @returns результат выполнения функции
   */
  measure<T>(
    fn: () => T,
    functionName: string,
    additionalData?: Record<string, any>
  ): T {
    const startTime = performance.now()

    try {
      const result = fn()
      const executionTime = performance.now() - startTime

      this.recordMetric(functionName, executionTime, additionalData)

      // Логируем медленные функции (>16ms - один кадр при 60fps)
      if (executionTime > 16) {
        console.warn(`[Performance] ${functionName} took ${executionTime.toFixed(2)}ms`, additionalData)
      }

      return result
    } catch (error) {
      const executionTime = performance.now() - startTime
      console.error(`[Performance] ${functionName} failed after ${executionTime.toFixed(2)}ms:`, error)
      throw error
    }
  }

  /**
   * Записывает метрику производительности
   */
  private recordMetric(
    functionName: string,
    executionTime: number,
    additionalData?: Record<string, any>
  ): void {
    const metric: PerformanceMetrics = {
      functionName,
      executionTime,
      timestamp: Date.now(),
      sessionId: this.currentSessionId || undefined,
      additionalData
    }

    this.metrics.push(metric)

    // Ограничиваем количество метрик в памяти
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }
  }

  /**
   * Получает статистику по метрикам с фильтрацией по времени и сессии
   * @param sinceTimestamp - фильтровать метрики начиная с этого времени (timestamp в ms)
   * @param sessionId - фильтровать метрики по ID сессии
   */
  getMetricsSummary(sinceTimestamp?: number, sessionId?: string): Record<string, number> {
    // Группируем метрики по имени функции с фильтрацией по времени и сессии
    const counts: Record<string, number> = {}

    this.metrics.forEach(metric => {
      // Фильтруем метрики по времени если указан sinceTimestamp
      if (sinceTimestamp && metric.timestamp < sinceTimestamp) {
        return
      }

      // Фильтруем метрики по сессии если указан sessionId
      if (sessionId && metric.sessionId !== sessionId) {
        return
      }

      counts[metric.functionName] = (counts[metric.functionName] || 0) + 1
    })

    // Всегда включаем основные метрики, даже если их нет
    const allMetrics = ['gameLoopUpdate', 'storagesave', 'recalculateStats']
    allMetrics.forEach(metric => {
      counts[metric] = counts[metric] || 0
    })

    return counts
  }

  /**
   * Начинает новую сессию мониторинга производительности
   */
  startNewSession(): void {
    this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    this.sessionStartTime = Date.now()
    this.lastLogTime = null
    console.log('🎯 Начинаю новую сессию мониторинга производительности')
  }

  /**
   * Очищает все метрики
   */
  clearMetrics(): void {
    this.metrics = []
    this.currentSessionId = null
    this.sessionStartTime = null
    this.lastLogTime = null
  }

  /**
   * Экспортирует метрики для анализа
   */
  exportMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  /**
   * Обновляет время последнего лога (для разделения периодов)
   */
  updateLastLogTime(): void {
    this.lastLogTime = Date.now()
  }

  /**
   * Логирует сводку производительности в консоль
   */
  logPerformanceSummary(): void {
    const now = Date.now()

    // Если это первый вызов, начинаем новую сессию
    if (!this.sessionStartTime) {
      this.startNewSession()
      console.log('📊 Первый замер производительности - начинаю отслеживание')
    }

    // Получаем метрики за всю сессию и за последний период
    const sessionSummary = this.getMetricsSummary(undefined, this.currentSessionId!)
    const periodStartTime = this.lastLogTime || this.sessionStartTime!
    const periodSummary = this.getMetricsSummary(periodStartTime, this.currentSessionId!)

    const sessionDuration = (now - this.sessionStartTime!) / 1000
    const periodDuration = (now - periodStartTime) / 1000

    console.group(`🚀 Performance Monitor (${sessionDuration.toFixed(1)}s total session)`)

    // Метрики за всю сессию
    if (Object.keys(sessionSummary).length > 0) {
      console.log('📊 Метрики за всю сессию:')
      console.table(sessionSummary)
    } else {
      console.log('📊 Метрики сессии не найдены')
    }

    // Детализация за последний период если отличается
    if (this.lastLogTime && Object.keys(periodSummary).length > 0) {
      // Помечаем метрики, которые появились или изменились
      const markedPeriodSummary = Object.fromEntries(
        Object.entries(periodSummary).map(([key, value]) => {
          const sessionValue = sessionSummary[key] || 0
          const isNew = sessionValue === value && sessionValue > 0 // Новая активность
          const isChanged = sessionValue > value // Изменение с прошлого раза
          const marker = isNew || isChanged ? '🆕' : ''
          return [`${marker}${key}`, value]
        })
      )

      console.log(`📈 Детализация за последний период (${periodDuration.toFixed(1)}s):`)
      console.table(markedPeriodSummary)
    }

    // Анализ производительности за сессию
    const gameLoopCount = sessionSummary.gameLoopUpdate || 0
    const hasPerformanceIssues = gameLoopCount > 0 && (gameLoopCount / sessionDuration) < 50

    if (hasPerformanceIssues) {
      const fps = gameLoopCount / sessionDuration
      console.warn(`⚠️ Низкий FPS: ${fps.toFixed(1)} (target: 60)`)
    }

    // FPS информация показываем только при проблемах
    if (gameLoopCount > 0) {
      const fps = gameLoopCount / sessionDuration
      const targetFps = 60
      const fpsStatus = fps >= targetFps * 0.95 ? '✅' : fps >= targetFps * 0.8 ? '⚠️' : '❌'

      // Показываем статус только если есть проблемы
      if (fpsStatus !== '✅') {
        console.log(`${fpsStatus} FPS: ${fps.toFixed(1)} (target: ${targetFps}, кадров: ${gameLoopCount})`)
      }
    }

    console.groupEnd()

    this.lastLogTime = now
  }
}

// Глобальный экземпляр монитора производительности
export const performanceMonitor = new PerformanceMonitor()

/**
 * Хелпер для замера производительности recalculateStats
 */
export function measureRecalculateStats<T>(
  fn: () => T,
  workerCount: number,
  upgradeCount: number
): T {
  const result = performanceMonitor.measure(fn, 'recalculateStats', {
    workerCount,
    upgradeCount
  })

  // Отправляем событие об обновлении метрик
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('performanceMetricsUpdate', {
      detail: { type: 'recalculate' }
    }))
  }

  return result
}

/**
 * Хелпер для замера производительности game loop обновления
 */
export function measureGameLoopUpdate<T>(
  fn: () => T,
  deltaTime: number
): T {
  return performanceMonitor.measure(fn, 'gameLoopUpdate', {
    deltaTime
  })
}

/**
 * Хелпер для замера производительности операций сохранения/загрузки
 */
export function measureStorageOperation<T>(
  fn: () => T,
  operation: 'save' | 'load'
): T {
  const result = performanceMonitor.measure(fn, `storage${operation}`, {
    operation
  })

  // Отправляем событие об обновлении метрик
  if (typeof window !== 'undefined' && operation === 'save') {
    window.dispatchEvent(new CustomEvent('performanceMetricsUpdate', {
      detail: { type: 'storage' }
    }))
  }

  return result
}


/**
 * Хелпер для замера производительности других критических функций
 */
export function measureCriticalFunction<T>(
  fn: () => T,
  functionName: string,
  context?: Record<string, any>
): T {
  return performanceMonitor.measure(fn, functionName, context)
}

// Глобальная функция для доступа к мониторингу из консоли
if (typeof window !== 'undefined') {
  (window as any).performanceMonitor = performanceMonitor
}
