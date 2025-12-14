import {
  type UpgradeConfig,
  UpgradeType,
  UpgradeCategory,
  type UpgradeEffect,
} from '../types/upgrades'
import { UPGRADES_ECONOMY } from './economy'

/**
 * Все апгрейды в игре
 * 
 * ВАЖНО: Экономические параметры (цены, эффекты, рост) находятся в economy/balance/
 * Здесь только контент: названия, описания, иконки, типы, категории
 */

export const UPGRADES: Record<string, UpgradeConfig> = {
  // ============================================
  // КАТЕГОРИЯ 1: CLICK POWER (4 апгрейда)
  // Прямое усиление клика
  // ============================================
  
  clickPower: {
    id: 'clickPower',
    name: 'Усиление клика',
    description: 'Каждый уровень добавляет +0.1 кристаллов за клик',
    icon: '👆',
    type: UpgradeType.CLICK,
    category: UpgradeCategory.ACTIVE,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.clickPower.baseCost,
    costGrowth: UPGRADES_ECONOMY.clickPower.costGrowth,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.clickPower.effectType,
      target: UPGRADES_ECONOMY.clickPower.effectTarget,
      value: UPGRADES_ECONOMY.clickPower.effectFormula(level),
    }),
  },
  
  clickMultiplier: {
    id: 'clickMultiplier',
    name: 'Множитель клика',
    description: 'Каждый уровень увеличивает силу клика на 15%',
    icon: '💪',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.ACTIVE,
    showBeforeUnlock: false,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.clickMultiplier.baseCost,
    costGrowth: UPGRADES_ECONOMY.clickMultiplier.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.clickMultiplier.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.clickMultiplier.effectType,
      target: UPGRADES_ECONOMY.clickMultiplier.effectTarget,
      value: UPGRADES_ECONOMY.clickMultiplier.effectFormula(level),
    }),
  },
  
  criticalStrike: {
    id: 'criticalStrike',
    name: 'Критический удар',
    description: 'Каждый уровень добавляет +5% к урону клика (макс. 50%)',
    icon: '💥',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.ACTIVE,
    showBeforeUnlock: false,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.criticalStrike.baseCost,
    costGrowth: UPGRADES_ECONOMY.criticalStrike.costGrowth,
    maxLevel: UPGRADES_ECONOMY.criticalStrike.maxLevel,
    unlockRequirement: UPGRADES_ECONOMY.criticalStrike.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.criticalStrike.effectType,
      target: UPGRADES_ECONOMY.criticalStrike.effectTarget,
      value: UPGRADES_ECONOMY.criticalStrike.effectFormula(level),
    }),
  },
  
  clickCombo: {
    id: 'clickCombo',
    name: 'Комбо-клики',
    description: 'Множитель за быстрые клики подряд (x1.1 за уровень)',
    icon: '🔥',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.ACTIVE,
    showBeforeUnlock: false,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.clickCombo.baseCost,
    costGrowth: UPGRADES_ECONOMY.clickCombo.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.clickCombo.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.clickCombo.effectType,
      target: UPGRADES_ECONOMY.clickCombo.effectTarget,
      value: UPGRADES_ECONOMY.clickCombo.effectFormula(level),
    }),
  },
  
  // ============================================
  // СПЕЦИАЛЬНЫЕ КЛИК МЕХАНИКИ (4 апгрейда)
  // Уникальные и веселые механики
  // ============================================
  
  luckyStrike: {
    id: 'luckyStrike',
    name: 'Удачный удар',
    description: '2% шанс нанести x10 урон, стакается с комбо',
    icon: '🎲',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.ACTIVE,
    showBeforeUnlock: false,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.luckyStrike.baseCost,
    costGrowth: UPGRADES_ECONOMY.luckyStrike.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.luckyStrike.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.luckyStrike.effectType,
      target: UPGRADES_ECONOMY.luckyStrike.effectTarget,
      value: UPGRADES_ECONOMY.luckyStrike.effectFormula(level),
    }),
  },
  
  mirrorPool: {
    id: 'mirrorPool',
    name: 'Зеркальный водоем',
    description: 'Каждый 100-й клик дает +1000 CPS на 60 секунд',
    icon: '💫',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.ACTIVE,
    showBeforeUnlock: false,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.mirrorPool.baseCost,
    costGrowth: UPGRADES_ECONOMY.mirrorPool.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.mirrorPool.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.mirrorPool.effectType,
      target: UPGRADES_ECONOMY.mirrorPool.effectTarget,
      value: UPGRADES_ECONOMY.mirrorPool.effectFormula(level),
    }),
  },
  
  timeWarp: {
    id: 'timeWarp',
    name: 'Временное искривление',
    description: 'Раз в 5 минут x3 к производству на 10 секунд',
    icon: '⏰',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.ACTIVE,
    showBeforeUnlock: false,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.timeWarp.baseCost,
    costGrowth: UPGRADES_ECONOMY.timeWarp.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.timeWarp.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.timeWarp.effectType,
      target: UPGRADES_ECONOMY.timeWarp.effectTarget,
      value: UPGRADES_ECONOMY.timeWarp.effectFormula(level),
    }),
  },
  
  realityBreaker: {
    id: 'realityBreaker',
    name: 'Разрушитель реальности',
    description: 'x2 ко всему при 10M+ CPS (высший уровень!)',
    icon: '🌌',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.ACTIVE,
    showBeforeUnlock: false,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.realityBreaker.baseCost,
    costGrowth: UPGRADES_ECONOMY.realityBreaker.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.realityBreaker.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.realityBreaker.effectType,
      target: UPGRADES_ECONOMY.realityBreaker.effectTarget,
      value: UPGRADES_ECONOMY.realityBreaker.effectFormula(level),
    }),
  },
  
  // ============================================
  // ПАССИВНЫЕ АПГРЕЙДЫ (Производство)
  // ============================================
  
  globalProduction: {
    id: 'globalProduction',
    name: 'Глобальное усиление',
    description: 'Каждый уровень увеличивает производство всех воркеров на 10%',
    icon: '🌟',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.globalProduction.baseCost,
    costGrowth: UPGRADES_ECONOMY.globalProduction.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.globalProduction.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.globalProduction.effectType,
      target: UPGRADES_ECONOMY.globalProduction.effectTarget,
      value: UPGRADES_ECONOMY.globalProduction.effectFormula(level),
    }),
  },
  
  workerEfficiency: {
    id: 'workerEfficiency',
    name: 'Эффективность работы',
    description: 'Каждый уровень увеличивает CPS на 50%',
    icon: '⚙️',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: false,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.workerEfficiency.baseCost,
    costGrowth: UPGRADES_ECONOMY.workerEfficiency.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.workerEfficiency.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.workerEfficiency.effectType,
      target: UPGRADES_ECONOMY.workerEfficiency.effectTarget,
      value: UPGRADES_ECONOMY.workerEfficiency.effectFormula(level),
    }),
  },
  
  // ============================================
  // СПЕЦИАЛЬНЫЕ
  // ============================================
  
  luckyBonus: {
    id: 'luckyBonus',
    name: 'Удача',
    description: 'Каждый уровень даёт +2% ко всем источникам дохода',
    icon: '🍀',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.SPECIAL,
    showBeforeUnlock: true,
    // Экономика из economy/balance/upgrades.ts
    baseCost: UPGRADES_ECONOMY.luckyBonus.baseCost,
    costGrowth: UPGRADES_ECONOMY.luckyBonus.costGrowth,
    maxLevel: UPGRADES_ECONOMY.luckyBonus.maxLevel,
    unlockRequirement: UPGRADES_ECONOMY.luckyBonus.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.luckyBonus.effectType,
      target: UPGRADES_ECONOMY.luckyBonus.effectTarget,
      value: UPGRADES_ECONOMY.luckyBonus.effectFormula(level),
    }),
  },
  
  // ============================================
  // БУСТЫ ВОРКЕРОВ (10 апгрейдов)
  // Усиление производства каждого воркера
  // ============================================
  
  minerBoost: {
    id: 'minerBoost',
    name: 'Усиление шахтёра',
    description: 'Каждый уровень увеличивает производство шахтёров на 20%',
    icon: '⛏️',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.minerBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.minerBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.minerBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.minerBoost.effectType,
      target: UPGRADES_ECONOMY.minerBoost.effectTarget,
      value: UPGRADES_ECONOMY.minerBoost.effectFormula(level),
      workerId: 'miner',
    }),
  },
  
  crafterBoost: {
    id: 'crafterBoost',
    name: 'Усиление ремесленника',
    description: 'Каждый уровень увеличивает производство ремесленников на 30%',
    icon: '🔨',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.crafterBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.crafterBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.crafterBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.crafterBoost.effectType,
      target: UPGRADES_ECONOMY.crafterBoost.effectTarget,
      value: UPGRADES_ECONOMY.crafterBoost.effectFormula(level),
      workerId: 'crafter',
    }),
  },
  
  alchemistBoost: {
    id: 'alchemistBoost',
    name: 'Усиление алхимика',
    description: 'Каждый уровень увеличивает производство алхимиков на 40%',
    icon: '⚗️',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.alchemistBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.alchemistBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.alchemistBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.alchemistBoost.effectType,
      target: UPGRADES_ECONOMY.alchemistBoost.effectTarget,
      value: UPGRADES_ECONOMY.alchemistBoost.effectFormula(level),
      workerId: 'alchemist',
    }),
  },
  
  engineerBoost: {
    id: 'engineerBoost',
    name: 'Усиление инженера',
    description: 'Каждый уровень увеличивает производство инженеров на 50%',
    icon: '👨‍🔧',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.engineerBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.engineerBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.engineerBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.engineerBoost.effectType,
      target: UPGRADES_ECONOMY.engineerBoost.effectTarget,
      value: UPGRADES_ECONOMY.engineerBoost.effectFormula(level),
      workerId: 'engineer',
    }),
  },
  
  technicianBoost: {
    id: 'technicianBoost',
    name: 'Усиление техника',
    description: 'Каждый уровень увеличивает производство техников на 60%',
    icon: '🔧',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.technicianBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.technicianBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.technicianBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.technicianBoost.effectType,
      target: UPGRADES_ECONOMY.technicianBoost.effectTarget,
      value: UPGRADES_ECONOMY.technicianBoost.effectFormula(level),
      workerId: 'technician',
    }),
  },
  
  golemBoost: {
    id: 'golemBoost',
    name: 'Усиление голема',
    description: 'Каждый уровень увеличивает производство големов на 70%',
    icon: '🗿',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.golemBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.golemBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.golemBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.golemBoost.effectType,
      target: UPGRADES_ECONOMY.golemBoost.effectTarget,
      value: UPGRADES_ECONOMY.golemBoost.effectFormula(level),
      workerId: 'golem',
    }),
  },
  
  sentinelBoost: {
    id: 'sentinelBoost',
    name: 'Усиление стража',
    description: 'Каждый уровень увеличивает производство стражей на 80%',
    icon: '🛡️',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.sentinelBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.sentinelBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.sentinelBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.sentinelBoost.effectType,
      target: UPGRADES_ECONOMY.sentinelBoost.effectTarget,
      value: UPGRADES_ECONOMY.sentinelBoost.effectFormula(level),
      workerId: 'sentinel',
    }),
  },
  
  ascendantBoost: {
    id: 'ascendantBoost',
    name: 'Усиление вознёсшегося',
    description: 'Каждый уровень увеличивает производство вознёсшихся на 90%',
    icon: '👼',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.ascendantBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.ascendantBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.ascendantBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.ascendantBoost.effectType,
      target: UPGRADES_ECONOMY.ascendantBoost.effectTarget,
      value: UPGRADES_ECONOMY.ascendantBoost.effectFormula(level),
      workerId: 'ascendant',
    }),
  },
  
  deityBoost: {
    id: 'deityBoost',
    name: 'Усиление божества',
    description: 'Каждый уровень удваивает производство божеств',
    icon: '⚡',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.deityBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.deityBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.deityBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.deityBoost.effectType,
      target: UPGRADES_ECONOMY.deityBoost.effectTarget,
      value: UPGRADES_ECONOMY.deityBoost.effectFormula(level),
      workerId: 'deity',
    }),
  },
  
  omniscientBoost: {
    id: 'omniscientBoost',
    name: 'Усиление всезнающего',
    description: 'Каждый уровень увеличивает производство всезнающих на 110%',
    icon: '🌌',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.WORKER_BOOST,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.omniscientBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.omniscientBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.omniscientBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.omniscientBoost.effectType,
      target: UPGRADES_ECONOMY.omniscientBoost.effectTarget,
      value: UPGRADES_ECONOMY.omniscientBoost.effectFormula(level),
      workerId: 'omniscient',
    }),
  },
  
  // ============================================
  // ГЛОБАЛЬНЫЕ МНОЖИТЕЛИ (6 апгрейдов)
  // Мощные апгрейды для эндгейма
  // ============================================
  
  globalProductionMultiplier: {
    id: 'globalProductionMultiplier',
    name: 'Глобальное усиление производства',
    description: 'Каждый уровень увеличивает все производство на 20%',
    icon: '🌟',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.GLOBAL,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.globalProductionMultiplier.baseCost,
    costGrowth: UPGRADES_ECONOMY.globalProductionMultiplier.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.globalProductionMultiplier.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.globalProductionMultiplier.effectType,
      target: UPGRADES_ECONOMY.globalProductionMultiplier.effectTarget,
      value: UPGRADES_ECONOMY.globalProductionMultiplier.effectFormula(level),
    }),
  },
  
  crystallineEfficiency: {
    id: 'crystallineEfficiency',
    name: 'Кристаллическая эффективность',
    description: 'Каждый уровень добавляет +5% к эффективности воркеров',
    icon: '💎',
    type: UpgradeType.MULTIPLIER,
    category: UpgradeCategory.GLOBAL,
    showBeforeUnlock: false,
    baseCost: UPGRADES_ECONOMY.crystallineEfficiency.baseCost,
    costGrowth: UPGRADES_ECONOMY.crystallineEfficiency.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.crystallineEfficiency.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.crystallineEfficiency.effectType,
      target: UPGRADES_ECONOMY.crystallineEfficiency.effectTarget,
      value: UPGRADES_ECONOMY.crystallineEfficiency.effectFormula(level),
    }),
  },
  
  conversionRitual: {
    id: 'conversionRitual',
    name: 'Ритуал конверсии',
    description: 'Каждый уровень даёт x1.15 за каждую сделанную транзакцию',
    icon: '🔮',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.GLOBAL,
    showBeforeUnlock: false,
    baseCost: UPGRADES_ECONOMY.conversionRitual.baseCost,
    costGrowth: UPGRADES_ECONOMY.conversionRitual.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.conversionRitual.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.conversionRitual.effectType,
      target: UPGRADES_ECONOMY.conversionRitual.effectTarget,
      value: UPGRADES_ECONOMY.conversionRitual.effectFormula(level),
    }),
  },
  
  eternityLoop: {
    id: 'eternityLoop',
    name: 'Петля вечности',
    description: 'Каждый уровень даёт x1.05 за каждый купленный апгрейд (макс 50 уровней)',
    icon: '♾️',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.GLOBAL,
    showBeforeUnlock: false,
    baseCost: UPGRADES_ECONOMY.eternityLoop.baseCost,
    costGrowth: UPGRADES_ECONOMY.eternityLoop.costGrowth,
    maxLevel: UPGRADES_ECONOMY.eternityLoop.maxLevel,
    unlockRequirement: UPGRADES_ECONOMY.eternityLoop.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.eternityLoop.effectType,
      target: UPGRADES_ECONOMY.eternityLoop.effectTarget,
      value: UPGRADES_ECONOMY.eternityLoop.effectFormula(level),
    }),
  },
  
  presenceAmplifier: {
    id: 'presenceAmplifier',
    name: 'Усилитель присутствия',
    description: 'Каждый уровень даёт x1.1 за каждого купленного воркера',
    icon: '✨',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.GLOBAL,
    showBeforeUnlock: false,
    baseCost: UPGRADES_ECONOMY.presenceAmplifier.baseCost,
    costGrowth: UPGRADES_ECONOMY.presenceAmplifier.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.presenceAmplifier.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.presenceAmplifier.effectType,
      target: UPGRADES_ECONOMY.presenceAmplifier.effectTarget,
      value: UPGRADES_ECONOMY.presenceAmplifier.effectFormula(level),
    }),
  },
  
  ascensionMark: {
    id: 'ascensionMark',
    name: 'Метка вознесения',
    description: 'Каждый уровень удваивает производство (x2)',
    icon: '⭐',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.GLOBAL,
    showBeforeUnlock: false,
    baseCost: UPGRADES_ECONOMY.ascensionMark.baseCost,
    costGrowth: UPGRADES_ECONOMY.ascensionMark.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.ascensionMark.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.ascensionMark.effectType,
      target: UPGRADES_ECONOMY.ascensionMark.effectTarget,
      value: UPGRADES_ECONOMY.ascensionMark.effectFormula(level),
    }),
  },
  
  // ============================================
  // КАТЕГОРИЯ: OFFLINE & IDLE SYSTEM (5 апгрейдов)
  // Система оффлайн прогресса и idle механик
  // ============================================
  
  offlineProgress: {
    id: 'offlineProgress',
    name: 'Оффлайн прогресс',
    description: 'Увеличивает процент производства в оффлайне (35% → 60%)',
    icon: '💤',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.OFFLINE,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.offlineProgress.baseCost,
    costGrowth: UPGRADES_ECONOMY.offlineProgress.costGrowth,
    maxLevel: UPGRADES_ECONOMY.offlineProgress.maxLevel,
    unlockRequirement: UPGRADES_ECONOMY.offlineProgress.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.offlineProgress.effectType,
      target: UPGRADES_ECONOMY.offlineProgress.effectTarget,
      value: UPGRADES_ECONOMY.offlineProgress.effectFormula(level),
    }),
  },
  
  autoClicker: {
    id: 'autoClicker',
    name: 'Автокликер',
    description: 'Каждый уровень добавляет +1 автоматический клик в секунду (макс. 20)',
    icon: '🤖',
    type: UpgradeType.AUTOCLICKER,
    category: UpgradeCategory.OFFLINE,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.autoClicker.baseCost,
    costGrowth: UPGRADES_ECONOMY.autoClicker.costGrowth,
    maxLevel: UPGRADES_ECONOMY.autoClicker.maxLevel,
    unlockRequirement: UPGRADES_ECONOMY.autoClicker.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.autoClicker.effectType,
      target: UPGRADES_ECONOMY.autoClicker.effectTarget,
      value: UPGRADES_ECONOMY.autoClicker.effectFormula(level),
    }),
  },
  
  idleBoost: {
    id: 'idleBoost',
    name: 'Idle усиление',
    description: '+10% к производству за каждый час idle (макс. x5)',
    icon: '⏰',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.OFFLINE,
    showBeforeUnlock: false,
    baseCost: UPGRADES_ECONOMY.idleBoost.baseCost,
    costGrowth: UPGRADES_ECONOMY.idleBoost.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.idleBoost.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.idleBoost.effectType,
      target: UPGRADES_ECONOMY.idleBoost.effectTarget,
      value: UPGRADES_ECONOMY.idleBoost.effectFormula(level),
    }),
  },
  
  passiveCrystals: {
    id: 'passiveCrystals',
    name: 'Пассивные кристаллы',
    description: '+1 кристалл/сек независимо от воркеров (макс. 20)',
    icon: '💎',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.OFFLINE,
    showBeforeUnlock: false,
    baseCost: UPGRADES_ECONOMY.passiveCrystals.baseCost,
    costGrowth: UPGRADES_ECONOMY.passiveCrystals.costGrowth,
    maxLevel: UPGRADES_ECONOMY.passiveCrystals.maxLevel,
    unlockRequirement: UPGRADES_ECONOMY.passiveCrystals.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.passiveCrystals.effectType,
      target: UPGRADES_ECONOMY.passiveCrystals.effectTarget,
      value: UPGRADES_ECONOMY.passiveCrystals.effectFormula(level),
    }),
  },
  
  dreamWeaver: {
    id: 'dreamWeaver',
    name: 'Ткач снов',
    description: 'x1.15 за каждый час idle, макс. x3 (10 уровней)',
    icon: '🌙',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.OFFLINE,
    showBeforeUnlock: false,
    baseCost: UPGRADES_ECONOMY.dreamWeaver.baseCost,
    costGrowth: UPGRADES_ECONOMY.dreamWeaver.costGrowth,
    maxLevel: UPGRADES_ECONOMY.dreamWeaver.maxLevel,
    unlockRequirement: UPGRADES_ECONOMY.dreamWeaver.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.dreamWeaver.effectType,
      target: UPGRADES_ECONOMY.dreamWeaver.effectTarget,
      value: UPGRADES_ECONOMY.dreamWeaver.effectFormula(level),
    }),
  },
  
  // ============================================
  // КАТЕГОРИЯ: SYNERGY (3 апгрейда)
  // Синергии между системами
  // ============================================
  
  workerDevotion: {
    id: 'workerDevotion',
    name: 'Преданность воркеров',
    description: 'Worker boosts теперь дают дополнительно +x0.1 за каждый уровень',
    icon: '💼',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.SYNERGY,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.workerDevotion.baseCost,
    costGrowth: UPGRADES_ECONOMY.workerDevotion.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.workerDevotion.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.workerDevotion.effectType,
      target: UPGRADES_ECONOMY.workerDevotion.effectTarget,
      value: UPGRADES_ECONOMY.workerDevotion.effectFormula(level),
    }),
  },
  
  clickResonance: {
    id: 'clickResonance',
    name: 'Резонанс кликов',
    description: 'Все click upgrades дают +50% эффективности друг другу',
    icon: '⚡',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.SYNERGY,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.clickResonance.baseCost,
    costGrowth: UPGRADES_ECONOMY.clickResonance.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.clickResonance.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.clickResonance.effectType,
      target: UPGRADES_ECONOMY.clickResonance.effectTarget,
      value: UPGRADES_ECONOMY.clickResonance.effectFormula(level),
    }),
  },
  
  thematicPulse: {
    id: 'thematicPulse',
    name: 'Тематический импульс',
    description: 'Каждая категория апгрейда усиливает остальные на x1.01 за купленный апгрейд',
    icon: '🌀',
    type: UpgradeType.SPECIAL,
    category: UpgradeCategory.SYNERGY,
    showBeforeUnlock: true,
    baseCost: UPGRADES_ECONOMY.thematicPulse.baseCost,
    costGrowth: UPGRADES_ECONOMY.thematicPulse.costGrowth,
    unlockRequirement: UPGRADES_ECONOMY.thematicPulse.unlockRequirement,
    effect: (level: number): UpgradeEffect => ({
      type: UPGRADES_ECONOMY.thematicPulse.effectType,
      target: UPGRADES_ECONOMY.thematicPulse.effectTarget,
      value: UPGRADES_ECONOMY.thematicPulse.effectFormula(level),
    }),
  },
}

/**
 * Получить список апгрейдов по категории
 */
export function getUpgradesByCategory(
  category: UpgradeCategory
): UpgradeConfig[] {
  return Object.values(UPGRADES).filter(u => u.category === category)
}

/**
 * Получить список апгрейдов по типу
 */
export function getUpgradesByType(type: UpgradeType): UpgradeConfig[] {
  return Object.values(UPGRADES).filter(u => u.type === type)
}

/**
 * Получить апгрейд по ID
 */
export function getUpgrade(id: string): UpgradeConfig | undefined {
  return UPGRADES[id]
}

/**
 * Получить все апгрейды
 */
export function getAllUpgrades(): UpgradeConfig[] {
  return Object.values(UPGRADES)
}

/**
 * Проверить, является ли апгрейд активным (связан с кликами)
 */
export function isActiveUpgrade(upgrade: UpgradeConfig): boolean {
  return upgrade.category === UpgradeCategory.ACTIVE
}

/**
 * Проверить, является ли апгрейд пассивным (связан с производством)
 */
export function isPassiveUpgrade(upgrade: UpgradeConfig): boolean {
  return upgrade.category === UpgradeCategory.PASSIVE
}

