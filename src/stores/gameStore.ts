import { create } from 'zustand'
import { Decimal, D, serializeDecimal, safeDeserializeDecimal, calculateUpgradeCost } from '../utils/bigNumber'
import type { GameState } from '../types/game'
import { SAVE_VERSION } from '../types/game'
import { getWorker } from '../configs/workers'
import { getAllUpgrades, getUpgrade } from '../configs/upgrades'
import { calculateWorkerCost, calculateWorkerCps } from '../types/workers'
import { checkUnlockRequirement } from '../types/upgrades'
import { useMultiplierStore, syncUpgradeMultipliers } from './multiplierStore'
import { MultiplierSource } from '../types/multipliers'
import { GAME_BALANCE } from '../configs/economy/balance/constants'
import { usePrestigeStore } from './prestigeStore'

const STORAGE_KEY = 'clicker-game-save-v2'
const AUTO_SAVE_INTERVAL = 30000 // 30 секунд

const initialState: GameState = {
  version: SAVE_VERSION,
  crystals: D(0),
  totalCrystalsEarned: D(0),
  workers: new Map(),
  upgrades: new Map(),
  totalClicks: 0,
  lastUpdate: Date.now(),
}

interface SerializedGameState {
  version: number
  crystals: string
  totalCrystalsEarned: string
  workers: [string, number][]
  upgrades: [string, number][]
  totalClicks: number
  lastUpdate: number
}

interface GameStore extends Omit<GameState, 'workers' | 'upgrades'> {
  workers: Map<string, number>
  upgrades: Map<string, number>
  
  // Вычисляемые значения (кэшированные)
  totalCps: Decimal
  baseClickValue: Decimal
  
  // Действия
  click: () => void
  buyWorker: (workerId: string, amount?: number) => void
  buyUpgrade: (upgradeId: string) => void
  
  // Утилиты
  getWorkerCount: (workerId: string) => number
  getWorkerCost: (workerId: string) => Decimal
  getUpgradeLevel: (upgradeId: string) => number
  getUpgradeCost: (upgradeId: string) => Decimal
  isWorkerUnlocked: (workerId: string) => boolean
  isUpgradeUnlocked: (upgradeId: string) => boolean
  canAffordWorker: (workerId: string) => boolean
  canAffordUpgrade: (upgradeId: string) => boolean
  
  // Обновление игрового цикла
  updateFromDelta: (delta: number) => void
  recalculateStats: () => void
  
  // Сохранение/загрузка
  reset: () => void
  loadFromStorage: () => void
  saveToStorage: () => void
}

