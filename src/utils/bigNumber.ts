import Decimal from 'break_infinity.js'

/**
 * Wrapper для работы с большими числами через break_infinity.js
 * Предоставляет унифицированный API для всех операций с числами в игре
 */

// Re-export Decimal для использования в приложении
export { Decimal }

/**
 * Создает Decimal из различных входных данных
 */
export function D(value: string | number | Decimal): Decimal {
  return new Decimal(value)
}

/**
 * Константы для часто используемых значений
 */
export const getDecimalZero = () => new Decimal(0)
export const getDecimalOne = () => new Decimal(1)
export const getDecimalTen = () => new Decimal(10)
export const getDecimalHundred = () => new Decimal(100)
export const getDecimalThousand = () => new Decimal(1000)

// Для обратной совместимости
export const DECIMAL_ZERO = new Decimal(0)
export const DECIMAL_ONE = new Decimal(1)
export const DECIMAL_TEN = new Decimal(10)
export const DECIMAL_HUNDRED = new Decimal(100)
export const DECIMAL_THOUSAND = new Decimal(1000)

/**
 * Проверяет, достаточно ли средств для покупки
 */
export function canAfford(current: Decimal, cost: Decimal): boolean {
  return current.gte(cost)
}

/**
 * Вычисляет стоимость апгрейда с экспоненциальным ростом
 * cost = baseCost * (growth ^ level)
 */
export function calculateUpgradeCost(
  baseCost: Decimal,
  growth: number,
  level: number
): Decimal {
  return baseCost.mul(Decimal.pow(growth, level))
}

/**
 * Вычисляет стоимость нескольких уровней апгрейда
 * Использует формулу геометрической прогрессии: cost * (growth^count - 1) / (growth - 1)
 */
export function calculateBulkUpgradeCost(
  baseCost: Decimal,
  growth: number,
  currentLevel: number,
  count: number
): Decimal {
  if (count === 0) return D(0)
  if (count === 1) return calculateUpgradeCost(baseCost, growth, currentLevel)
  
  const currentCost = calculateUpgradeCost(baseCost, growth, currentLevel)
  const multiplier = Decimal.pow(growth, count).sub(1).div(growth - 1)
  
  return currentCost.mul(multiplier)
}

/**
 * Вычисляет максимальное количество уровней, которое можно купить
 */
export function calculateMaxAffordable(
  current: Decimal,
  baseCost: Decimal,
  growth: number,
  currentLevel: number
): number {
  if (current.lt(calculateUpgradeCost(baseCost, growth, currentLevel))) {
    return 0
  }
  
  // Используем бинарный поиск для эффективного поиска максимума
  let low = 1
  let high = 10000 // Разумный верхний предел для одной покупки
  let result = 0
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const cost = calculateBulkUpgradeCost(baseCost, growth, currentLevel, mid)
    
    if (current.gte(cost)) {
      result = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  
  return result
}

/**
 * Линейная интерполяция между двумя значениями
 */
export function lerp(a: Decimal, b: Decimal, t: number): Decimal {
  return a.mul(1 - t).add(b.mul(t))
}

/**
 * Ограничивает значение между min и max
 */
export function clamp(value: Decimal, min: Decimal, max: Decimal): Decimal {
  if (value.lt(min)) return min
  if (value.gt(max)) return max
  return value
}

/**
 * Сериализация Decimal в строку для сохранения
 */
export function serializeDecimal(value: Decimal): string {
  return value.toString()
}

/**
 * Десериализация Decimal из строки
 */
export function deserializeDecimal(value: string | number): Decimal {
  if (typeof value === 'string' && value.includes('e+')) {
    // Handle scientific notation for very large numbers
    return new Decimal(value)
  }
  return new Decimal(value)
}

/**
 * Безопасная десериализация с fallback значением
 */
export function safeDeserializeDecimal(
  value: unknown,
  fallback: Decimal = DECIMAL_ZERO
): Decimal {
  try {
    if (value === null || value === undefined) return fallback
    if (typeof value === 'string' || typeof value === 'number') {
      // First check if the value can be parsed as a valid number
      const numValue = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(numValue) || !isFinite(numValue)) {
        return fallback
      }

      const decimal = new Decimal(value)
      // Additional check if the result is valid
      if (isValidDecimal(decimal)) {
        return decimal
      }
    }
    return fallback
  } catch {
    return fallback
  }
}

/**
 * Проверка на NaN или Infinity
 */
export function isValidDecimal(value: Decimal): boolean {
  const num = value.toNumber()
  return isFinite(num) && !isNaN(num)
}

/**
 * Операции с процентами
 */
export function percentOf(value: Decimal, percent: number): Decimal {
  return value.mul(percent).div(100)
}

export function addPercent(value: Decimal, percent: number): Decimal {
  return value.mul(1 + percent / 100)
}

/**
 * Возведение в степень с кэшированием для часто используемых значений
 */
const powCache = new Map<string, Decimal>()

export function cachedPow(base: number, exponent: number): Decimal {
  const key = `${base}^${exponent}`
  
  const cached = powCache.get(key)
  if (cached) {
    return cached
  }
  
  const result = Decimal.pow(base, exponent)
  
  // Ограничиваем размер кэша
  if (powCache.size > 1000) {
    const firstKey = powCache.keys().next().value
    if (firstKey) {
      powCache.delete(firstKey)
    }
  }
  
  powCache.set(key, result)
  return result
}

/**
 * Форматирование для debug целей
 */
export function debugDecimal(value: Decimal, label?: string): void {
  const prefix = label ? `[${label}] ` : ''
  console.log(
    `${prefix}Decimal: ${value.toString()} (mantissa: ${value.mantissa}, exponent: ${value.exponent})`
  )
}

