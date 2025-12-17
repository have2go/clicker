import { useMultiplierStore, syncUpgradeMultipliers, multiplierSelectors } from '../multiplierStore'
import { D } from '../../utils/bigNumber'
import { MultiplierType, MultiplierSource } from '../../types/multipliers'

describe('multiplierStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useMultiplierStore.setState({ multipliers: [] })
  })

  describe('multiplier management', () => {
    it('should add new multiplier', () => {
      const multiplier = {
        id: 'test_multiplier',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.UPGRADE,
        value: D(1.5),
        description: 'Test multiplier'
      }

      useMultiplierStore.getState().addMultiplier(multiplier)

      const state = useMultiplierStore.getState()
      expect(state.multipliers).toHaveLength(1)
      expect(state.multipliers[0]).toEqual(multiplier)
    })

    it('should update existing multiplier', () => {
      const initialMultiplier = {
        id: 'test_multiplier',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.UPGRADE,
        value: D(1.5),
        description: 'Test multiplier'
      }

      const updatedMultiplier = {
        ...initialMultiplier,
        value: D(2.0)
      }

      useMultiplierStore.getState().addMultiplier(initialMultiplier)
      useMultiplierStore.getState().addMultiplier(updatedMultiplier)

      const state = useMultiplierStore.getState()
      expect(state.multipliers).toHaveLength(1)
      expect(state.multipliers[0].value.toNumber()).toBe(2.0)
    })

    it('should remove multiplier', () => {
      const multiplier = {
        id: 'test_multiplier',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.UPGRADE,
        value: D(1.5),
        description: 'Test multiplier'
      }

      useMultiplierStore.getState().addMultiplier(multiplier)
      expect(useMultiplierStore.getState().multipliers).toHaveLength(1)

      useMultiplierStore.getState().removeMultiplier('test_multiplier')
      expect(useMultiplierStore.getState().multipliers).toHaveLength(0)
    })

    it('should clear multipliers by source', () => {
      const upgradeMultiplier = {
        id: 'upgrade_mult',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.UPGRADE,
        value: D(1.5),
        description: 'Upgrade multiplier'
      }

      const prestigeMultiplier = {
        id: 'prestige_mult',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.PRESTIGE,
        value: D(2.0),
        description: 'Prestige multiplier'
      }

      useMultiplierStore.getState().addMultiplier(upgradeMultiplier)
      useMultiplierStore.getState().addMultiplier(prestigeMultiplier)
      expect(useMultiplierStore.getState().multipliers).toHaveLength(2)

      useMultiplierStore.getState().clearMultipliersBySource(MultiplierSource.UPGRADE)
      const state = useMultiplierStore.getState()
      expect(state.multipliers).toHaveLength(1)
      expect(state.multipliers[0].source).toBe(MultiplierSource.PRESTIGE)
    })
  })

  describe('multiplier calculations', () => {
    it('should calculate global multiplier correctly', () => {
      useMultiplierStore.getState().addMultiplier({
        id: 'mult1',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.UPGRADE,
        value: D(2),
        description: 'Double multiplier'
      })

      useMultiplierStore.getState().addMultiplier({
        id: 'mult2',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.UPGRADE,
        value: D(1.5),
        description: '1.5x multiplier'
      })

      const state1 = useMultiplierStore.getState()
      const globalMult = multiplierSelectors.getGlobalMultiplier(state1.multipliers)
      expect(globalMult.toNumber()).toBe(3) // 2 * 1.5 = 3
    })

    it('should calculate click multiplier correctly', () => {
      useMultiplierStore.getState().addMultiplier({
        id: 'global_mult',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.UPGRADE,
        value: D(2),
        description: 'Global multiplier'
      })

      useMultiplierStore.getState().addMultiplier({
        id: 'click_mult',
        type: MultiplierType.CLICK,
        source: MultiplierSource.UPGRADE,
        value: D(1.5),
        description: 'Click multiplier'
      })

      const state2 = useMultiplierStore.getState()
      const clickMult = multiplierSelectors.getClickMultiplier(state2.multipliers)
      expect(clickMult.toNumber()).toBe(3) // 2 * 1.5 = 3
    })

    it('should calculate production multiplier correctly', () => {
      useMultiplierStore.getState().addMultiplier({
        id: 'global_mult',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.UPGRADE,
        value: D(2),
        description: 'Global multiplier'
      })

      useMultiplierStore.getState().addMultiplier({
        id: 'prod_mult',
        type: MultiplierType.PRODUCTION,
        source: MultiplierSource.UPGRADE,
        value: D(1.5),
        description: 'Production multiplier'
      })

      const state3 = useMultiplierStore.getState()
      const prodMult = multiplierSelectors.getProductionMultiplier(state3.multipliers)
      expect(prodMult.toNumber()).toBe(3) // 2 * 1.5 = 3
    })

    it('should calculate worker multiplier correctly', () => {
      useMultiplierStore.getState().addMultiplier({
        id: 'global_mult',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.UPGRADE,
        value: D(2),
        description: 'Global multiplier'
      })

      useMultiplierStore.getState().addMultiplier({
        id: 'worker_mult_basic',
        type: MultiplierType.WORKER,
        source: MultiplierSource.UPGRADE,
        value: D(1.5),
        workerId: 'basic',
        description: 'Worker multiplier for basic'
      })

      const state = useMultiplierStore.getState()
      const workerMult = multiplierSelectors.getWorkerMultiplier(state.multipliers, 'basic')
      expect(workerMult.toNumber()).toBe(3) // 2 * 1.5 = 3

      // Different worker should not get the worker-specific multiplier
      const otherWorkerMult = multiplierSelectors.getWorkerMultiplier(state.multipliers, 'advanced')
      expect(otherWorkerMult.toNumber()).toBe(2) // Only global
    })

    it('should return 1 when no multipliers exist', () => {
      const store = useMultiplierStore.getState()

      const { multipliers } = store
      expect(multiplierSelectors.getGlobalMultiplier(multipliers).toNumber()).toBe(1)
      expect(multiplierSelectors.getClickMultiplier(multipliers).toNumber()).toBe(1)
      expect(multiplierSelectors.getProductionMultiplier(multipliers).toNumber()).toBe(1)
      expect(multiplierSelectors.getWorkerMultiplier(multipliers, 'any').toNumber()).toBe(1)
    })
  })

  describe('upgrade synchronization', () => {
    it('should sync upgrade multipliers correctly', () => {
      const upgrades = new Map([
        ['clickPower', 2],
        ['productionBoost', 1]
      ])

      const upgradeConfigs = [
        {
          id: 'clickPower',
          effect: (_level: number) => ({
            type: 'multiplicative',
            target: 'click',
            value: D(Math.pow(1.5, 2))
          }),
          name: 'Click Power'
        },
        {
          id: 'productionBoost',
          effect: (_level: number) => ({
            type: 'multiplicative',
            target: 'production',
            value: D(Math.pow(2, 1))
          }),
          name: 'Production Boost'
        }
      ]

      syncUpgradeMultipliers(upgrades, upgradeConfigs)

      expect(useMultiplierStore.getState().multipliers).toHaveLength(2)

      const state = useMultiplierStore.getState()
      // Check click multiplier: 1.5^2 = 2.25
      const clickMult = state.multipliers.find(m => m.id === 'upgrade_clickPower')
      expect(clickMult?.value.toNumber()).toBeCloseTo(2.25, 5)
      expect(clickMult?.type).toBe(MultiplierType.CLICK)

      // Check production multiplier: 2^1 = 2
      const prodMult = state.multipliers.find(m => m.id === 'upgrade_productionBoost')
      expect(prodMult?.value.toNumber()).toBe(2)
      expect(prodMult?.type).toBe(MultiplierType.PRODUCTION)
    })

    it('should skip non-multiplicative effects', () => {
      const upgrades = new Map([['additiveUpgrade', 1]])

      const upgradeConfigs = [
        {
          id: 'additiveUpgrade',
          effect: (_level: number) => ({
            type: 'additive',
            target: 'click',
            value: D(10)
          }),
          name: 'Additive Upgrade'
        }
      ]

      syncUpgradeMultipliers(upgrades, upgradeConfigs)

      expect(useMultiplierStore.getState().multipliers).toHaveLength(0) // Additive effects are skipped
    })
  })
})
