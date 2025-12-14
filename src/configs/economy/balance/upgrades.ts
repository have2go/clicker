import { D } from '../../../utils/bigNumber'
import type { Decimal } from '../../../utils/bigNumber'

/**
 * ============================================
 * АПГРЕЙДЫ - ЭКОНОМИКА
 * ============================================
 */

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
    type: 'upgrade' | 'worker' | 'crystals' | 'upgrades_count' | 'category_upgrades'
    targetId?: string
    level?: number
    amount?: Decimal
    count?: number
    upgradeIds?: string[]
    minLevels?: number[]
  }
}

/**
 * Экономические параметры всех апгрейдов
 * Ключи соответствуют ID апгрейдов из upgrades.ts
 */
export const UPGRADES_ECONOMY: Record<string, UpgradeEconomy> = {
  // ============================================
  // КАТЕГОРИЯ 1: CLICK POWER (4 апгрейда)
  // Прямое усиление клика
  // ============================================
  
  clickPower: {
    baseCost: D(20),
    costGrowth: 1.50,
    effectFormula: (level: number) => D(level * 0.1), // +0.1 за уровень
    effectType: 'additive',
    effectTarget: 'click',
  },
  
  clickMultiplier: {
    baseCost: D(400),
    costGrowth: 2.2,
    effectFormula: (level: number) => D(Math.pow(1.15, level)), // x1.15 за уровень
    effectType: 'multiplicative',
    effectTarget: 'click',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'clickPower',
      level: 5,
    },
  },
  
  criticalStrike: {
    baseCost: D(3000),
    costGrowth: 2.8,
    effectFormula: (level: number) => D(level * 0.05), // +5% к урону за уровень
    effectType: 'additive',
    effectTarget: 'click',
    maxLevel: 10, // Максимум 50% бонус
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'clickMultiplier',
      level: 5,
    },
  },
  
  clickCombo: {
    baseCost: D(8000),
    costGrowth: 3.5,
    effectFormula: (level: number) => D(Math.pow(1.1, level)), // x1.1 за уровень
    effectType: 'multiplicative',
    effectTarget: 'click',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'criticalStrike',
      level: 5,
    },
  },
  
  // ============================================
  // СПЕЦИАЛЬНЫЕ КЛИК МЕХАНИКИ (4 апгрейда)
  // Уникальные и веселые механики
  // ============================================
  
  luckyStrike: {
    baseCost: D(20000),
    costGrowth: 2.3,
    effectFormula: (level: number) => D(0.02 * level), // 2% шанс x10 урон за уровень
    effectType: 'additive',
    effectTarget: 'click',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'clickMultiplier',
      level: 5,
    },
  },
  
  mirrorPool: {
    baseCost: D(40000),
    costGrowth: 2.6,
    effectFormula: (level: number) => D(1000 * level), // +1000 CPS на 60сек за уровень
    effectType: 'additive',
    effectTarget: 'production',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'luckyStrike',
      level: 5,
    },
  },
  
  timeWarp: {
    baseCost: D(150000),
    costGrowth: 3.0,
    effectFormula: (level: number) => D(Math.pow(3, level)), // x3 production на 10 секунд за уровень
    effectType: 'multiplicative',
    effectTarget: 'production',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'mirrorPool',
      level: 5,
    },
  },
  
  realityBreaker: {
    baseCost: D(5000000),
    costGrowth: 4.5,
    effectFormula: (level: number) => D(Math.pow(2, level)), // x2 ко всему за уровень при 10M+ CPS
    effectType: 'multiplicative',
    effectTarget: 'global',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'timeWarp',
      level: 5,
    },
  },
  
  // ============================================
  // ПРОИЗВОДСТВО
  // ============================================
  
  globalProduction: {
    baseCost: D(2000),
    costGrowth: 2.2,
    effectFormula: (level: number) => D(Math.pow(1.1, level)), // +10% за уровень
    effectType: 'multiplicative',
    effectTarget: 'global',
    unlockRequirement: {
      type: 'worker',
      targetId: 'miner',
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
  
  // ============================================
  // СПЕЦИАЛЬНЫЕ
  // ============================================
  
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
  
  // ============================================
  // БУСТЫ ВОРКЕРОВ (10 апгрейдов)
  // Усиление производства каждого воркера
  // ============================================
  
  minerBoost: {
    baseCost: D(100),
    costGrowth: 1.8,
    effectFormula: (level: number) => D(Math.pow(1.2, level)), // x1.2 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'miner',
      level: 10,
    },
  },
  
  crafterBoost: {
    baseCost: D(800),
    costGrowth: 1.9,
    effectFormula: (level: number) => D(Math.pow(1.3, level)), // x1.3 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'crafter',
      level: 10,
    },
  },
  
  alchemistBoost: {
    baseCost: D(8000),
    costGrowth: 2.0,
    effectFormula: (level: number) => D(Math.pow(1.4, level)), // x1.4 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'alchemist',
      level: 10,
    },
  },
  
  engineerBoost: {
    baseCost: D(60000),
    costGrowth: 2.1,
    effectFormula: (level: number) => D(Math.pow(1.5, level)), // x1.5 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'engineer',
      level: 10,
    },
  },
  
  technicianBoost: {
    baseCost: D(600000),
    costGrowth: 2.2,
    effectFormula: (level: number) => D(Math.pow(1.6, level)), // x1.6 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'technician',
      level: 10,
    },
  },
  
  golemBoost: {
    baseCost: D(7000000),
    costGrowth: 2.3,
    effectFormula: (level: number) => D(Math.pow(1.7, level)), // x1.7 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'golem',
      level: 10,
    },
  },
  
  sentinelBoost: {
    baseCost: D(200000000),
    costGrowth: 2.4,
    effectFormula: (level: number) => D(Math.pow(1.8, level)), // x1.8 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'sentinel',
      level: 10,
    },
  },
  
  ascendantBoost: {
    baseCost: D(4000000000),
    costGrowth: 2.5,
    effectFormula: (level: number) => D(Math.pow(1.9, level)), // x1.9 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'ascendant',
      level: 10,
    },
  },
  
  deityBoost: {
    baseCost: D(100000000000),
    costGrowth: 2.6,
    effectFormula: (level: number) => D(Math.pow(2.0, level)), // x2.0 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'deity',
      level: 10,
    },
  },
  
  omniscientBoost: {
    baseCost: D(3000000000000),
    costGrowth: 2.7,
    effectFormula: (level: number) => D(Math.pow(2.1, level)), // x2.1 за уровень
    effectType: 'multiplicative',
    effectTarget: 'worker',
    unlockRequirement: {
      type: 'worker',
      targetId: 'omniscient',
      level: 10,
    },
  },
  
  // ============================================
  // ГЛОБАЛЬНЫЕ МНОЖИТЕЛИ (6 апгрейдов)
  // Мощные апгрейды для эндгейма
  // ============================================
  
  globalProductionMultiplier: {
    baseCost: D(2000),
    costGrowth: 2.0,
    effectFormula: (level: number) => D(Math.pow(1.2, level)), // x1.2 за уровень
    effectType: 'multiplicative',
    effectTarget: 'production',
    unlockRequirement: {
      type: 'worker',
      targetId: 'miner',
      level: 10,
    },
  },
  
  crystallineEfficiency: {
    baseCost: D(15000),
    costGrowth: 2.4,
    effectFormula: (level: number) => D(Math.pow(1.05, level)), // +5% к эффективности воркеров
    effectType: 'multiplicative',
    effectTarget: 'production',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'globalProductionMultiplier',
      level: 5,
    },
  },
  
  conversionRitual: {
    baseCost: D(50000),
    costGrowth: 2.8,
    effectFormula: (level: number) => D(Math.pow(1.15, level)), // x1.15 за каждую транзакцию
    effectType: 'multiplicative',
    effectTarget: 'production',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'crystallineEfficiency',
      level: 5,
    },
  },
  
  eternityLoop: {
    baseCost: D(200000),
    costGrowth: 3.2,
    effectFormula: (level: number) => D(Math.pow(1.05, level)), // x1.05 за каждый купленный апгрейд
    effectType: 'multiplicative',
    effectTarget: 'production',
    maxLevel: 50, // x12.8 максимум при 50 уровнях
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'conversionRitual',
      level: 5,
    },
  },
  
  presenceAmplifier: {
    baseCost: D(500000),
    costGrowth: 3.5,
    effectFormula: (level: number) => D(Math.pow(1.1, level)), // x1.1 за каждого купленного воркера
    effectType: 'multiplicative',
    effectTarget: 'production',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'eternityLoop',
      level: 10,
    },
  },
  
  ascensionMark: {
    baseCost: D(1000000),
    costGrowth: 4.0,
    effectFormula: (level: number) => D(Math.pow(2, level)), // x2 за каждый престиж
    effectType: 'multiplicative',
    effectTarget: 'production',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'presenceAmplifier',
      level: 10,
    },
  },
  
  // ============================================
  // КАТЕГОРИЯ: OFFLINE & IDLE SYSTEM (5 апгрейдов)
  // Система оффлайн прогресса и idle механик
  // ============================================
  
  offlineProgress: {
    baseCost: D(5000),
    costGrowth: 2.0,
    effectFormula: (level: number) => D(0.35 + level * 0.025), // 35% → 60% (max 10 уровней = 60%)
    effectType: 'multiplicative',
    effectTarget: 'production',
    maxLevel: 10, // Максимум 60% оффлайн прогресса
    unlockRequirement: {
      type: 'crystals',
      amount: D(50000),
    },
  },
  
  autoClicker: {
    baseCost: D(8000),
    costGrowth: 2.2,
    effectFormula: (level: number) => D(level), // +1 клик/сек за уровень
    effectType: 'additive',
    effectTarget: 'click',
    maxLevel: 20, // Максимум 20 кликов/сек
    unlockRequirement: {
      type: 'crystals',
      amount: D(100000),
    },
  },
  
  idleBoost: {
    baseCost: D(30000),
    costGrowth: 2.5,
    effectFormula: (level: number) => {
      // +10% за час idle за уровень, но макс x5
      const multiplierPerHour = 1.1
      const hours = level
      const maxMultiplier = 5
      return D(Math.min(Math.pow(multiplierPerHour, hours), maxMultiplier))
    },
    effectType: 'multiplicative',
    effectTarget: 'production',
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'offlineProgress',
      level: 5,
    },
  },
  
  passiveCrystals: {
    baseCost: D(100000),
    costGrowth: 3.0,
    effectFormula: (level: number) => D(level), // +1 кристалл/сек за уровень
    effectType: 'additive',
    effectTarget: 'production',
    maxLevel: 20, // Максимум 20 кристаллов/сек
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'idleBoost',
      level: 10,
    },
  },
  
  dreamWeaver: {
    baseCost: D(500000),
    costGrowth: 3.5,
    effectFormula: (level: number) => {
      // x1.15 за каждый час idle, но не больше x3
      const multiplierPerHour = 1.15
      const maxMultiplier = 3
      return D(Math.min(Math.pow(multiplierPerHour, level), maxMultiplier))
    },
    effectType: 'multiplicative',
    effectTarget: 'production',
    maxLevel: 10, // Уровень 10 даёт макс x3
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'passiveCrystals',
      level: 10,
    },
  },
  
  // ============================================
  // КАТЕГОРИЯ: SYNERGY (3 апгрейда)
  // Синергии между системами
  // ============================================
  
  workerDevotion: {
    baseCost: D(2000000), // 2M
    costGrowth: 3.8,
    effectFormula: (level: number) => {
      // Worker boosts теперь дают +x0.1 за каждый уровень
      // Это добавочный эффект, который применяется в gameStore
      // при подсчете множителей воркеров
      return D(0.1 * level) // +0.1 за уровень
    },
    effectType: 'additive',
    effectTarget: 'worker', // Специальная синергия для worker boost апгрейдов
    unlockRequirement: {
      type: 'category_upgrades',
      // Требуем 8+ worker boost upgrades куплено
      upgradeIds: [
        'minerBoost',
        'crafterBoost',
        'alchemistBoost',
        'engineerBoost',
        'technicianBoost',
        'golemBoost',
        'sentinelBoost',
        'ascendantBoost',
      ],
      // Минимум по 1 уровню в каждом (всего 8 апгрейдов куплено)
      minLevels: [1, 1, 1, 1, 1, 1, 1, 1],
    },
  },
  
  clickResonance: {
    baseCost: D(4000000), // 4M
    costGrowth: 4.2,
    effectFormula: (level: number) => {
      // Все click upgrades дают +50% эффективности друг другу
      // x1.5 за уровень
      return D(Math.pow(1.5, level))
    },
    effectType: 'multiplicative',
    effectTarget: 'click',
    unlockRequirement: {
      type: 'category_upgrades',
      // Требуем определенные апгрейды клика
      upgradeIds: ['clickPower', 'clickMultiplier'],
      minLevels: [20, 15], // clickPower L20, clickMultiplier L15
    },
  },
  
  thematicPulse: {
    baseCost: D(10000000), // 10M
    costGrowth: 4.8,
    effectFormula: (level: number) => {
      // Каждая категория апгрейда усиливает остальные на x1.01 за купленный апгрейд
      // Уровень 1: x1.01 ко всем апгрейдам за каждый купленный апгрейд
      // Эффект будет применяться динамически в gameStore
      return D(Math.pow(1.01, level)) // x1.01^level за каждый апгрейд
    },
    effectType: 'multiplicative',
    effectTarget: 'global',
    unlockRequirement: {
      type: 'category_upgrades',
      // Требуем обе синергии выше
      upgradeIds: ['workerDevotion', 'clickResonance'],
      minLevels: [1, 1], // Хотя бы по 1 уровню в каждой
    },
  },
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
