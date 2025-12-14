import { D } from '../../utils/bigNumber'
import type { Decimal } from '../../utils/bigNumber'

/**
 * ============================================
 * ЭКОНОМИЧЕСКИЙ БАЛАНС ИГРЫ
 * ============================================
 * 
 * Этот файл содержит ВСЕ экономические параметры игры:
 * - Базовые цены и стоимости
 * - Множители роста
 * - Формулы прогрессии
 * - Балансовые константы
 * 
 * Разделение позволяет:
 * 1. Анализировать баланс отдельно от контента
 * 2. Быстро находить и менять числовые параметры
 * 3. Экспортировать в Excel/JSON для анализа
 * 4. A/B тестировать разные балансы
 */

// ============================================
// ВОРКЕРЫ - ЭКОНОМИКА
// ============================================

export interface WorkerEconomy {
  /** Базовая цена первого воркера */
  baseCost: Decimal
  /** Множитель роста стоимости при покупке (стоимость *= growth^level) */
  costGrowth: number
  /** Базовое производство в секунду (crystals per second) */
  baseCps: Decimal
  /** Множитель производства от уровня (1 = линейный рост) */
  cpsGrowth?: number
  /** Требование для разблокировки (опционально) */
  unlockRequirement?: {
    type: 'worker' | 'crystals'
    targetId?: string
    level?: number
    amount?: Decimal
  }
}

/**
 * Экономические параметры всех воркеров
 * Ключи соответствуют ID воркеров из workers.ts
 */
export const WORKERS_ECONOMY: Record<string, WorkerEconomy> = {
  basic: {
    baseCost: D(25),
    costGrowth: 1.15,
    baseCps: D(0.1),
  },
  
  engineer: {
    baseCost: D(250),
    costGrowth: 1.15,
    baseCps: D(1),
    unlockRequirement: {
      type: 'worker',
      targetId: 'basic',
      level: 5,
    },
  },
  
  master: {
    baseCost: D(2500),
    costGrowth: 1.15,
    baseCps: D(10),
    unlockRequirement: {
      type: 'worker',
      targetId: 'engineer',
      level: 5,
    },
  },
  
  architect: {
    baseCost: D(25000),
    costGrowth: 1.15,
    baseCps: D(100),
    unlockRequirement: {
      type: 'worker',
      targetId: 'master',
      level: 5,
    },
  },
  
  scientist: {
    baseCost: D(250000),
    costGrowth: 1.15,
    baseCps: D(1000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'architect',
      level: 5,
    },
  },
  
  overseer: {
    baseCost: D(2500000),
    costGrowth: 1.15,
    baseCps: D(10000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'scientist',
      level: 5,
    },
  },
  
  automaton: {
    baseCost: D(25000000),
    costGrowth: 1.15,
    baseCps: D(100000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'overseer',
      level: 5,
    },
  },
  
  crystallizer: {
    baseCost: D(250000000),
    costGrowth: 1.15,
    baseCps: D(1000000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'automaton',
      level: 5,
    },
  },
  
  synthesizer: {
    baseCost: D(2500000000),
    costGrowth: 1.15,
    baseCps: D(10000000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'crystallizer',
      level: 5,
    },
  },
  
  transcendent: {
    baseCost: D(25000000000),
    costGrowth: 1.15,
    baseCps: D(100000000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'synthesizer',
      level: 5,
    },
  },
}

// ============================================
// АПГРЕЙДЫ - ЭКОНОМИКА
// ============================================

export interface UpgradeEconomy {
  /** Базовая цена первого уровня */
  baseCost: Decimal
  /** Множитель роста стоимости (стоимость *= growth^level) */
  costGrowth: number
  /** Формула эффекта (параметр - текущий уровень) */
  effectFormula: (level: number) => Decimal
  /** Тип эффекта для понимания прогрессии */
  effectType: 'additive' | 'multiplicative'
  /** Что усиливает */
  effectTarget: 'click' | 'production' | 'global' | 'worker'
  /** Максимальный уровень (опционально) */
  maxLevel?: number
  /** Требование для разблокировки */
  unlockRequirement?: {
    type: 'upgrade' | 'worker' | 'crystals'
    targetId?: string
    level?: number
    amount?: Decimal
  }
}

/**
 * Экономические параметры всех апгрейдов
 * Ключи соответствуют ID апгрейдов из upgrades.ts
 */
