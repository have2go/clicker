import { WORKERS_ECONOMY } from './workers'
import { UPGRADES_ECONOMY } from './upgrades'
import { PRESTIGE_ECONOMY } from './prestige'

/**
 * ============================================
 * АНАЛИЗ ПРОГРЕССИИ
 * ============================================
 * 
 * Вспомогательные функции для анализа экономики
 */

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
