import type { PrestigeConfig, PrestigeUpgrade } from '../types/prestige'
import { 
  PRESTIGE_ECONOMY, 
  PRESTIGE_UPGRADES_ECONOMY 
} from './economy'

/**
 * Конфигурация системы престижа
 * 
 * ВАЖНО: Экономические параметры (формулы, стоимости) находятся в economy/balance/
 * Здесь только структура и контент
 */
export const PRESTIGE_CONFIG: PrestigeConfig = {
  // Экономика из economy/balance/prestige.ts
  minCrystalsForPrestige: PRESTIGE_ECONOMY.minCrystalsRequired,
  calculateReward: PRESTIGE_ECONOMY.rewardFormula,
  getGlobalMultiplier: PRESTIGE_ECONOMY.currencyMultiplierFormula,
}

/**
 * Престиж-апгрейды (покупаются за престиж-валюту)
 * ПЕРЕРАБОТАННАЯ СИСТЕМА: 15 апгрейдов в 3 тирах + утилиты
 */
export const PRESTIGE_UPGRADES: Record<string, PrestigeUpgrade> = {
  // ============================================
  // 💎 TIER 1: CRYSTAL EFFICIENCY
  // ============================================
  
  crystalHarvester: {
    id: 'crystalHarvester',
    name: 'Сборщик кристаллов',
    description: 'Увеличивает получение кристаллов на 30% за уровень',
    icon: '💎',
    cost: PRESTIGE_UPGRADES_ECONOMY.crystalHarvester.cost,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.crystalHarvester.effectFormula(level),
      target: 'production',
    }),
  },
  
  crystallineResonance: {
    id: 'crystallineResonance',
    name: 'Кристаллический резонанс',
    description: 'Увеличивает офлайн прогресс на 50% за уровень (макс 3 уровня)',
    icon: '🔮',
    cost: PRESTIGE_UPGRADES_ECONOMY.crystallineResonance.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.crystallineResonance.maxLevel,
    effect: (level: number) => ({
      type: 'special',
      value: PRESTIGE_UPGRADES_ECONOMY.crystallineResonance.effectFormula(level),
    }),
  },
  
  prismMastery: {
    id: 'prismMastery',
    name: 'Мастерство призмы',
    description: 'Увеличивает производство на 15% за уровень',
    icon: '🌈',
    cost: PRESTIGE_UPGRADES_ECONOMY.prismMastery.cost,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.prismMastery.effectFormula(level),
      target: 'production',
    }),
  },
  
  // ============================================
  // ⚡ TIER 2: PRODUCTION BOOSTERS
  // ============================================
  
  productionEcho: {
    id: 'productionEcho',
    name: 'Эхо производства',
    description: 'Увеличивает производство на 50% за уровень',
    icon: '⚡',
    cost: PRESTIGE_UPGRADES_ECONOMY.productionEcho.cost,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.productionEcho.effectFormula(level),
      target: 'production',
    }),
  },
  
  workerAwakening: {
    id: 'workerAwakening',
    name: 'Пробуждение воркеров',
    description: 'Воркеры на 50% эффективнее за уровень',
    icon: '👷',
    cost: PRESTIGE_UPGRADES_ECONOMY.workerAwakening.cost,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.workerAwakening.effectFormula(level),
      target: 'production',
    }),
  },
  
  clickAugmentation: {
    id: 'clickAugmentation',
    name: 'Усиление кликов',
    description: 'Клики в 2 раза сильнее за уровень (+100%)',
    icon: '💪',
    cost: PRESTIGE_UPGRADES_ECONOMY.clickAugmentation.cost,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.clickAugmentation.effectFormula(level),
      target: 'click',
    }),
  },
  
  globalSynergy: {
    id: 'globalSynergy',
    name: 'Глобальная синергия',
    description: 'Все бонусы апгрейдов на 25% сильнее за уровень',
    icon: '🔗',
    cost: PRESTIGE_UPGRADES_ECONOMY.globalSynergy.cost,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.globalSynergy.effectFormula(level),
      target: 'production',
    }),
  },
  
  // ============================================
  // 🎯 TIER 3: ADVANCED MULTIPLIERS (Эндгейм)
  // ============================================
  
  exponentialGrowth: {
    id: 'exponentialGrowth',
    name: 'Экспоненциальный рост',
    description: 'Каждый престиж-поинт даёт x1.001 множитель ко ВСЕМУ',
    icon: '📈',
    cost: PRESTIGE_UPGRADES_ECONOMY.exponentialGrowth.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.exponentialGrowth.maxLevel,
    effect: (level: number) => ({
      type: 'special',
      value: PRESTIGE_UPGRADES_ECONOMY.exponentialGrowth.effectFormula(level),
    }),
  },
  
  presenceAmplification: {
    id: 'presenceAmplification',
    name: 'Усиление присутствия',
    description: 'Каждый престиж-поинт даёт x1.005 множитель к бустам',
    icon: '🌟',
    cost: PRESTIGE_UPGRADES_ECONOMY.presenceAmplification.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.presenceAmplification.maxLevel,
    effect: (level: number) => ({
      type: 'special',
      value: PRESTIGE_UPGRADES_ECONOMY.presenceAmplification.effectFormula(level),
    }),
  },
  
  ultimateAscension: {
    id: 'ultimateAscension',
    name: 'Окончательное вознесение',
    description: 'Каждый престиж-поинт даёт x1.01 множитель к ВСЕМУ! (МОЩНО)',
    icon: '👑',
    cost: PRESTIGE_UPGRADES_ECONOMY.ultimateAscension.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.ultimateAscension.maxLevel,
    effect: (level: number) => ({
      type: 'special',
      value: PRESTIGE_UPGRADES_ECONOMY.ultimateAscension.effectFormula(level),
    }),
  },
  
  // ============================================
  // 🎁 UTILITY & SPECIAL
  // ============================================
  
  autoProgress: {
    id: 'autoProgress',
    name: 'Автопрогресс',
    description: 'Начинаете с 10 базовых рабочих после престижа',
    icon: '🚀',
    cost: PRESTIGE_UPGRADES_ECONOMY.autoProgress.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.autoProgress.maxLevel,
    effect: (level: number) => ({
      type: 'special',
      value: PRESTIGE_UPGRADES_ECONOMY.autoProgress.effectFormula(level),
    }),
  },
  
  cheaperUpgrades: {
    id: 'cheaperUpgrades',
    name: 'Дешевле апгрейды',
    description: 'Стоимость апгрейдов уменьшена на 5% за уровень (макс 10)',
    icon: '💰',
    cost: PRESTIGE_UPGRADES_ECONOMY.cheaperUpgrades.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.cheaperUpgrades.maxLevel,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.cheaperUpgrades.effectFormula(level),
      target: 'upgradeCost',
    }),
  },
  
  fasterWorkers: {
    id: 'fasterWorkers',
    name: 'Быстрые воркеры',
    description: 'Стоимость воркеров уменьшена на 10% за уровень (макс 15)',
    icon: '⚙️',
    cost: PRESTIGE_UPGRADES_ECONOMY.fasterWorkers.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.fasterWorkers.maxLevel,
    effect: (level: number) => ({
      type: 'multiplier',
      value: PRESTIGE_UPGRADES_ECONOMY.fasterWorkers.effectFormula(level),
      target: 'production',
    }),
  },
  
  luckyClicks: {
    id: 'luckyClicks',
    name: 'Удачные клики',
    description: 'Шанс критического клика +10% за уровень (макс 5)',
    icon: '🍀',
    cost: PRESTIGE_UPGRADES_ECONOMY.luckyClicks.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.luckyClicks.maxLevel,
    effect: (level: number) => ({
      type: 'special',
      value: PRESTIGE_UPGRADES_ECONOMY.luckyClicks.effectFormula(level),
    }),
  },
  
  timeWarp: {
    id: 'timeWarp',
    name: 'Искривление времени',
    description: 'Скорость оффлайн прогресса +25% за уровень (макс 4)',
    icon: '⏰',
    cost: PRESTIGE_UPGRADES_ECONOMY.timeWarp.cost,
    maxLevel: PRESTIGE_UPGRADES_ECONOMY.timeWarp.maxLevel,
    effect: (level: number) => ({
      type: 'special',
      value: PRESTIGE_UPGRADES_ECONOMY.timeWarp.effectFormula(level),
    }),
  },
}

/**
 * Получить престиж-апгрейд по ID
 */
export function getPrestigeUpgrade(id: string): PrestigeUpgrade | undefined {
  return PRESTIGE_UPGRADES[id]
}

/**
 * Получить все престиж-апгрейды
 */
export function getAllPrestigeUpgrades(): PrestigeUpgrade[] {
  return Object.values(PRESTIGE_UPGRADES)
}

