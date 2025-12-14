import type { PrestigeConfig, PrestigeUpgrade } from '../types/prestige'
import { 
  PRESTIGE_ECONOMY, 
  PRESTIGE_UPGRADES_ECONOMY 
} from './economy/balance'

/**
 * Конфигурация системы престижа
 * 
 * ВАЖНО: Экономические параметры (формулы, стоимости) находятся в economy/balance.ts
 * Здесь только структура и контент
 */
export const PRESTIGE_CONFIG: PrestigeConfig = {
  // Экономика из balance.ts
  minCrystalsForPrestige: PRESTIGE_ECONOMY.minCrystalsRequired,
  calculateReward: PRESTIGE_ECONOMY.rewardFormula,
  getGlobalMultiplier: PRESTIGE_ECONOMY.currencyMultiplierFormula,
}

/**
 * Престиж-апгрейды (покупаются за престиж-валюту)
 */
export const PRESTIGE_UPGRADES: Record<string, PrestigeUpgrade> = {
  productionBoost: {
    id: 'productionBoost',
    name: 'Усиление производства',
    description: 'Каждый уровень увеличивает производство на 25%',
    icon: '⚡',
    // Экономика из balance.ts
    cost: PRESTIGE_UPGRADES_ECONOMY.productionBoost.cost,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.productionBoost.effectFormula(level),
      target: 'production',
    }),
  },
  
  clickBoost: {
    id: 'clickBoost',
    name: 'Усиление кликов',
    description: 'Каждый уровень увеличивает силу клика на 50%',
    icon: '💪',
    // Экономика из balance.ts
    cost: PRESTIGE_UPGRADES_ECONOMY.clickBoost.cost,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.clickBoost.effectFormula(level),
      target: 'click',
    }),
  },
  
  workerEfficiency: {
    id: 'workerEfficiency',
    name: 'Эффективность воркеров',
    description: 'Каждый уровень увеличивает производство всех воркеров на 100%',
    icon: '👷',
    // Экономика из balance.ts
    cost: PRESTIGE_UPGRADES_ECONOMY.workerEfficiency.cost,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.workerEfficiency.effectFormula(level),
      target: 'production',
    }),
  },
  
  autoProgress: {
    id: 'autoProgress',
    name: 'Автопрогресс',
    description: 'Начинаете с 10 базовых рабочих после престижа',
    icon: '🚀',
    // Экономика из balance.ts
    cost: PRESTIGE_UPGRADES_ECONOMY.autoProgress.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.autoProgress.maxLevel,
    effect: (level: number) => ({
      type: 'special',
      value: PRESTIGE_UPGRADES_ECONOMY.autoProgress.effectFormula(level),
    }),
  },
  
  cheaperUpgrades: {
    id: 'cheaperUpgrades',
    name: 'Дешевле апгрейды',
    description: 'Каждый уровень уменьшает стоимость апгрейдов на 5%',
    icon: '💰',
    // Экономика из balance.ts
    cost: PRESTIGE_UPGRADES_ECONOMY.cheaperUpgrades.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.cheaperUpgrades.maxLevel,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.cheaperUpgrades.effectFormula(level),
      target: 'upgradeCost',
    }),
  },
}

/**
 * Получить престиж-апгрейд по ID
 */
export function getPrestigeUpgrade(id: string): PrestigeUpgrade | undefined {
  return PRESTIGE_UPGRADES[id]
}

/**
 * Получить все престиж-апгрейды
 */
export function getAllPrestigeUpgrades(): PrestigeUpgrade[] {
  return Object.values(PRESTIGE_UPGRADES)
}

