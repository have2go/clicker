import { Decimal } from './bigNumber'

/**
 * Суффиксы для больших чисел (до 1e33)
 * После этого переходим на научную нотацию
 */
const SUFFIXES = [
  { value: 1e3, suffix: 'K' },      // Thousand
  { value: 1e6, suffix: 'M' },      // Million
  { value: 1e9, suffix: 'B' },      // Billion
  { value: 1e12, suffix: 'T' },     // Trillion
  { value: 1e15, suffix: 'Qa' },    // Quadrillion
  { value: 1e18, suffix: 'Qi' },    // Quintillion
  { value: 1e21, suffix: 'Sx' },    // Sextillion
  { value: 1e24, suffix: 'Sp' },    // Septillion
  { value: 1e27, suffix: 'Oc' },    // Octillion
  { value: 1e30, suffix: 'No' },    // Nonillion
  { value: 1e33, suffix: 'Dc' },    // Decillion
]

/**
 * Опции форматирования чисел
 */
export interface FormatOptions {
  /**
   * Минимальное количество значащих цифр (по умолчанию 3)
   */
  minSignificantDigits?: number
  
  /**
   * Максимальное количество значащих цифр (по умолчанию 4)
   */
  maxSignificantDigits?: number
  
  /**
   * Использовать ли научную нотацию для больших чисел (по умолчанию true)
   */
  useScientific?: boolean
  
  /**
   * Порог для перехода на научную нотацию (по умолчанию 1e33)
   */
  scientificThreshold?: number
  
  /**
   * Показывать ли знак + для положительных чисел
   */
  showPlus?: boolean
  
  /**
   * Форматировать как целое число (без дробной части)
   */
  integer?: boolean
}

/**
 * Главная функция форматирования чисел
 * Использует смешанную нотацию:
 * - До 1000: обычные числа с запятыми
 * - 1000 - 1e33: суффиксы (K, M, B, T, ...)
 * - После 1e33: научная нотация (1.23e45)
 */
export function formatNumber(
  value: Decimal | number | string,
  options: FormatOptions = {}
): string {
  const {
    minSignificantDigits = 3,
    maxSignificantDigits = 4,
    useScientific = true,
    scientificThreshold = 1e33,
    showPlus = false,
    integer = false,
  } = options

  // Конвертируем в Decimal если это не Decimal
  const num = value instanceof Decimal ? value : new Decimal(value)

  // Обработка специальных случаев
  const numValue = num.toNumber()
  if (!isFinite(numValue)) return 'Infinity'
  if (isNaN(numValue)) return 'NaN'
  
  const isNegative = num.lt(0)
  const abs = num.abs()
  
  // Для очень маленьких чисел
  if (abs.lt(0.001) && abs.gt(0)) {
    return formatScientific(num, maxSignificantDigits)
  }

  // Для нуля
  if (abs.eq(0)) {
    return '0'
  }

  let result: string

  // Числа меньше 1000 - обычное форматирование
  if (abs.lt(1000)) {
    result = formatSmallNumber(abs, integer ? 0 : 2)
  }
  // Числа от 1000 до научного порога - суффиксная нотация
  else if (abs.lt(scientificThreshold)) {
    result = formatWithSuffix(abs, minSignificantDigits, maxSignificantDigits)
  }
  // Большие числа - научная нотация (если включена)
  else if (useScientific) {
    result = formatScientific(abs, maxSignificantDigits)
  }
  // Fallback на самый большой суффикс
  else {
    result = formatWithSuffix(abs, minSignificantDigits, maxSignificantDigits)
  }

  // Добавляем знак
  if (isNegative) {
    result = '-' + result
  } else if (showPlus && num.gt(0)) {
    result = '+' + result
  }

  return result
}

/**
 * Форматирование маленьких чисел (< 1000) с запятыми
 */
function formatSmallNumber(num: Decimal, decimals: number): string {
  const value = num.toNumber()
  
  if (decimals === 0) {
    return Math.floor(value).toLocaleString('en-US')
  }
  
  // Показываем decimals знаков после запятой
  const fixed = value.toFixed(decimals)
  const [intPart, decPart] = fixed.split('.')
  
  // Форматируем целую часть с запятыми
  const formattedInt = parseInt(intPart).toLocaleString('en-US')
  
  if (decPart && parseInt(decPart) > 0) {
    return `${formattedInt}.${decPart}`
  }
  
  return formattedInt
}

/**
 * Форматирование с суффиксами (K, M, B, T, ...)
 * Динамически выбирает количество знаков после запятой для лучшей читаемости
 */
