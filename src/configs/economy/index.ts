/**
 * Экономический баланс игры
 * 
 * Этот модуль содержит ВСЕ числовые параметры игры,
 * отделённые от контента (названий, описаний, иконок).
 */

export {
  // Воркеры
  WORKERS_ECONOMY,
  type WorkerEconomy,
  calculateWorkerCostToLevel,
  calculateWorkerTotalCps,
  
  // Апгрейды
  UPGRADES_ECONOMY,
  type UpgradeEconomy,
  calculateUpgradeCostToLevel,
  getUpgradeEffectAtLevel,
  
  // Престиж
  PRESTIGE_ECONOMY,
  type PrestigeEconomy,
  PRESTIGE_UPGRADES_ECONOMY,
  type PrestigeUpgradeEconomy,
  
  // Константы
  GAME_BALANCE,
  
  // Анализ
  exportBalanceForAnalysis,
} from './balance/index'
