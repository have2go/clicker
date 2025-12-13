import { Decimal } from '../utils/bigNumber'

/**
 * Требования для разблокировки воркера
 */
export interface WorkerUnlockRequirement {
  type: 'crystals' | 'worker' | 'upgrade' | 'prestige'
  targetId?: string
  amount?: Decimal
  level?: number
}

/**
 * Конфигурация типа воркера
 */
export interface WorkerConfig {
  id: string
  name: string
  description: string
  icon: string
  
  /**
   * Базовое производство в секунду (CPS)
   */
  baseCps: Decimal
  
  /**
   * Базовая стоимость первого воркера
   */
  baseCost: Decimal
  
  /**
   * Коэффициент роста стоимости
   * newCost = currentCost * costGrowth
   */
  costGrowth: number
  
  /**
   * Требования для разблокировки
   */
  unlockRequirement?: WorkerUnlockRequirement
  
  /**
   * Показывать ли воркера до разблокировки
   */
  showBeforeUnlock?: boolean
  
  /**
   * Цвет для UI (опционально)
   */
  color?: string
  
  /**
   * Порядковый номер для сортировки в UI
   */
  order: number
}

/**
 * Состояние воркера в игре
 */
export interface WorkerState {
  id: string
  count: number
  unlocked: boolean
}

/**
 * Проверка требования разблокировки воркера
 */
export function checkWorkerUnlockRequirement(
  requirement: WorkerUnlockRequirement | undefined,
  gameState: {
    crystals: Decimal
    workers: Map<string, number>
    upgrades: Map<string, number>
    prestigeLevel: number
  }
): boolean {
  if (!requirement) return true
  
  switch (requirement.type) {
    case 'crystals':
      return requirement.amount 
        ? gameState.crystals.gte(requirement.amount)
        : true
        
    case 'worker':
      if (!requirement.targetId) return false
      const workerCount = gameState.workers.get(requirement.targetId) || 0
      return requirement.level ? workerCount >= requirement.level : workerCount > 0
      
    case 'upgrade':
      if (!requirement.targetId) return false
      const upgradeLevel = gameState.upgrades.get(requirement.targetId) || 0
      return requirement.level ? upgradeLevel >= requirement.level : upgradeLevel > 0
      
    case 'prestige':
      return requirement.level 
        ? gameState.prestigeLevel >= requirement.level
        : gameState.prestigeLevel > 0
        
    default:
      return false
  }
}

/**
 * Вычисляет стоимость следующего воркера
 */
export function calculateWorkerCost(
  config: WorkerConfig,
  currentCount: number
): Decimal {
  return config.baseCost.mul(Math.pow(config.costGrowth, currentCount))
}

/**
 * Вычисляет общее CPS от воркеров определенного типа
 */
export function calculateWorkerCps(
  config: WorkerConfig,
  count: number,
  globalMultiplier: Decimal = new Decimal(1)
): Decimal {
  return config.baseCps.mul(count).mul(globalMultiplier)
}

