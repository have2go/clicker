import { create } from 'zustand'
import { Decimal, D, serializeDecimal, safeDeserializeDecimal } from '../utils/bigNumber'
import type { PrestigeState } from '../types/prestige'
import { PRESTIGE_CONFIG, getPrestigeUpgrade } from '../configs/prestige'
import { useMultiplierStore } from './multiplierStore'
import { MultiplierType, MultiplierSource } from '../types/multipliers'

const PRESTIGE_STORAGE_KEY = 'clicker-prestige-save'

const initialState: PrestigeState = {
  level: 0,
  currency: D(0),
  totalPrestigeCurrency: D(0),
  lastPrestigeTime: 0,
}

interface SerializedPrestigeState {
  level: number
  currency: string
  totalPrestigeCurrency: string
  lastPrestigeTime: number
  upgrades: [string, number][]
}

interface PrestigeStore extends PrestigeState {
  // Престиж-апгрейды (уровни)
  upgrades: Map<string, number>
  
  // Действия
  canPrestige: (totalCrystalsEarned: Decimal) => boolean
  calculatePrestigeReward: (totalCrystalsEarned: Decimal) => Decimal
  performPrestige: (totalCrystalsEarned: Decimal, resetGameCallback: () => void) => void
  buyPrestigeUpgrade: (upgradeId: string) => void
  
  // Утилиты
  getUpgradeLevel: (upgradeId: string) => number
  getUpgradeCost: (upgradeId: string) => Decimal
  canAffordUpgrade: (upgradeId: string) => boolean
  getGlobalMultiplier: () => Decimal
  
  // Сохранение/загрузка
  saveToStorage: () => void
  loadFromStorage: () => void
  syncMultipliers: () => void
}

