import { D } from '../../../utils/bigNumber'
import type { Decimal } from '../../../utils/bigNumber'

/**
 * ============================================
 * ПРЕСТИЖ - ЭКОНОМИКА
 * ============================================
 */

export interface PrestigeEconomy {
  /** Минимум кристаллов для первого престижа */
  minCrystalsRequired: Decimal
  /** Формула награды за престиж */
  rewardFormula: (totalCrystals: Decimal) => Decimal
  /** Формула глобального множителя от валюты */
  currencyMultiplierFormula: (currency: Decimal) => Decimal
  /** Описание прогрессии для документации */
  progression: {
    description: string
    examples: Array<{
      crystals: string
      reward: string
      multiplier?: string
    }>
  }
}

export const PRESTIGE_ECONOMY: PrestigeEconomy = {
  minCrystalsRequired: D(100000), // 100K - первый престиж раньше!
  
  // НОВАЯ ФОРМУЛА: sqrt(totalCrystals / 100K)
  // Более плотная кривая наград
  rewardFormula: (totalCrystals: Decimal): Decimal => {
    if (totalCrystals.lt(100000)) return D(0)
    return totalCrystals.div(100000).sqrt().floor()
  },
  
  // НОВЫЙ МНОЖИТЕЛЬ: 1 + (currency * 0.15)
  // Каждый престиж-кристалл = +15% (было +10%)
  currencyMultiplierFormula: (currency: Decimal): Decimal => {
    return D(1).add(currency.mul(0.15))
  },
  
  progression: {
    description: 'НОВАЯ ПРОГРЕССИЯ: Первый престиж на 100K. Награда растёт с sqrt(crystals/100K). Каждый престиж-кристалл даёт +15% глобально.',
    examples: [
      { crystals: '100K', reward: '1', multiplier: 'x1.15' },
      { crystals: '250K', reward: '1', multiplier: 'x1.15' },
      { crystals: '500K', reward: '2', multiplier: 'x1.30' },
      { crystals: '1M', reward: '3', multiplier: 'x1.45' },
      { crystals: '2.5M', reward: '5', multiplier: 'x1.75' },
      { crystals: '5M', reward: '7', multiplier: 'x2.05' },
      { crystals: '10M', reward: '10', multiplier: 'x2.50' },
      { crystals: '25M', reward: '15', multiplier: 'x3.25' },
      { crystals: '50M', reward: '22', multiplier: 'x4.30' },
      { crystals: '100M', reward: '31', multiplier: 'x5.65' },
      { crystals: '250M', reward: '50', multiplier: 'x8.50' },
      { crystals: '500M', reward: '70', multiplier: 'x11.50' },
      { crystals: '1B', reward: '100', multiplier: 'x16.00' },
      { crystals: '5B', reward: '223', multiplier: 'x34.45' },
      { crystals: '10B', reward: '316', multiplier: 'x48.40' },
      { crystals: '50B', reward: '707', multiplier: 'x107.05' },
      { crystals: '100B', reward: '1000', multiplier: 'x151.00' },
    ],
  },
}

/**
 * ============================================
 * ПРЕСТИЖ-АПГРЕЙДЫ - ЭКОНОМИКА
 * ============================================
 */

export interface PrestigeUpgradeEconomy {
  /** Стоимость в престиж-валюте */
  cost: Decimal
  /** Формула эффекта */
  effectFormula: (level: number) => Decimal
  /** Тип эффекта */
  effectType: 'multiplier' | 'special'
  /** Цель эффекта */
  effectTarget?: 'production' | 'click' | 'upgradeCost'
  /** Максимальный уровень */
  maxLevel?: number
}