export const UPGRADES_ECONOMY: Record<string, UpgradeEconomy> = {
  clickPower: {
    baseCost: D(20),
    costGrowth: 1.6,
    effectFormula: (level: number) => D(level * 0.2), // +0.2 за уровень
    effectType: 'additive',
    effectTarget: 'click',
  },
  
  clickMultiplier: {
    baseCost: D(500),
    costGrowth: 2.5,
    effectFormula: (level: number) => D(Math.pow(1.25, level)), // +25% за уровень
    effectType: 'multiplicative',
    effectTarget: 'click',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'clickPower',
      level: 5,
    },
  },
  
  criticalClick: {
    baseCost: D(5000),
    costGrowth: 3,
    effectFormula: (level: number) => D(level * 0.05), // +5% крит шанс за уровень
    effectType: 'additive',
    effectTarget: 'click',
    maxLevel: 20, // Максимум 100% шанс
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'clickMultiplier',
      level: 3,
    },
  },
  
  autoClicker: {
    baseCost: D(1000),
    costGrowth: 2,
    effectFormula: (level: number) => D(level), // +1 автоклик/сек за уровень
    effectType: 'additive',
    effectTarget: 'click',
    unlockRequirement: {
      type: 'crystals',
      amount: D(500),
    },
  },
  
  globalProduction: {
    baseCost: D(2000),
    costGrowth: 2.2,
    effectFormula: (level: number) => D(Math.pow(1.1, level)), // +10% за уровень
    effectType: 'multiplicative',
    effectTarget: 'global',
    unlockRequirement: {
      type: 'worker',
      targetId: 'basic',
      level: 10,
    },
  },
  
  workerEfficiency: {
    baseCost: D(10000),
    costGrowth: 2.8,
    effectFormula: (level: number) => D(Math.pow(1.5, level)), // +50% за уровень
    effectType: 'multiplicative',
    effectTarget: 'production',
    unlockRequirement: {
      type: 'worker',
      targetId: 'engineer',
      level: 5,
    },
  },
  
  luckyBonus: {
    baseCost: D(50000),
    costGrowth: 3.5,
    effectFormula: (level: number) => D(Math.pow(1.02, level)), // +2% за уровень
    effectType: 'multiplicative',
    effectTarget: 'global',
    maxLevel: 50,
    unlockRequirement: {
      type: 'crystals',
      amount: D(25000),
    },
  },
}

// ============================================
// ПРЕСТИЖ - ЭКОНОМИКА
// ============================================

export interface PrestigeEconomy {
  /** Минимум кристаллов для первого престижа */
  minCrystalsRequired: Decimal
  /** Формула награды за престиж */
  rewardFormula: (totalCrystals: Decimal) => Decimal
  /** Формула глобального множителя от валюты */
  currencyMultiplierFormula: (currency: Decimal) => Decimal
  /** Описание прогрессии для документации */
  progression: {
    description: string
    examples: Array<{
      crystals: string
      reward: string
      multiplier?: string
    }>
  }
}

export const PRESTIGE_ECONOMY: PrestigeEconomy = {
  minCrystalsRequired: D(1e6), // 1 миллион
  
  // Формула: sqrt(totalCrystals / 1e6)
  rewardFormula: (totalCrystals: Decimal): Decimal => {
    if (totalCrystals.lt(1e6)) return D(0)
    return totalCrystals.div(1e6).sqrt().floor()
  },
  
  // Множитель: 1 + (currency * 0.1)
  // Каждый престиж-кристалл = +10%
  currencyMultiplierFormula: (currency: Decimal): Decimal => {
    return D(1).add(currency.mul(0.1))
  },
  
  progression: {
    description: 'Престиж-награда растёт с квадратным корнем от кристаллов. Каждый престиж-кристалл даёт +10% глобально.',
    examples: [
      { crystals: '1M', reward: '1', multiplier: 'x1.1' },
      { crystals: '4M', reward: '2', multiplier: 'x1.2' },
      { crystals: '9M', reward: '3', multiplier: 'x1.3' },
      { crystals: '100M', reward: '10', multiplier: 'x2.0' },
      { crystals: '1B', reward: '31', multiplier: 'x4.1' },
    ],
  },
}

// ============================================
// ПРЕСТИЖ-АПГРЕЙДЫ - ЭКОНОМИКА
// ============================================

export interface PrestigeUpgradeEconomy {
  /** Стоимость в престиж-валюте */
  cost: Decimal
  /** Формула эффекта */
  effectFormula: (level: number) => Decimal
  /** Тип эффекта */
  effectType: 'multiplier' | 'special'
  /** Цель эффекта */
  effectTarget?: 'production' | 'click' | 'upgradeCost'
  /** Максимальный уровень */
  maxLevel?: number
}

export const PRESTIGE_UPGRADES_ECONOMY: Record<string, PrestigeUpgradeEconomy> = {
  productionBoost: {
    cost: D(5),
    effectFormula: (level: number) => D(Math.pow(1.25, level)), // +25% за уровень
    effectType: 'multiplier',
    effectTarget: 'production',
  },
  
  clickBoost: {
    cost: D(5),
    effectFormula: (level: number) => D(Math.pow(1.5, level)), // +50% за уровень
    effectType: 'multiplier',
    effectTarget: 'click',
  },
  
  workerEfficiency: {
    cost: D(10),
    effectFormula: (level: number) => D(Math.pow(2, level)), // +100% за уровень
    effectType: 'multiplier',
    effectTarget: 'production',
  },
  
  autoProgress: {
    cost: D(20),
    effectFormula: (level: number) => D(level),
    effectType: 'special',
    maxLevel: 1,
  },
  
  cheaperUpgrades: {
    cost: D(15),
    effectFormula: (level: number) => D(Math.pow(0.95, level)), // -5% за уровень
    effectType: 'multiplier',
    effectTarget: 'upgradeCost',
    maxLevel: 10,
  },
}

