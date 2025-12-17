// Базовые тесты для проверки импортов и интерфейсов
describe('Module imports', () => {
  it('should import gameStore without errors', async () => {
    // Просто проверяем, что импорт работает
    await expect(import('../gameStore')).resolves.not.toThrow()
  })

  it('should import multiplierStore without errors', async () => {
    await expect(import('../multiplierStore')).resolves.not.toThrow()
  })

  it('should import prestigeStore without errors', async () => {
    await expect(import('../prestigeStore')).resolves.not.toThrow()
  })

  it('should import bigNumber utils without errors', async () => {
    await expect(import('../../utils/bigNumber')).resolves.not.toThrow()
  })

  it('should import performance monitor without errors', async () => {
    await expect(import('../../utils/performanceMonitor')).resolves.not.toThrow()
  })
})
