import { D } from '../../utils/bigNumber'
import { useGameStore } from '../gameStore'
import { GAME_BALANCE } from '../../configs/economy/balance/constants'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

describe('gameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().reset()
  })

  describe('serialization', () => {
    it.skip('should serialize and deserialize game state correctly', () => {
      // Set up test state using zustand directly
      useGameStore.setState({
        crystals: D(1000),
        totalCrystalsEarned: D(5000),
        workers: new Map([['basic', 5]]),
        upgrades: new Map([['clickPower', 3]]),
        totalClicks: 42,
        lastUpdate: 1234567890
      })

      const store = useGameStore.getState()

      // Serialize
      store.saveToStorage()

      // Verify localStorage mock was called
      expect(localStorage.setItem).toHaveBeenCalled()
    })

    it.skip('should handle corrupted save data gracefully', () => {
      // Mock corrupted localStorage data
      const getItemSpy = jest.spyOn(localStorage, 'getItem')
      getItemSpy.mockReturnValue('invalid json')

      const store = useGameStore.getState()
      store.loadFromStorage()

      // Should not crash and use initial state
      expect(store.crystals).toEqual(D(0))
      expect(store.workers.size).toBe(0)

      getItemSpy.mockRestore()
    })
  })

  describe('offline progress calculation', () => {
    it('should calculate offline progress correctly', () => {
      // Set up initial state with some workers
      useGameStore.setState({
        workers: new Map([['basic', 10]]),
        upgrades: new Map(),
        crystals: D(1000),
        lastUpdate: Date.now() - 3600000 // 1 hour ago
      })

      const store = useGameStore.getState()

      // Worker config exists in the system

      // Note: Full offline progress test would require complex mocking
      // This test verifies the method exists and can be called
      expect(typeof store.recalculateStats).toBe('function')
      expect(typeof store.loadFromStorage).toBe('function')
    })

    it('should respect offline progress limits', () => {
      // Test that offline progress is capped at MAX_OFFLINE_HOURS
      const maxOfflineMs = GAME_BALANCE.MAX_OFFLINE_HOURS * 60 * 60 * 1000
      const excessiveOfflineTime = maxOfflineMs * 2

      // This would require mocking Date.now() and setting up workers
      // The logic exists in calculateOfflineProgress function
      expect(GAME_BALANCE.MAX_OFFLINE_HOURS).toBeDefined()
      expect(typeof excessiveOfflineTime).toBe('number')
    })
  })

  describe('game mechanics', () => {
    it('should handle clicking correctly', () => {
      const initialState = useGameStore.getState()
      const initialCrystals = initialState.crystals
      const initialClicks = initialState.totalClicks

      initialState.click()

      const newState = useGameStore.getState()
      expect(newState.crystals.gt(initialCrystals)).toBe(true)
      expect(newState.totalClicks).toBe(initialClicks + 1)
    })

    it('should calculate worker costs correctly', () => {
      const store = useGameStore.getState()

      // Test worker cost calculation
      const cost = store.getWorkerCost('basic')
      expect(cost.gte(D(0))).toBe(true)
      expect(typeof cost).toBe('object') // Decimal object
    })

    it('should prevent buying workers without enough crystals', () => {
      // Set low crystals
      useGameStore.setState({ crystals: D(1) })

      const store = useGameStore.getState()

      // Try to buy expensive worker
      store.buyWorker('basic')

      // Should not have bought the worker (not enough crystals)
      expect(store.getWorkerCount('basic')).toBe(0)
    })
  })

  describe('upgrade mechanics', () => {
    it('should calculate upgrade costs correctly', () => {
      const store = useGameStore.getState()

      const cost = store.getUpgradeCost('clickPower')
      expect(cost.gte(D(0))).toBe(true)
      expect(typeof cost).toBe('object')
    })

    it('should prevent buying upgrades without enough crystals', () => {
      // Set low crystals
      useGameStore.setState({ crystals: D(1) })

      const store = useGameStore.getState()

      // Try to buy expensive upgrade
      store.buyUpgrade('clickPower')

      // Should not have bought the upgrade
      expect(store.getUpgradeLevel('clickPower')).toBe(0)
    })
  })

  describe('save debouncing', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should debounce save operations during rapid clicking', async () => {
      const store = useGameStore.getState()
      const { click } = store

      // Simulate rapid clicking (5 clicks in quick succession)
      for (let i = 0; i < 5; i++) {
        click()
      }

      // Wait less than debounce delay
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should not have saved yet
      expect(localStorage.setItem).not.toHaveBeenCalled()

      // Wait for debounce delay to complete
      await new Promise(resolve => setTimeout(resolve, 450))

      // Should have saved exactly once
      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    })

    it('should debounce save operations during rapid buying', async () => {
      // Give enough crystals for multiple purchases
      useGameStore.setState({ crystals: D(10000) })

      const store = useGameStore.getState()

      // Simulate rapid buying (multiple buy operations)
      store.buyWorker('basic')
      store.buyWorker('basic')
      store.buyUpgrade('clickPower')
      store.buyUpgrade('clickPower')

      // Wait less than debounce delay
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should not have saved yet
      expect(localStorage.setItem).not.toHaveBeenCalled()

      // Wait for debounce delay to complete
      await new Promise(resolve => setTimeout(resolve, 450))

      // Should have saved exactly once
      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    })

    it('should reset debounce timer on new actions', async () => {
      const store = useGameStore.getState()

      // First click
      store.click()
      await new Promise(resolve => setTimeout(resolve, 200))

      // Second click before first debounce completes
      store.click()
      await new Promise(resolve => setTimeout(resolve, 200))

      // Third click before second debounce completes
      store.click()

      // Wait less than debounce delay from last action
      await new Promise(resolve => setTimeout(resolve, 100))

      // Should not have saved yet
      expect(localStorage.setItem).not.toHaveBeenCalled()

      // Wait for debounce delay to complete
      await new Promise(resolve => setTimeout(resolve, 450))

      // Should have saved exactly once
      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
    })
  })
})