// ============================================
// БАЛАНСОВЫЕ КОНСТАНТЫ
// ============================================

/**
 * Общие константы баланса игры
 */
export const GAME_BALANCE = {
  /** Базовая сила клика */
  BASE_CLICK_POWER: D(1),
  
  /** Интервал автосохранения (мс) */
  AUTO_SAVE_INTERVAL: 30000,
  
  /** Максимальный оффлайн прогресс (часы) */
  MAX_OFFLINE_HOURS: 24,
  
  /** Процент оффлайн прогресса (0.5 = 50%) */
  OFFLINE_PROGRESS_PERCENTAGE: 0.5,
} as const

// ============================================
// АНАЛИЗ ПРОГРЕССИИ
// ============================================

/**
 * Вспомогательные функции для анализа экономики
 */

/**
 * Рассчитать стоимость N уровней воркера
 */
export function calculateWorkerCostToLevel(
  workerId: string,
  fromLevel: number,
  toLevel: number
): Decimal {
  const economy = WORKERS_ECONOMY[workerId]
  if (!economy) return D(0)
  
  let totalCost = D(0)
  for (let i = fromLevel; i < toLevel; i++) {
    totalCost = totalCost.add(
      economy.baseCost.mul(Math.pow(economy.costGrowth, i))
    )
  }
  return totalCost
}

/**
 * Рассчитать общее CPS для N воркеров на уровне L
 */
export function calculateWorkerTotalCps(
  workerId: string,
  count: number,
  level: number = 1
): Decimal {
  const economy = WORKERS_ECONOMY[workerId]
  if (!economy) return D(0)
  
  const cpsPerWorker = economy.baseCps.mul(
    Math.pow(economy.cpsGrowth || 1, level - 1)
  )
  return cpsPerWorker.mul(count)
}

/**
 * Рассчитать стоимость N уровней апгрейда
 */
export function calculateUpgradeCostToLevel(
  upgradeId: string,
  fromLevel: number,
  toLevel: number
): Decimal {
  const economy = UPGRADES_ECONOMY[upgradeId]
  if (!economy) return D(0)
  
  let totalCost = D(0)
  for (let i = fromLevel; i < toLevel; i++) {
    totalCost = totalCost.add(
      economy.baseCost.mul(Math.pow(economy.costGrowth, i))
    )
  }
  return totalCost
}

/**
 * Получить эффект апгрейда на уровне N
 */
export function getUpgradeEffectAtLevel(
  upgradeId: string,
  level: number
): Decimal {
  const economy = UPGRADES_ECONOMY[upgradeId]
  if (!economy) return D(0)
  return economy.effectFormula(level)
}

// ============================================
// ЭКСПОРТ ДЛЯ АНАЛИЗА
// ============================================

/**
 * Экспортировать весь баланс в JSON-friendly формат
 * Полезно для анализа в Excel/Google Sheets
 */
export function exportBalanceForAnalysis() {
  return {
    workers: Object.entries(WORKERS_ECONOMY).map(([id, eco]) => ({
      id,
      baseCost: eco.baseCost.toString(),
      costGrowth: eco.costGrowth,
      baseCps: eco.baseCps.toString(),
      // Примеры стоимости на разных уровнях
      cost_level_1: eco.baseCost.toString(),
      cost_level_10: eco.baseCost.mul(Math.pow(eco.costGrowth, 9)).toString(),
      cost_level_50: eco.baseCost.mul(Math.pow(eco.costGrowth, 49)).toString(),
      cost_level_100: eco.baseCost.mul(Math.pow(eco.costGrowth, 99)).toString(),
    })),
    
    upgrades: Object.entries(UPGRADES_ECONOMY).map(([id, eco]) => ({
      id,
      baseCost: eco.baseCost.toString(),
      costGrowth: eco.costGrowth,
      effectType: eco.effectType,
      effectTarget: eco.effectTarget,
      maxLevel: eco.maxLevel || 'unlimited',
      // Примеры эффекта на разных уровнях
      effect_level_1: eco.effectFormula(1).toString(),
      effect_level_5: eco.effectFormula(5).toString(),
      effect_level_10: eco.effectFormula(10).toString(),
      effect_level_20: eco.effectFormula(20).toString(),
    })),
    
    prestige: {
      minRequired: PRESTIGE_ECONOMY.minCrystalsRequired.toString(),
      progression: PRESTIGE_ECONOMY.progression,
    },
  }
}
