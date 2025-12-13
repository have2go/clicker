import { D } from '../utils/bigNumber'
import {
  type UpgradeConfig,
  UpgradeType,
  UpgradeCategory,
  type UpgradeEffect,
} from '../types/upgrades'

/**
 * Все апгрейды в игре
 * Конфигурация позволяет легко добавлять новые апгрейды
 */

export const UPGRADES: Record<string, UpgradeConfig> = {
  // ============================================
  // АКТИВНЫЕ АПГРЕЙДЫ (Клики)
  // ============================================
  
  clickPower: {
    id: 'clickPower',
    name: 'Усиление клика',
    description: 'Каждый уровень добавляет +0.2 кристаллов за клик',
    icon: '⚡',
    type: UpgradeType.CLICK,
    category: UpgradeCategory.ACTIVE,
    baseCost: D(20),
    costGrowth: 1.6,
    effect: (level: number): UpgradeEffect => ({
      type: 'additive',
      target: 'click',
      value: D(level * 0.2),
    }),
  },
  
  clickMultiplier: {
    id: 'clickMultiplier',
    name: 'Множитель клика',
    description: 'Каждый уровень увеличивает силу клика на 25%',
    icon: '💪',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.ACTIVE,
    baseCost: D(500),
    costGrowth: 2.5,
    effect: (level: number): UpgradeEffect => ({
      type: 'multiplicative',
      target: 'click',
      value: D(Math.pow(1.25, level)),
    }),
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'clickPower',
      level: 5,
    },
    showBeforeUnlock: false,
  },
  
  criticalClick: {
    id: 'criticalClick',
    name: 'Критический удар',
    description: 'Каждый уровень добавляет +5% шанс на двойной клик',
    icon: '💥',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.ACTIVE,
    baseCost: D(5000),
    costGrowth: 3,
    effect: (level: number): UpgradeEffect => ({
      type: 'additive',
      target: 'click',
      value: D(level * 0.05), // Будет использоваться для шанса крита
    }),
    maxLevel: 20, // Максимум 100% шанс
    unlockRequirement: {
      type: 'upgrade',
      targetId: 'clickMultiplier',
      level: 3,
    },
    showBeforeUnlock: false,
  },
  
  // ============================================
  // АВТОМАТИЗАЦИЯ
  // ============================================
  
  autoClicker: {
    id: 'autoClicker',
    name: 'Автокликер',
    description: 'Каждый уровень добавляет +1 автоматический клик в секунду',
    icon: '🤖',
    type: UpgradeType.AUTOCLICKER,
    category: UpgradeCategory.UTILITY,
    baseCost: D(1000),
    costGrowth: 2,
    effect: (level: number): UpgradeEffect => ({
      type: 'additive',
      target: 'click',
      value: D(level), // кликов в секунду
    }),
    unlockRequirement: {
      type: 'crystals',
      amount: D(500),
    },
    showBeforeUnlock: true,
  },
  
  // ============================================
  // ПАССИВНЫЕ АПГРЕЙДЫ (Производство)
  // ============================================
  
  globalProduction: {
    id: 'globalProduction',
    name: 'Глобальное усиление',
    description: 'Каждый уровень увеличивает производство всех воркеров на 10%',
    icon: '🌟',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.PASSIVE,
    baseCost: D(2000),
    costGrowth: 2.2,
    effect: (level: number): UpgradeEffect => ({
      type: 'multiplicative',
      target: 'global',
      value: D(Math.pow(1.1, level)),
    }),
    unlockRequirement: {
      type: 'worker',
      targetId: 'basic',
      level: 10,
    },
    showBeforeUnlock: true,
  },
  
  workerEfficiency: {
    id: 'workerEfficiency',
    name: 'Эффективность работы',
    description: 'Каждый уровень увеличивает CPS на 50%',
    icon: '⚙️',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.PASSIVE,
    baseCost: D(10000),
    costGrowth: 2.8,
    effect: (level: number): UpgradeEffect => ({
      type: 'multiplicative',
      target: 'production',
      value: D(Math.pow(1.5, level)),
    }),
    unlockRequirement: {
      type: 'worker',
      targetId: 'engineer',
      level: 5,
    },
    showBeforeUnlock: false,
  },
  
  // ============================================
  // СПЕЦИАЛЬНЫЕ
  // ============================================
  
  luckyBonus: {
    id: 'luckyBonus',
    name: 'Удача',
    description: 'Каждый уровень даёт +2% ко всем источникам дохода',
    icon: '🍀',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.SPECIAL,
    baseCost: D(50000),
    costGrowth: 3.5,
    effect: (level: number): UpgradeEffect => ({
      type: 'multiplicative',
      target: 'global',
      value: D(Math.pow(1.02, level)),
    }),
    maxLevel: 50,
    unlockRequirement: {
      type: 'crystals',
      amount: D(25000),
    },
    showBeforeUnlock: true,
  },
}

/**
 * Получить список апгрейдов по категории
 */
export function getUpgradesByCategory(
  category: UpgradeCategory
): UpgradeConfig[] {
  return Object.values(UPGRADES).filter(u => u.category === category)
}

/**
 * Получить список апгрейдов по типу
 */
export function getUpgradesByType(type: UpgradeType): UpgradeConfig[] {
  return Object.values(UPGRADES).filter(u => u.type === type)
}

/**
 * Получить апгрейд по ID
 */
export function getUpgrade(id: string): UpgradeConfig | undefined {
  return UPGRADES[id]
}

/**
 * Получить все апгрейды
 */
export function getAllUpgrades(): UpgradeConfig[] {
  return Object.values(UPGRADES)
}

/**
 * Проверить, является ли апгрейд активным (связан с кликами)
 */
export function isActiveUpgrade(upgrade: UpgradeConfig): boolean {
  return upgrade.category === UpgradeCategory.ACTIVE
}

/**
 * Проверить, является ли апгрейд пассивным (связан с производством)
 */
export function isPassiveUpgrade(upgrade: UpgradeConfig): boolean {
  return upgrade.category === UpgradeCategory.PASSIVE
}