export const useGameStore = create<GameStore>((set, get) => {
  // Сериализация состояния
  const serializeState = (state: GameState): SerializedGameState => {
    return {
      version: state.version,
      crystals: serializeDecimal(state.crystals),
      totalCrystalsEarned: serializeDecimal(state.totalCrystalsEarned),
      workers: Array.from(state.workers.entries()),
      upgrades: Array.from(state.upgrades.entries()),
      totalClicks: state.totalClicks,
      lastUpdate: state.lastUpdate,
    }
  }
  
  // Десериализация состояния
  const deserializeState = (data: SerializedGameState): GameState => {
    return {
      version: data.version,
      crystals: safeDeserializeDecimal(data.crystals, D(0)),
      totalCrystalsEarned: safeDeserializeDecimal(data.totalCrystalsEarned, D(0)),
      workers: new Map(data.workers),
      upgrades: new Map(data.upgrades),
      totalClicks: data.totalClicks || 0,
      lastUpdate: data.lastUpdate,
    }
  }
  
  // Загрузка из localStorage
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as SerializedGameState
        const state = deserializeState(parsed)
        
        // Рассчитываем оффлайн прогресс
        const now = Date.now()
        const offlineDelta = now - state.lastUpdate
        
        // Вычисляем CPS
        const multiplierStore = useMultiplierStore.getState()
        let totalCps = D(0)
        
        state.workers.forEach((count, workerId) => {
          const config = getWorker(workerId)
          if (config) {
            const workerMultiplier = multiplierStore.getWorkerMultiplier(workerId)
            const workerCps = calculateWorkerCps(config, count, workerMultiplier)
            totalCps = totalCps.add(workerCps)
          }
        })
        
        // Получаем процент оффлайн прогресса из апгрейда
        const offlineProgressLevel = state.upgrades.get('offlineProgress') || 0
        const offlineProgressConfig = getUpgrade('offlineProgress')
        let offlinePercentage: number = GAME_BALANCE.BASE_OFFLINE_PROGRESS_PERCENTAGE
        
        if (offlineProgressLevel > 0 && offlineProgressConfig) {
          const effect = offlineProgressConfig.effect(offlineProgressLevel)
          offlinePercentage = effect.value.toNumber()
        }
        
        // Добавляем бонус от престиж-апгрейда crystallineResonance
        const prestigeStore = usePrestigeStore.getState()
        const crystallineResonanceLevel = prestigeStore.upgrades.get('crystallineResonance') || 0
        if (crystallineResonanceLevel > 0) {
          // +50% за уровень
          offlinePercentage = Math.min(
            offlinePercentage * (1 + crystallineResonanceLevel * 0.5),
            GAME_BALANCE.MAX_OFFLINE_PROGRESS_PERCENTAGE
          )
        }
        
        // Добавляем бонус от престиж-апгрейда timeWarp
        const timeWarpLevel = prestigeStore.upgrades.get('timeWarp') || 0
        let offlineSpeedMultiplier = 1
        if (timeWarpLevel > 0) {
          // +25% скорости за уровень
          offlineSpeedMultiplier = 1 + timeWarpLevel * 0.25
        }
        
        // Ограничиваем максимальное время оффлайн прогресса
        const maxOfflineMs = GAME_BALANCE.MAX_OFFLINE_HOURS * 60 * 60 * 1000
        const effectiveOfflineDelta = Math.min(offlineDelta, maxOfflineMs)
        
        // Добавляем оффлайн кристаллы с учётом процента и скорости
        const offlineCrystals = effectiveOfflineDelta > 0 && totalCps.gt(0)
          ? totalCps.mul(effectiveOfflineDelta / 1000).mul(offlinePercentage).mul(offlineSpeedMultiplier)
          : D(0)
        
        console.log('[Load] Offline progress:', {
          offlineTime: effectiveOfflineDelta / 1000,
          cps: totalCps.toString(),
          offlinePercentage: offlinePercentage,
          offlineSpeedMultiplier: offlineSpeedMultiplier,
          earned: offlineCrystals.toString(),
        })
        
        set({
          ...state,
          crystals: state.crystals.add(offlineCrystals),
          totalCrystalsEarned: state.totalCrystalsEarned.add(offlineCrystals),
          totalCps,
          lastUpdate: now,
        })
        
        // Синхронизируем множители
        syncUpgradeMultipliers(state.upgrades, getAllUpgrades())
        
        return
      }
    } catch (error) {
      console.error('Failed to load from storage:', error)
    }
    
    // Если загрузка не удалась, используем начальное состояние
    set(initialState)
  }
  
  // Сохранение в localStorage
  const saveToStorage = () => {
    try {
      const state = get()
      const serialized = serializeState({
        version: state.version,
        crystals: state.crystals,
        totalCrystalsEarned: state.totalCrystalsEarned,
        workers: state.workers,
        upgrades: state.upgrades,
        totalClicks: state.totalClicks,
        lastUpdate: state.lastUpdate,
      })
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }
  
  // Пересчёт статистики
  const recalculateStats = () => {
    const state = get()
    const multiplierStore = useMultiplierStore.getState()
    
    // Вычисляем базовый клик
    let baseClick = D(1)
    
    // Добавляем аддитивные бонусы от апгрейдов
    state.upgrades.forEach((level, upgradeId) => {
      const config = getUpgrade(upgradeId)
      if (config && level > 0) {
        const effect = config.effect(level)
        if (effect.type === 'additive' && effect.target === 'click') {
          baseClick = baseClick.add(effect.value)
        }
      }
    })
    
    // Вычисляем CPS
    let totalCps = D(0)
    
    state.workers.forEach((count, workerId) => {
      const config = getWorker(workerId)
      if (config && count > 0) {
        const workerMultiplier = multiplierStore.getWorkerMultiplier(workerId)
        const workerCps = calculateWorkerCps(config, count, workerMultiplier)
        totalCps = totalCps.add(workerCps)
      }
    })
    
    // Добавляем автокликер (из категории OFFLINE)
    const autoClickerLevel = state.upgrades.get('autoClicker') || 0
    if (autoClickerLevel > 0) {
      const clickMultiplier = multiplierStore.getClickMultiplier()
      const autoClickValue = baseClick.mul(clickMultiplier).mul(autoClickerLevel)
      totalCps = totalCps.add(autoClickValue)
    }
    
    // Добавляем пассивные кристаллы (независимо от воркеров)
    const passiveCrystalsLevel = state.upgrades.get('passiveCrystals') || 0
    if (passiveCrystalsLevel > 0) {
      totalCps = totalCps.add(D(passiveCrystalsLevel))
    }
    
    set({ totalCps, baseClickValue: baseClick })
  }
  
  // Загружаем начальное состояние
  let initialData = initialState
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as SerializedGameState
      initialData = deserializeState(parsed)
      
      // Оффлайн прогресс будет добавлен при первом рендере
      const now = Date.now()
      const offlineDelta = now - initialData.lastUpdate
      
      let totalCps = D(0)
      initialData.workers.forEach((count, workerId) => {
        const config = getWorker(workerId)
        if (config) {
          totalCps = totalCps.add(config.baseCps.mul(count))
        }
      })
      
      const offlineCrystals = offlineDelta > 0 && totalCps.gt(0)
        ? totalCps.mul(offlineDelta / 1000)
        : D(0)
      
      initialData.crystals = initialData.crystals.add(offlineCrystals)
      initialData.totalCrystalsEarned = initialData.totalCrystalsEarned.add(offlineCrystals)
      initialData.lastUpdate = now
    }
  } catch (error) {
    console.error('Failed to load initial state:', error)
  }
  
  // Автосохранение
  setInterval(() => {
    const store = useGameStore.getState()
    store.saveToStorage()
  }, AUTO_SAVE_INTERVAL)
  
  return {
    ...initialData,
    totalCps: D(0),
    baseClickValue: D(1),
    
    click: () => {
      const state = get()
      const multiplierStore = useMultiplierStore.getState()
      
      const clickMultiplier = multiplierStore.getClickMultiplier()
      const clickValue = state.baseClickValue.mul(clickMultiplier)
      
      // Проверка критического удара (бонус к урону)
      const critLevel = state.upgrades.get('criticalStrike') || 0
      const critBonus = critLevel * 0.05 // +5% за уровень
      
      const finalValue = clickValue.mul(1 + critBonus)
      
      set({
        crystals: state.crystals.add(finalValue),
        totalCrystalsEarned: state.totalCrystalsEarned.add(finalValue),
        totalClicks: state.totalClicks + 1,
      })
      
      // Дебаунс сохранения
      setTimeout(() => saveToStorage(), 500)
    },
    
    buyWorker: (workerId: string, amount: number = 1) => {
      const state = get()
      const config = getWorker(workerId)
      
      if (!config) return
      
      const currentCount = state.workers.get(workerId) || 0
      const cost = calculateWorkerCost(config, currentCount)
      
      if (state.crystals.gte(cost)) {
        const newWorkers = new Map(state.workers)
        newWorkers.set(workerId, currentCount + amount)
        
        set({
          crystals: state.crystals.sub(cost),
          workers: newWorkers,
        })
        
        recalculateStats()
        saveToStorage()
      }
    },
    
    buyUpgrade: (upgradeId: string) => {
      const state = get()
      const config = getUpgrade(upgradeId)
      
      if (!config) return
      
      const currentLevel = state.upgrades.get(upgradeId) || 0
      
      // Проверка максимального уровня
      if (config.maxLevel && currentLevel >= config.maxLevel) return
      
      const cost = calculateUpgradeCost(config.baseCost, config.costGrowth, currentLevel)
      
      if (state.crystals.gte(cost)) {
        const newUpgrades = new Map(state.upgrades)
        newUpgrades.set(upgradeId, currentLevel + 1)
        
        set({
          crystals: state.crystals.sub(cost),
          upgrades: newUpgrades,
        })
        
        // Обновляем множители
        syncUpgradeMultipliers(newUpgrades, getAllUpgrades())
        recalculateStats()
        saveToStorage()
      }
    },
    
    getWorkerCount: (workerId: string) => {
      return get().workers.get(workerId) || 0
    },
    
    getWorkerCost: (workerId: string) => {
      const config = getWorker(workerId)
      if (!config) return D(0)
      
      const count = get().workers.get(workerId) || 0
      return calculateWorkerCost(config, count)
    },
    
    getUpgradeLevel: (upgradeId: string) => {
      return get().upgrades.get(upgradeId) || 0
    },
    
    getUpgradeCost: (upgradeId: string) => {
      const config = getUpgrade(upgradeId)
      if (!config) return D(0)
      
      const level = get().upgrades.get(upgradeId) || 0
      return calculateUpgradeCost(config.baseCost, config.costGrowth, level)
    },
    
    isWorkerUnlocked: (workerId: string) => {
      const config = getWorker(workerId)
      if (!config) return false
      
      const state = get()
      return checkUnlockRequirement(config.unlockRequirement, {
        crystals: state.crystals,
        workers: state.workers,
        upgrades: state.upgrades,
        prestigeLevel: 0,
      })
    },
    
    isUpgradeUnlocked: (upgradeId: string) => {
      const config = getUpgrade(upgradeId)
      if (!config) return false
      
      const state = get()
      return checkUnlockRequirement(config.unlockRequirement, {
        crystals: state.crystals,
        workers: state.workers,
        upgrades: state.upgrades,
        prestigeLevel: 0,
      })
    },
    
    canAffordWorker: (workerId: string) => {
      const cost = get().getWorkerCost(workerId)
      return get().crystals.gte(cost)
    },
    
    canAffordUpgrade: (upgradeId: string) => {
      const cost = get().getUpgradeCost(upgradeId)
      return get().crystals.gte(cost)
    },
    
    updateFromDelta: (delta: number) => {
      const state = get()
      const earned = state.totalCps.mul(delta / 1000)
      
      set({
        crystals: state.crystals.add(earned),
        totalCrystalsEarned: state.totalCrystalsEarned.add(earned),
        lastUpdate: Date.now(),
      })
    },
    
    recalculateStats,
    
    reset: () => {
      // Проверяем престиж-апгрейд autoProgress
      const prestigeStore = usePrestigeStore.getState()
      const autoProgressLevel = prestigeStore.upgrades.get('autoProgress') || 0
      
      // Начальные воркеры от autoProgress
      const initialWorkers = new Map<string, number>()
      if (autoProgressLevel > 0) {
        // Даём 10 базовых воркеров (basic)
        initialWorkers.set('basic', 10)
      }
      
      set({
        ...initialState,
        workers: initialWorkers,
        lastUpdate: Date.now(),
      })
      
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Failed to clear storage:', error)
      }
      
      // Очищаем множители
      useMultiplierStore.getState().clearMultipliersBySource(MultiplierSource.UPGRADE)
      
      recalculateStats()
    },
    
    loadFromStorage,
    saveToStorage,
  }
})

// Инициализация: загружаем состояние и пересчитываем статистику
setTimeout(() => {
  useGameStore.getState().recalculateStats()
}, 0)
