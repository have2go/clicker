import { create } from 'zustand'
import {
  type Multiplier,
  MultiplierType,
  MultiplierSource,
  calculateTotalMultiplier,
  getWorkerMultipliers,
  getClickMultipliers,
} from '../types/multipliers'

interface MultiplierStore {
  /** Все активные множители в игре */
  multipliers: Multiplier[]

  // Действия
  /** Добавить новый множитель или обновить существующий */
  addMultiplier: (multiplier: Multiplier) => void
  /** Удалить множитель по ID */
  removeMultiplier: (id: string) => void
  /** Очистить все множители от определённого источника */
  clearMultipliersBySource: (source: MultiplierSource) => void
}

export const useMultiplierStore = create<MultiplierStore>((set) => ({
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

  clearMultipliersBySource: (source: MultiplierSource) => {
    set((state) => ({
      multipliers: state.multipliers.filter(m => m.source !== source),
    }))
  },
}))

// Селектор-функции для получения множителей
export const multiplierSelectors = {
  getGlobalMultiplier: (multipliers: Multiplier[]) => {
    const globalMults = multipliers.filter(m => m.type === MultiplierType.GLOBAL)
    return calculateTotalMultiplier(globalMults)
  },

  getClickMultiplier: (multipliers: Multiplier[]) => {
    const clickMults = getClickMultipliers(multipliers)
    return calculateTotalMultiplier(clickMults)
  },

  getProductionMultiplier: (multipliers: Multiplier[]) => {
    const prodMults = multipliers.filter(
      m => m.type === MultiplierType.GLOBAL || m.type === MultiplierType.PRODUCTION
    )
    return calculateTotalMultiplier(prodMults)
  },

  getWorkerMultiplier: (multipliers: Multiplier[], workerId: string) => {
    const workerMults = getWorkerMultipliers(multipliers, workerId)
    return calculateTotalMultiplier(workerMults)
  },
}

/**
 * Синхронизирует множители с апгрейдами игры
 * Автоматически создаёт/обновляет множители на основе уровней апгрейдов
 * @param upgrades - Map с уровнями апгрейдов
 * @param upgradeConfigs - массив конфигураций апгрейдов
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

