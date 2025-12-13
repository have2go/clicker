import { D } from '../utils/bigNumber'
import type { Decimal } from '../utils/bigNumber'
import type { PrestigeConfig, PrestigeUpgrade } from '../types/prestige'

/**
 * Конфигурация системы престижа
 */
export const PRESTIGE_CONFIG: PrestigeConfig = {
  // Требуется 1 миллион кристаллов для первого престижа
  minCrystalsForPrestige: D(1e6),
  
  // Формула: sqrt(totalCrystals / 1e6)
  // Примеры:
  // - 1M кристаллов = 1 престиж-кристалл
  // - 4M кристаллов = 2 престиж-кристалла
  // - 9M кристаллов = 3 престиж-кристалла
  // - 100M кристаллов = 10 престиж-кристаллов
  calculateReward: (totalCrystals: Decimal): Decimal => {
    if (totalCrystals.lt(1e6)) return D(0)
    return totalCrystals.div(1e6).sqrt().floor()
  },
  
  // Множитель: 1 + (currency * 0.1)
  // Каждый престиж-кристалл даёт +10% ко всему
  getGlobalMultiplier: (currency: Decimal): Decimal => {
    return D(1).add(currency.mul(0.1))
  },
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
    cost: D(5),
    effect: (level: number) => ({
      type: 'multiplier',
      value: D(Math.pow(1.25, level)),
      target: 'production',
    }),
  },
  
  clickBoost: {
    id: 'clickBoost',
    name: 'Усиление кликов',
    description: 'Каждый уровень увеличивает силу клика на 50%',
    icon: '💪',
    cost: D(5),
    effect: (level: number) => ({
      type: 'multiplier',
      value: D(Math.pow(1.5, level)),
      target: 'click',
    }),
  },
  
  workerEfficiency: {
    id: 'workerEfficiency',
    name: 'Эффективность воркеров',
    description: 'Каждый уровень увеличивает производство всех воркеров на 100%',
    icon: '👷',
    cost: D(10),
    effect: (level: number) => ({
      type: 'multiplier',
      value: D(Math.pow(2, level)),
      target: 'production',
    }),
  },
  
  autoProgress: {
    id: 'autoProgress',
    name: 'Автопрогресс',
    description: 'Начинаете с 10 базовых рабочих после престижа',
    icon: '🚀',
    cost: D(20),
    maxLevel: 1,
    effect: (level: number) => ({
      type: 'special',
      value: D(level),
    }),
  },
  
  cheaperUpgrades: {
    id: 'cheaperUpgrades',
    name: 'Дешевле апгрейды',
    description: 'Каждый уровень уменьшает стоимость апгрейдов на 5%',
    icon: '💰',
    cost: D(15),
    maxLevel: 10,
    effect: (level: number) => ({
      type: 'multiplier',
      value: D(Math.pow(0.95, level)),
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