export const usePrestigeStore = create<PrestigeStore>((set, get) => {
  // Сериализация
  const serializeState = (): SerializedPrestigeState => {
    const state = get()
    return {
      level: state.level,
      currency: serializeDecimal(state.currency),
      totalPrestigeCurrency: serializeDecimal(state.totalPrestigeCurrency),
      lastPrestigeTime: state.lastPrestigeTime,
      upgrades: Array.from(state.upgrades.entries()),
    }
  }
  
  // Десериализация
  const deserializeState = (data: SerializedPrestigeState): Partial<PrestigeStore> => {
    return {
      level: data.level || 0,
      currency: safeDeserializeDecimal(data.currency, D(0)),
      totalPrestigeCurrency: safeDeserializeDecimal(data.totalPrestigeCurrency, D(0)),
      lastPrestigeTime: data.lastPrestigeTime || 0,
      upgrades: new Map(data.upgrades || []),
    }
  }
  
  // Загрузка из localStorage
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem(PRESTIGE_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as SerializedPrestigeState
        const state = deserializeState(parsed)
        set(state)
        
        // Синхронизируем множители
        setTimeout(() => get().syncMultipliers(), 0)
      }
    } catch (error) {
      console.error('[Prestige] Failed to load:', error)
    }
  }
  
  // Сохранение
  const saveToStorage = () => {
    try {
      const serialized = serializeState()
      localStorage.setItem(PRESTIGE_STORAGE_KEY, JSON.stringify(serialized))
    } catch (error) {
      console.error('[Prestige] Failed to save:', error)
    }
  }
  
  // Синхронизация множителей с престиж-апгрейдами
  const syncMultipliers = () => {
    const state = get()
    const multiplierStore = useMultiplierStore.getState()
    
    // Очищаем старые престиж-множители
    multiplierStore.clearMultipliersBySource(MultiplierSource.PRESTIGE)
    
    // Глобальный множитель от престиж-валюты
    const globalMult = PRESTIGE_CONFIG.getGlobalMultiplier(state.currency)
    if (globalMult.gt(1)) {
      multiplierStore.addMultiplier({
        id: 'prestige_global',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.PRESTIGE,
        value: globalMult,
        description: 'Кристаллы престижа',
      })
    }
    
    // Множители от престиж-апгрейдов
    state.upgrades.forEach((level, upgradeId) => {
      if (level === 0) return
      
      const config = getPrestigeUpgrade(upgradeId)
      if (!config) return
      
      const effect = config.effect(level)
      
      if (effect.type === 'multiplier') {
        const multType = 
          effect.target === 'click' ? MultiplierType.CLICK :
          effect.target === 'production' ? MultiplierType.PRODUCTION :
          MultiplierType.GLOBAL
        
        multiplierStore.addMultiplier({
          id: `prestige_upgrade_${upgradeId}`,
          type: multType,
          source: MultiplierSource.PRESTIGE,
          value: effect.value,
          description: config.name,
        })
      }
      
      // Обработка специальных апгрейдов
      if (effect.type === 'special') {
        // Апгрейды с престиж-валютой в формуле
        if (upgradeId === 'exponentialGrowth' || upgradeId === 'presenceAmplification' || upgradeId === 'ultimateAscension') {
          // Эти апгрейды масштабируются с престиж-валютой
          // effectFormula уже возвращает правильный множитель на основе level (prestge currency)
          const multValue = effect.value.pow(state.currency)
          
          if (multValue.gt(1)) {
            multiplierStore.addMultiplier({
              id: `prestige_upgrade_${upgradeId}`,
              type: MultiplierType.GLOBAL,
              source: MultiplierSource.PRESTIGE,
              value: multValue,
              description: config.name,
            })
          }
        }
        // Другие специальные апгрейды обрабатываются в gameStore
        // (например, autoProgress, crystallineResonance, luckyClicks, timeWarp)
      }
    })
  }
  
  // Загружаем начальное состояние
  let initialData: Partial<PrestigeStore> = {
    ...initialState,
    upgrades: new Map(),
  }
  
  try {
    const saved = localStorage.getItem(PRESTIGE_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved) as SerializedPrestigeState
      initialData = {
        ...deserializeState(parsed),
      }
    }
  } catch (error) {
    console.error('[Prestige] Failed to load initial state:', error)
  }
  
  return {
    ...initialState,
    ...initialData,
    upgrades: initialData.upgrades || new Map(),
    
    canPrestige: (totalCrystalsEarned: Decimal) => {
      return totalCrystalsEarned.gte(PRESTIGE_CONFIG.minCrystalsForPrestige)
    },
    
    calculatePrestigeReward: (totalCrystalsEarned: Decimal) => {
      return PRESTIGE_CONFIG.calculateReward(totalCrystalsEarned)
    },
    
    performPrestige: (totalCrystalsEarned: Decimal, resetGameCallback: () => void) => {
      const reward = PRESTIGE_CONFIG.calculateReward(totalCrystalsEarned)
      
      if (reward.lte(0)) {
        console.warn('[Prestige] No reward, prestige not performed')
        return
      }
      
      set(state => ({
        level: state.level + 1,
        currency: state.currency.add(reward),
        totalPrestigeCurrency: state.totalPrestigeCurrency.add(reward),
        lastPrestigeTime: Date.now(),
      }))
      
      // Сохраняем престиж
      saveToStorage()
      
      // Синхронизируем множители
      get().syncMultipliers()
      
      // Сбрасываем игру
      resetGameCallback()
      
      console.log('[Prestige] Performed! Reward:', reward.toString())
    },
    
    buyPrestigeUpgrade: (upgradeId: string) => {
      const state = get()
      const config = getPrestigeUpgrade(upgradeId)
      
      if (!config) return
      
      const currentLevel = state.upgrades.get(upgradeId) || 0
      
      // Проверка максимального уровня
      if (config.maxLevel && currentLevel >= config.maxLevel) return
      
      // Проверка стоимости
      if (state.currency.lt(config.cost)) return
      
      const newUpgrades = new Map(state.upgrades)
      newUpgrades.set(upgradeId, currentLevel + 1)
      
      set({
        currency: state.currency.sub(config.cost),
        upgrades: newUpgrades,
      })
      
      // Синхронизируем множители
      get().syncMultipliers()
      saveToStorage()
    },
    
    getUpgradeLevel: (upgradeId: string) => {
      return get().upgrades.get(upgradeId) || 0
    },
    
    getUpgradeCost: (upgradeId: string) => {
      const config = getPrestigeUpgrade(upgradeId)
      return config ? config.cost : D(0)
    },
    
    canAffordUpgrade: (upgradeId: string) => {
      const cost = get().getUpgradeCost(upgradeId)
      return get().currency.gte(cost)
    },
    
    getGlobalMultiplier: () => {
      return PRESTIGE_CONFIG.getGlobalMultiplier(get().currency)
    },
    
    saveToStorage,
    loadFromStorage,
    syncMultipliers,
  }
})

// Инициализация: загружаем состояние и синхронизируем множители
setTimeout(() => {
  usePrestigeStore.getState().syncMultipliers()
}, 0)

