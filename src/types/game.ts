import { Decimal } from '../utils/bigNumber'

/**
 * Версия сохранения для миграций
 * v3: Обновлены ID и баланс воркеров
 * v4: Переработана экономика кликов, добавлены новые апгрейды
 */
export const SAVE_VERSION = 4

/**
 * Состояние игры (новая версия с Decimal)
 */
export interface GameState {
  version: number
  crystals: Decimal
  totalCrystalsEarned: Decimal // Для расчёта престижа
  
  // Воркеры - теперь Map с разными типами
  workers: Map<string, number>
  
  // Апгрейды - Map с уровнями
  upgrades: Map<string, number>
  
  // Статистика
  totalClicks: number
  
  // Время
  lastUpdate: number
}

/**
 * Старая версия состояния (для миграции)
 */
export interface LegacyGameState {
  crystals: number
  workers: number
  workerCost: number
  cps: number
  clickUpgradeLevel: number
  lastUpdate: number
}

