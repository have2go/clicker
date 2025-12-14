import { D } from '../../../utils/bigNumber'
import type { Decimal } from '../../../utils/bigNumber'

/**
 * ============================================
 * ВОРКЕРЫ - ЭКОНОМИКА
 * ============================================
 */

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
  miner: {
    baseCost: D(25),
    costGrowth: 1.15,
    baseCps: D(0.15),
  },
  
  crafter: {
    baseCost: D(200),
    costGrowth: 1.17,
    baseCps: D(1.2),
    unlockRequirement: {
      type: 'worker',
      targetId: 'miner',
      level: 5,
    },
  },
  
  alchemist: {
    baseCost: D(2500),
    costGrowth: 1.18,
    baseCps: D(12),
    unlockRequirement: {
      type: 'worker',
      targetId: 'crafter',
      level: 5,
    },
  },
  
  engineer: {
    baseCost: D(30000),
    costGrowth: 1.20,
    baseCps: D(150),
    unlockRequirement: {
      type: 'worker',
      targetId: 'alchemist',
      level: 5,
    },
  },
  
  technician: {
    baseCost: D(400000),
    costGrowth: 1.22,
    baseCps: D(2000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'engineer',
      level: 5,
    },
  },
  
  golem: {
    baseCost: D(5000000),
    costGrowth: 1.25,
    baseCps: D(30000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'technician',
      level: 5,
    },
  },
  
  sentinel: {
    baseCost: D(75000000),
    costGrowth: 1.30,
    baseCps: D(500000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'golem',
      level: 5,
    },
  },
  
  ascendant: {
    baseCost: D(1000000000),
    costGrowth: 1.35,
    baseCps: D(8000000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'sentinel',
      level: 5,
    },
  },
  
  deity: {
    baseCost: D(15000000000),
    costGrowth: 1.40,
    baseCps: D(150000000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'ascendant',
      level: 5,
    },
  },
  
  omniscient: {
    baseCost: D(250000000000),
    costGrowth: 1.50,
    baseCps: D(3000000000),
    unlockRequirement: {
      type: 'worker',
      targetId: 'deity',
      level: 5,
    },
  },
}

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