export const PRESTIGE_UPGRADES_ECONOMY: Record<string, PrestigeUpgradeEconomy> = {
  // ============================================
  // 💎 TIER 1: CRYSTAL EFFICIENCY (Базовые бусты)
  // ============================================
  
  crystalHarvester: {
    cost: D(2),
    effectFormula: (level: number) => D(Math.pow(1.3, level)), // x1.3 за уровень
    effectType: 'multiplier',
    effectTarget: 'production',
  },
  
  crystallineResonance: {
    cost: D(3),
    effectFormula: (level: number) => D(1 + level * 0.5), // +50% офлайн за уровень
    effectType: 'special',
    maxLevel: 3, // Максимум +150% (итого 200% = x2 к офлайну)
  },
  
  prismMastery: {
    cost: D(5),
    effectFormula: (level: number) => D(Math.pow(1.15, level)), // x1.15 за уровень
    effectType: 'multiplier',
    effectTarget: 'production',
  },
  
  // ============================================
  // ⚡ TIER 2: PRODUCTION BOOSTERS (Сильные бусты)
  // ============================================
  
  productionEcho: {
    cost: D(5),
    effectFormula: (level: number) => D(Math.pow(1.5, level)), // x1.5 за уровень
    effectType: 'multiplier',
    effectTarget: 'production',
  },
  
  workerAwakening: {
    cost: D(7),
    effectFormula: (level: number) => D(Math.pow(1.5, level)), // Workers +50% за уровень
    effectType: 'multiplier',
    effectTarget: 'production',
  },
  
  clickAugmentation: {
    cost: D(8),
    effectFormula: (level: number) => D(Math.pow(2, level)), // Clicks +100% за уровень
    effectType: 'multiplier',
    effectTarget: 'click',
  },
  
  globalSynergy: {
    cost: D(10),
    effectFormula: (level: number) => D(Math.pow(1.25, level)), // Все апгрейды +25% за уровень
    effectType: 'multiplier',
    effectTarget: 'production',
  },
  
  // ============================================
  // 🎯 TIER 3: ADVANCED MULTIPLIERS (Эндгейм)
  // ============================================
  
  exponentialGrowth: {
    cost: D(25),
    effectFormula: (level: number) => {
      // x1.001 за каждый престиж-поинт
      // Если у игрока 100 поинтов престижа: 100^1.001 ≈ 1.47x
      return D(1.001).pow(level)
    },
    effectType: 'special', // Специальный - зависит от престиж-валюты
    maxLevel: 999,
  },
  
  presenceAmplification: {
    cost: D(50),
    effectFormula: (level: number) => {
      // x1.005 за каждый престиж-поинт
      // Если у игрока 100 поинтов: 100^1.005 ≈ 2.15x
      return D(1.005).pow(level)
    },
    effectType: 'special',
    maxLevel: 999,
  },
  
  ultimateAscension: {
    cost: D(100),
    effectFormula: (level: number) => {
      // x1.01 за каждый престиж-поинт
      // Если у игрока 100 поинтов: 100^1.01 ≈ 4.63x
      // ОЧЕНЬ МОЩНЫЙ!
      return D(1.01).pow(level)
    },
    effectType: 'special',
    maxLevel: 999,
  },
  
  // ============================================
  // 🎁 UTILITY & SPECIAL (Старые + новые)
  // ============================================
  
  autoProgress: {
    cost: D(20),
    effectFormula: (level: number) => D(level),
    effectType: 'special',
    maxLevel: 1,
  },
  
  cheaperUpgrades: {
    cost: D(15),
    effectFormula: (level: number) => D(Math.pow(0.95, level)), // -5% за уровень
    effectType: 'multiplier',
    effectTarget: 'upgradeCost',
    maxLevel: 10,
  },
  
  // Новые утилиты
  
  fasterWorkers: {
    cost: D(12),
    effectFormula: (level: number) => D(Math.pow(0.9, level)), // -10% стоимости воркеров за уровень
    effectType: 'multiplier',
    effectTarget: 'production',
    maxLevel: 15,
  },
  
  luckyClicks: {
    cost: D(6),
    effectFormula: (level: number) => D(1 + level * 0.1), // +10% шанс критического клика
    effectType: 'special',
    maxLevel: 5,
  },
  
  timeWarp: {
    cost: D(30),
    effectFormula: (level: number) => D(1 + level * 0.25), // +25% к скорости оффлайн прогресса
    effectType: 'special',
    maxLevel: 4,
  },
}
