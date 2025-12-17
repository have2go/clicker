// Базовые тесты для проверки импортов и интерфейсов
describe('Module imports', () => {
  it('should import gameStore without errors', () => {
    // Просто проверяем, что импорт работает
    expect(() => {
      require('../gameStore')
    }).not.toThrow()
  })

  it('should import multiplierStore without errors', () => {
    expect(() => {
      require('../multiplierStore')
    }).not.toThrow()
  })

  it('should import prestigeStore without errors', () => {
    expect(() => {
      require('../prestigeStore')
    }).not.toThrow()
  })

  it('should import bigNumber utils without errors', () => {
    expect(() => {
      require('../../utils/bigNumber')
    }).not.toThrow()
  })

  it('should import performance monitor without errors', () => {
    expect(() => {
      require('../../utils/performanceMonitor')
    }).not.toThrow()
  })
})
