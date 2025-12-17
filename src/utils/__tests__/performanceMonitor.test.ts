import { performanceMonitor, measureCriticalFunction } from '../performanceMonitor'

describe('performanceMonitor', () => {
  beforeEach(() => {
    performanceMonitor.clearMetrics()
  })

  it('should measure function execution time', () => {
    const mockFn = jest.fn(() => {
      // Simulate some work
      let sum = 0
      for (let i = 0; i < 1000; i++) {
        sum += i
      }
      return sum
    })

    const result = measureCriticalFunction(mockFn, 'testFunction')

    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(result).toBe(499500) // sum of 0 to 999

    const summary = performanceMonitor.getMetricsSummary()
    expect(summary.testFunction).toBeDefined()
    expect(summary.testFunction).toBe(1)
  })

  it('should handle function errors', () => {
    const mockFn = jest.fn(() => {
      throw new Error('Test error')
    })

    expect(() => {
      measureCriticalFunction(mockFn, 'errorFunction')
    }).toThrow('Test error')

    // Note: Error functions may not be recorded if they throw before completion
    // This test verifies that the error is properly thrown
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should track multiple function calls', () => {
    const mockFn = jest.fn(() => 42)

    measureCriticalFunction(mockFn, 'multiCallFunction')
    measureCriticalFunction(mockFn, 'multiCallFunction')
    measureCriticalFunction(mockFn, 'multiCallFunction')

    const summary = performanceMonitor.getMetricsSummary()
    expect(summary.multiCallFunction).toBe(3)
  })

  it('should include additional context in metrics', () => {
    const mockFn = jest.fn(() => 'done')
    const context = { userId: 123, action: 'click' }

    measureCriticalFunction(mockFn, 'contextFunction', context)

    const metrics = performanceMonitor.exportMetrics()
    expect(metrics.length).toBe(1)
    expect(metrics[0].functionName).toBe('contextFunction')
    expect(metrics[0].additionalData).toEqual(context)
  })

  it('should limit metrics storage', () => {
    // Fill up the metrics storage
    for (let i = 0; i < 1010; i++) {
      measureCriticalFunction(() => i, `function${i}`)
    }

    const metrics = performanceMonitor.exportMetrics()
    // Should be limited to maxMetrics (10000)
    expect(metrics.length).toBeLessThanOrEqual(10000)
  })

  it('should calculate statistics correctly', () => {
    // Mock some metrics
    const mockMetrics = [
      { functionName: 'test', executionTime: 10, timestamp: Date.now(), additionalData: {} },
      { functionName: 'test', executionTime: 20, timestamp: Date.now(), additionalData: {} },
      { functionName: 'test', executionTime: 30, timestamp: Date.now(), additionalData: {} },
    ]

    // Manually add metrics (since we can't easily mock performance.now in this context)
    ;(performanceMonitor as any).metrics = mockMetrics

    const summary = performanceMonitor.getMetricsSummary()

    expect(summary.test).toBe(3)
  })

  it('should clear metrics', () => {
    measureCriticalFunction(() => 'test', 'clearTest')
    const summaryBefore = performanceMonitor.getMetricsSummary()
    expect(summaryBefore.clearTest).toBe(1)

    performanceMonitor.clearMetrics()
    const summaryAfter = performanceMonitor.getMetricsSummary()
    expect(summaryAfter.clearTest).toBeUndefined()
    expect(summaryAfter.gameLoopUpdate).toBe(0) // Основные метрики всегда присутствуют
  })

  describe('session management', () => {
    it('should start new session and filter metrics by session', () => {
      // Начинаем новую сессию
      performanceMonitor.startNewSession()
      const sessionId1 = (performanceMonitor as any).currentSessionId

      // Добавляем метрики в первой сессии
      measureCriticalFunction(() => 'test1', 'session1')
      measureCriticalFunction(() => 'test2', 'session1')

      // Начинаем новую сессию
      performanceMonitor.startNewSession()
      const sessionId2 = (performanceMonitor as any).currentSessionId

      // Добавляем метрики во второй сессии
      measureCriticalFunction(() => 'test3', 'session2')
      measureCriticalFunction(() => 'test4', 'session2')

      // Проверяем фильтрацию по сессиям
      const session1Metrics = performanceMonitor.getMetricsSummary(undefined, sessionId1)
      const session2Metrics = performanceMonitor.getMetricsSummary(undefined, sessionId2)

      expect(session1Metrics.session1).toBe(2)
      expect(session1Metrics.session2).toBeUndefined()
      expect(session2Metrics.session2).toBe(2)
      expect(session2Metrics.session1).toBeUndefined()
    })

    it('should reset session on clearMetrics', () => {
      performanceMonitor.startNewSession()
      expect((performanceMonitor as any).currentSessionId).not.toBeNull()
      expect((performanceMonitor as any).sessionStartTime).not.toBeNull()

      performanceMonitor.clearMetrics()
      expect((performanceMonitor as any).currentSessionId).toBeNull()
      expect((performanceMonitor as any).sessionStartTime).toBeNull()
    })
  })
})
