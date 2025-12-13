import { Decimal } from '../utils/bigNumber'

/**
 * Состояние престижа
 */
export interface PrestigeState {
  level: number // Количество раз престижа
  currency: Decimal // Кристаллы престижа (или другая валюта)
  totalPrestigeCurrency: Decimal // Всего заработано за всё время
  lastPrestigeTime: number
}

/**
 * Конфигурация престижа
 */
export interface PrestigeConfig {
  // Минимальное количество кристаллов для первого престижа
  minCrystalsForPrestige: Decimal
  
  // Формула расчёта награды
  calculateReward: (totalCrystals: Decimal) => Decimal
  
  // Множитель от престиж-валюты
  getGlobalMultiplier: (currency: Decimal) => Decimal
}

/**
 * Апгрейд за престиж-валюту
 */
export interface PrestigeUpgrade {
  id: string
  name: string
  description: string
  icon: string
  cost: Decimal
  maxLevel?: number
  effect: (level: number) => {
    type: 'multiplier' | 'special'
    value: Decimal
    target?: string
  }
}

