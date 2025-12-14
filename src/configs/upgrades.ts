import {
  type UpgradeConfig,
  UpgradeType,
  UpgradeCategory,
  type UpgradeEffect,
} from '../types/upgrades'
import { UPGRADES_ECONOMY } from './economy/balance'

/**
 * Все апгрейды в игре
 * 
 * ВАЖНО: Экономические параметры (цены, эффекты, рост) находятся в economy/balance.ts
 * Здесь только контент: названия, описания, иконки, типы, категории
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
    // Экономика из balance.ts
    baseCost: UPGRADES_ECONOMY.clickPower.baseCost,
    costGrowth: UPGRADES_ECONOMY.clickPower.costGrowth,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.clickPower.effectType,
      target: UPGRADES_ECONOMY.clickPower.effectTarget,
      value: UPGRADES_ECONOMY.clickPower.effectFormula(level),
    }),
  },
  
  clickMultiplier: {
    id: 'clickMultiplier',
    name: 'Множитель клика',
    description: 'Каждый уровень увеличивает силу клика на 25%',
    icon: '💪',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.ACTIVE,
    showBeforeUnlock: false,
    // Экономика из balance.ts
    baseCost: UPGRADES_ECONOMY.clickMultiplier.baseCost,
    costGrowth: UPGRADES_ECONOMY.clickMultiplier.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.clickMultiplier.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.clickMultiplier.effectType,
      target: UPGRADES_ECONOMY.clickMultiplier.effectTarget,
      value: UPGRADES_ECONOMY.clickMultiplier.effectFormula(level),
    }),
  },
  
  criticalClick: {
    id: 'criticalClick',
    name: 'Критический удар',
    description: 'Каждый уровень добавляет +5% шанс на двойной клик',
    icon: '💥',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.ACTIVE,
    showBeforeUnlock: false,
    // Экономика из balance.ts
    baseCost: UPGRADES_ECONOMY.criticalClick.baseCost,
    costGrowth: UPGRADES_ECONOMY.criticalClick.costGrowth,
    maxLevel: UPGRADES_ECONOMY.criticalClick.maxLevel,
    unlockRequirement: UPGRADES_ECONOMY.criticalClick.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.criticalClick.effectType,
      target: UPGRADES_ECONOMY.criticalClick.effectTarget,
      value: UPGRADES_ECONOMY.criticalClick.effectFormula(level),
    }),
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
    showBeforeUnlock: true,
    // Экономика из balance.ts
    baseCost: UPGRADES_ECONOMY.autoClicker.baseCost,
    costGrowth: UPGRADES_ECONOMY.autoClicker.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.autoClicker.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.autoClicker.effectType,
      target: UPGRADES_ECONOMY.autoClicker.effectTarget,
      value: UPGRADES_ECONOMY.autoClicker.effectFormula(level),
    }),
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
    showBeforeUnlock: true,
    // Экономика из balance.ts
    baseCost: UPGRADES_ECONOMY.globalProduction.baseCost,
    costGrowth: UPGRADES_ECONOMY.globalProduction.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.globalProduction.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.globalProduction.effectType,
      target: UPGRADES_ECONOMY.globalProduction.effectTarget,
      value: UPGRADES_ECONOMY.globalProduction.effectFormula(level),
    }),
  },
  
  workerEfficiency: {
    id: 'workerEfficiency',
    name: 'Эффективность работы',
    description: 'Каждый уровень увеличивает CPS на 50%',
    icon: '⚙️',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.PASSIVE,
    showBeforeUnlock: false,
    // Экономика из balance.ts
    baseCost: UPGRADES_ECONOMY.workerEfficiency.baseCost,
    costGrowth: UPGRADES_ECONOMY.workerEfficiency.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.workerEfficiency.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.workerEfficiency.effectType,
      target: UPGRADES_ECONOMY.workerEfficiency.effectTarget,
      value: UPGRADES_ECONOMY.workerEfficiency.effectFormula(level),
    }),
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
    showBeforeUnlock: true,
    // Экономика из balance.ts
    baseCost: UPGRADES_ECONOMY.luckyBonus.baseCost,
    costGrowth: UPGRADES_ECONOMY.luckyBonus.costGrowth,
    maxLevel: UPGRADES_ECONOMY.luckyBonus.maxLevel,
    unlockRequirement: UPGRADES_ECONOMY.luckyBonus.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.luckyBonus.effectType,
      target: UPGRADES_ECONOMY.luckyBonus.effectTarget,
      value: UPGRADES_ECONOMY.luckyBonus.effectFormula(level),
    }),
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

