import { Decimal } from '../utils/bigNumber'

/**
 * Типы множителей
 */
export const MultiplierType = {
  GLOBAL: 'global',           // Глобальный множитель (влияет на всё)
  CLICK: 'click',             // Множитель кликов
  PRODUCTION: 'production',   // Множитель производства (CPS)
  WORKER: 'worker',           // Множитель конкретного типа воркера
} as const

export type MultiplierType = typeof MultiplierType[keyof typeof MultiplierType]

/**
 * Источник множителя
 */
export const MultiplierSource = {
  UPGRADE: 'upgrade',         // От апгрейдов
  PRESTIGE: 'prestige',       // От престижа
  ACHIEVEMENT: 'achievement', // От достижений
  TEMPORARY: 'temporary',     // Временный бонус
} as const

export type MultiplierSource = typeof MultiplierSource[keyof typeof MultiplierSource]

/**
 * Один множитель
 */
export interface Multiplier {
  id: string
  type: MultiplierType
  source: MultiplierSource
  value: Decimal
  workerId?: string // Для worker типа - ID конкретного воркера
  description?: string
}

/**
 * Композиция всех множителей для одной цели
 */
export interface MultiplierComposite {
  base: Decimal
  multipliers: Multiplier[]
  total: Decimal
}

/**
 * Вычисляет итоговый множитель из массива множителей
 * Все множители перемножаются
 */
export function calculateTotalMultiplier(multipliers: Multiplier[]): Decimal {
  return multipliers.reduce(
    (total, mult) => total.mul(mult.value),
    new Decimal(1)
  )
}

/**
 * Применяет множители к базовому значению
 */
export function applyMultipliers(
  baseValue: Decimal,
  multipliers: Multiplier[]
): Decimal {
  const totalMultiplier = calculateTotalMultiplier(multipliers)
  return baseValue.mul(totalMultiplier)
}

/**
 * Фильтрует множители по типу
 */
export function filterMultipliersByType(
  multipliers: Multiplier[],
  type: MultiplierType
): Multiplier[] {
  return multipliers.filter(m => m.type === type)
}

/**
 * Фильтрует множители по источнику
 */
export function filterMultipliersBySource(
  multipliers: Multiplier[],
  source: MultiplierSource
): Multiplier[] {
  return multipliers.filter(m => m.source === source)
}

/**
 * Получает множители для конкретного воркера
 * Включает глобальные и специфичные для воркера множители
 */
export function getWorkerMultipliers(
  allMultipliers: Multiplier[],
  workerId: string
): Multiplier[] {
  return allMultipliers.filter(
    m => m.type === MultiplierType.GLOBAL ||
         m.type === MultiplierType.PRODUCTION ||
         (m.type === MultiplierType.WORKER && m.workerId === workerId)
  )
}

/**
 * Получает множители для кликов
 * Включает глобальные и специфичные для кликов множители
 */
export function getClickMultipliers(allMultipliers: Multiplier[]): Multiplier[] {
  return allMultipliers.filter(
    m => m.type === MultiplierType.GLOBAL ||
         m.type === MultiplierType.CLICK
  )
}

/**
 * Создаёт композитный объект с информацией о множителях
 */
export function createMultiplierComposite(
  baseValue: Decimal,
  multipliers: Multiplier[]
): MultiplierComposite {
  const total = calculateTotalMultiplier(multipliers)
  
  return {
    base: baseValue,
    multipliers,
    total,
  }
}

/**
 * Форматирует множитель для отображения
 */
export function formatMultiplierDisplay(multiplier: Multiplier): string {
  const value = multiplier.value.toNumber()
  const formatted = value >= 2 ? `x${value.toFixed(2)}` : `+${((value - 1) * 100).toFixed(0)}%`
  
  if (multiplier.description) {
    return `${multiplier.description}: ${formatted}`
  }
  
  return formatted
}

