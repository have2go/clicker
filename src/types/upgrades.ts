import { Decimal } from '../utils/bigNumber'

/**
 * Типы апгрейдов
 */
export const UpgradeType = {
  CLICK: 'click',              // Увеличивает силу клика
  MULTIPLIER: 'multiplier',    // Множитель производства
  AUTOCLICKER: 'autoclicker',  // Автоматические клики
  SPECIAL: 'special',          // Специальные эффекты
} as const

export type UpgradeType = typeof UpgradeType[keyof typeof UpgradeType]

/**
 * Категории апгрейдов (для группировки в UI)
 */
export const UpgradeCategory = {
  ACTIVE: 'active',     // Активные апгрейды (клики)
  PASSIVE: 'passive',   // Пассивные апгрейды (производство)
  UTILITY: 'utility',   // Утилиты (автоматизация)
  SPECIAL: 'special',   // Специальные
} as const

export type UpgradeCategory = typeof UpgradeCategory[keyof typeof UpgradeCategory]

/**
 * Требования для разблокировки
 */
export interface UnlockRequirement {
  type: 'crystals' | 'worker' | 'upgrade' | 'prestige'
  targetId?: string
  amount?: Decimal
  level?: number
}

/**
 * Эффект апгрейда
 */
export interface UpgradeEffect {
  type: 'additive' | 'multiplicative'
  target: 'click' | 'production' | 'worker' | 'global'
  value: Decimal
  workerId?: string // Для специфичных воркеров
}

/**
 * Конфигурация апгрейда
 */
export interface UpgradeConfig {
  id: string
  name: string
  description: string
  icon: string
  type: UpgradeType
  category: UpgradeCategory
  baseCost: Decimal
  costGrowth: number
  
  /**
   * Функция вычисления эффекта на уровне level
   */
  effect: (level: number) => UpgradeEffect
  
  /**
   * Максимальный уровень (undefined = бесконечно)
   */
  maxLevel?: number
  
  /**
   * Требования для разблокировки
   */
  unlockRequirement?: UnlockRequirement
  
  /**
   * Показывать ли апгрейд до разблокировки
   */
  showBeforeUnlock?: boolean
}

/**
 * Состояние апгрейда в игре
 */
export interface UpgradeState {
  id: string
  level: number
  unlocked: boolean
}

/**
 * Получить текст описания эффекта
 */
export function getEffectDescription(effect: UpgradeEffect): string {
  const { type, target, value, workerId } = effect
  
  const targetName = 
    target === 'click' ? 'клик' :
    target === 'production' ? 'производство' :
    target === 'worker' ? (workerId || 'воркер') :
    'всё'
  
  if (type === 'additive') {
    return `+${value.toString()} к ${targetName}`
  } else {
    return `x${value.toString()} к ${targetName}`
  }
}

/**
 * Проверка требования разблокировки
 */
export function checkUnlockRequirement(
  requirement: UnlockRequirement | undefined,
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

