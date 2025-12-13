import { create } from 'zustand'
import { Decimal } from '../utils/bigNumber'
import {
  type Multiplier,
  MultiplierType,
  MultiplierSource,
  calculateTotalMultiplier,
  getWorkerMultipliers,
  getClickMultipliers,
} from '../types/multipliers'

interface MultiplierStore {
  // Все активные множители
  multipliers: Multiplier[]
  
  // Действия
  addMultiplier: (multiplier: Multiplier) => void
  removeMultiplier: (id: string) => void
  updateMultiplier: (id: string, value: Decimal) => void
  clearMultipliersBySource: (source: MultiplierSource) => void
  
  // Геттеры для вычисления множителей
  getGlobalMultiplier: () => Decimal
  getClickMultiplier: () => Decimal
  getProductionMultiplier: () => Decimal
  getWorkerMultiplier: (workerId: string) => Decimal
  getTotalClickValue: (baseClick: Decimal) => Decimal
  getTotalWorkerCps: (workerId: string, baseCps: Decimal) => Decimal
}

export const useMultiplierStore = create<MultiplierStore>((set, get) => ({
  multipliers: [],
  
  addMultiplier: (multiplier: Multiplier) => {
    set((state) => {
      // Проверяем, не существует ли уже такой множитель
      const exists = state.multipliers.some(m => m.id === multiplier.id)
      
      if (exists) {
        // Обновляем существующий
        return {
          multipliers: state.multipliers.map(m =>
            m.id === multiplier.id ? multiplier : m
          ),
        }
      }
      
      // Добавляем новый
      return {
        multipliers: [...state.multipliers, multiplier],
      }
    })
  },
  
  removeMultiplier: (id: string) => {
    set((state) => ({
      multipliers: state.multipliers.filter(m => m.id !== id),
    }))
  },
  
  updateMultiplier: (id: string, value: Decimal) => {
    set((state) => ({
      multipliers: state.multipliers.map(m =>
        m.id === id ? { ...m, value } : m
      ),
    }))
  },
  
  clearMultipliersBySource: (source: MultiplierSource) => {
    set((state) => ({
      multipliers: state.multipliers.filter(m => m.source !== source),
    }))
  },
  
  // Геттеры
  
  getGlobalMultiplier: () => {
    const { multipliers } = get()
    const globalMults = multipliers.filter(
      m => m.type === MultiplierType.GLOBAL
    )
    return calculateTotalMultiplier(globalMults)
  },
  
  getClickMultiplier: () => {
    const { multipliers } = get()
    const clickMults = getClickMultipliers(multipliers)
    return calculateTotalMultiplier(clickMults)
  },
  
  getProductionMultiplier: () => {
    const { multipliers } = get()
    const prodMults = multipliers.filter(
      m => m.type === MultiplierType.GLOBAL ||
           m.type === MultiplierType.PRODUCTION
    )
    return calculateTotalMultiplier(prodMults)
  },
  
  getWorkerMultiplier: (workerId: string) => {
    const { multipliers } = get()
    const workerMults = getWorkerMultipliers(multipliers, workerId)
    return calculateTotalMultiplier(workerMults)
  },
  
  getTotalClickValue: (baseClick: Decimal) => {
    const clickMultiplier = get().getClickMultiplier()
    return baseClick.mul(clickMultiplier)
  },
  
  getTotalWorkerCps: (workerId: string, baseCps: Decimal) => {
    const workerMultiplier = get().getWorkerMultiplier(workerId)
    return baseCps.mul(workerMultiplier)
  },
}))

/**
 * Хелпер для синхронизации множителей с апгрейдами
 */
export function syncUpgradeMultipliers(
  upgrades: Map<string, number>,
  upgradeConfigs: any[]
): void {
  const store = useMultiplierStore.getState()
  
  // Очищаем старые множители от апгрейдов
  store.clearMultipliersBySource(MultiplierSource.UPGRADE)
  
  // Добавляем новые множители для каждого апгрейда
  upgrades.forEach((level, upgradeId) => {
    if (level === 0) return
    
    const config = upgradeConfigs.find(u => u.id === upgradeId)
    if (!config) return
    
    const effect = config.effect(level)
    
    // Пропускаем аддитивные эффекты (они обрабатываются отдельно)
    if (effect.type !== 'multiplicative') return
    
    // Создаём множитель из эффекта
    const multiplier: Multiplier = {
      id: `upgrade_${upgradeId}`,
      type: effect.target === 'click' ? MultiplierType.CLICK :
            effect.target === 'production' ? MultiplierType.PRODUCTION :
            effect.target === 'worker' ? MultiplierType.WORKER :
            MultiplierType.GLOBAL,
      source: MultiplierSource.UPGRADE,
      value: effect.value,
      workerId: effect.workerId,
      description: config.name,
    }
    
    store.addMultiplier(multiplier)
  })
}