function formatWithSuffix(
  num: Decimal,
  minDigits: number,
  maxDigits: number
): string {
  // Находим подходящий суффикс (берем последний, который меньше числа)
  let suffix = ''
  let divisor = 1
  
  for (let i = SUFFIXES.length - 1; i >= 0; i--) {
    if (num.gte(SUFFIXES[i].value)) {
      suffix = SUFFIXES[i].suffix
      divisor = SUFFIXES[i].value
      break
    }
  }
  
  // Делим число на делитель
  const divided = num.div(divisor)
  const value = divided.toNumber()
  
  // Определяем количество знаков после запятой
  // Для больших чисел (>=100) показываем меньше знаков
  let decimals: number
  if (value >= 100) {
    decimals = Math.max(0, maxDigits - 3) // 1-2 знака
  } else if (value >= 10) {
    decimals = Math.max(1, maxDigits - 2) // 2-3 знака
  } else {
    decimals = Math.max(2, maxDigits - 1) // 3-4 знака
  }
  
  // Форматируем число с нужным количеством знаков
  let formatted = value.toFixed(decimals)
  
  // Убираем лишние нули в конце
  formatted = formatted.replace(/\.?0+$/, '')
  
  // Убеждаемся что у нас минимум minDigits значащих цифр
  const significantDigits = formatted.replace('.', '').length
  if (significantDigits < minDigits) {
    const needed = minDigits - significantDigits
    if (!formatted.includes('.')) {
      formatted += '.'
    }
    formatted += '0'.repeat(needed)
  }
  
  return formatted + suffix
}

/**
 * Форматирование в научную нотацию (1.23e45)
 */
function formatScientific(num: Decimal, maxDigits: number): string {
  const exp = num.exponent
  const mantissa = num.mantissa
  
  // Форматируем мантиссу с нужным количеством знаков
  let formattedMantissa = mantissa.toFixed(maxDigits - 1)
  
  // Убираем лишние нули
  formattedMantissa = formattedMantissa.replace(/\.?0+$/, '')
  
  return `${formattedMantissa}e${exp}`
}

/**
 * Короткое форматирование (для UI где мало места)
 * Всегда использует минимум знаков
 */
export function formatNumberCompact(value: Decimal | number | string): string {
  return formatNumber(value, {
    minSignificantDigits: 2,
    maxSignificantDigits: 3,
  })
}

/**
 * Точное форматирование (для статистики и детальных панелей)
 * Использует больше знаков для точности
 */
export function formatNumberPrecise(value: Decimal | number | string): string {
  return formatNumber(value, {
    minSignificantDigits: 4,
    maxSignificantDigits: 6,
  })
}

/**
 * Форматирование целых чисел (без дробной части)
 */
export function formatNumberInteger(value: Decimal | number | string): string {
  return formatNumber(value, {
    integer: true,
    minSignificantDigits: 3,
    maxSignificantDigits: 4,
  })
}

/**
 * Форматирование времени (секунды в читаемый формат)
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}m ${secs}s`
  }
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

/**
 * Форматирование процентов
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Форматирование множителя (x2.5, x10, etc)
 */
export function formatMultiplier(value: Decimal | number): string {
  const num = value instanceof Decimal ? value : new Decimal(value)
  
  if (num.lt(10)) {
    return `x${num.toNumber().toFixed(2)}`
  } else if (num.lt(100)) {
    return `x${num.toNumber().toFixed(1)}`
  } else {
    return `x${formatNumberCompact(num)}`
  }
}

/**
 * Форматирование разницы (для показа изменений)
 */
export function formatDifference(
  value: Decimal | number,
  showSign: boolean = true
): string {
  return formatNumber(value, {
    showPlus: showSign,
    minSignificantDigits: 2,
    maxSignificantDigits: 3,
  })
}

/**
 * Получить описание порядка числа (human-readable)
 */
export function getNumberMagnitude(value: Decimal | number | string): string {
  const num = value instanceof Decimal ? value : new Decimal(value)
  
  if (num.lt(1e3)) return 'единицы'
  if (num.lt(1e6)) return 'тысячи'
  if (num.lt(1e9)) return 'миллионы'
  if (num.lt(1e12)) return 'миллиарды'
  if (num.lt(1e15)) return 'триллионы'
  if (num.lt(1e18)) return 'квадриллионы'
  if (num.lt(1e21)) return 'квинтиллионы'
  
  return 'огромные числа'
}

/**
 * Форматирование для отладки
 */
export function formatNumberDebug(value: Decimal | number | string): string {
  const num = value instanceof Decimal ? value : new Decimal(value)
  return `${formatNumber(num)} (${num.toString()})`
}

