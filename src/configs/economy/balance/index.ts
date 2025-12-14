/**
 * ============================================
 * ЭКОНОМИЧЕСКИЙ БАЛАНС ИГРЫ
 * ============================================
 * 
 * Этот модуль содержит ВСЕ экономические параметры игры:
 * - Базовые цены и стоимости
 * - Множители роста
 * - Формулы прогрессии
 * - Балансовые константы
 * 
 * Разделение по файлам позволяет:
 * 1. Анализировать баланс отдельно от контента
 * 2. Быстро находить и менять числовые параметры
 * 3. Экспортировать в Excel/JSON для анализа
 * 4. A/B тестировать разные балансы
 * 
 * Структура директории balance/:
 * - workers.ts - экономика воркеров (стоимость, CPS, рост)
 * - upgrades.ts - экономика апгрейдов (стоимость, эффекты, формулы)
 * - prestige.ts - экономика престижа (награды, множители)
 * - constants.ts - общие балансовые константы
 * - analysis.ts - функции для анализа экономики
 * - index.ts - главный экспорт (этот файл)
 */

// Воркеры
export {
  type WorkerEconomy,
  WORKERS_ECONOMY,
  calculateWorkerCostToLevel,
  calculateWorkerTotalCps,
} from './workers'

// Апгрейды
export {
  type UpgradeEconomy,
  UPGRADES_ECONOMY,
  calculateUpgradeCostToLevel,
  getUpgradeEffectAtLevel,
} from './upgrades'

// Престиж
export {
  type PrestigeEconomy,
  type PrestigeUpgradeEconomy,
  PRESTIGE_ECONOMY,
  PRESTIGE_UPGRADES_ECONOMY,
} from './prestige'

// Константы
export { GAME_BALANCE } from './constants'

// Анализ
export { exportBalanceForAnalysis } from './analysis'
