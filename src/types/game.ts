import { Decimal } from '../utils/bigNumber'

/**
 * Версия сохранения для миграций
 */
export const SAVE_VERSION = 2

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

