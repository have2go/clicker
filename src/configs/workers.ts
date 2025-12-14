import type { WorkerConfig } from '../types/workers'
import { WORKERS_ECONOMY } from './economy'

/**
 * Все типы воркеров в игре
 * 
 * ВАЖНО: Экономические параметры (цены, CPS, рост) находятся в economy/balance/
 * Здесь только контент: названия, описания, иконки, UI параметры
 */

export const WORKERS: Record<string, WorkerConfig> = {
  // ============================================
  // БАЗОВЫЕ ВОРКЕРЫ
  // ============================================
  
  miner: {
    id: 'miner',
    name: 'Шахтёр',
    description: 'Добывает кристаллы из глубин земли',
    icon: '⛏️',
    order: 1,
    color: '#8B7355',
    boostUpgradeId: 'minerBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.miner,
  },
  
  crafter: {
    id: 'crafter',
    name: 'Ремесленник',
    description: 'Обрабатывает сырые кристаллы, увеличивая их ценность',
    icon: '🔨',
    order: 2,
    color: '#CD853F',
    showBeforeUnlock: true,
    boostUpgradeId: 'crafterBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.crafter,
  },
  
  alchemist: {
    id: 'alchemist',
    name: 'Алхимик',
    description: 'Превращает обычные материалы в драгоценные кристаллы',
    icon: '⚗️',
    order: 3,
    color: '#9370DB',
    showBeforeUnlock: true,
    boostUpgradeId: 'alchemistBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.alchemist,
  },
  
  // ============================================
  // ПРОДВИНУТЫЕ ВОРКЕРЫ
  // ============================================
  
  engineer: {
    id: 'engineer',
    name: 'Инженер',
    description: 'Создаёт механизмы для автоматизации добычи',
    icon: '👨‍🔧',
    order: 4,
    color: '#4169E1',
    showBeforeUnlock: true,
    boostUpgradeId: 'engineerBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.engineer,
  },
  
  technician: {
    id: 'technician',
    name: 'Техник',
    description: 'Управляет сложными технологическими системами',
    icon: '🔧',
    order: 5,
    color: '#00CED1',
    showBeforeUnlock: true,
    boostUpgradeId: 'technicianBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.technician,
  },
  
  // ============================================
  // ЭЛИТНЫЕ ВОРКЕРЫ
  // ============================================
  
  golem: {
    id: 'golem',
    name: 'Голем',
    description: 'Магическое существо невероятной силы и выносливости',
    icon: '🗿',
    order: 6,
    color: '#708090',
    showBeforeUnlock: true,
    boostUpgradeId: 'golemBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.golem,
  },
  
  sentinel: {
    id: 'sentinel',
    name: 'Страж',
    description: 'Древний хранитель кристальных месторождений',
    icon: '🛡️',
    order: 7,
    color: '#DC143C',
    showBeforeUnlock: true,
    boostUpgradeId: 'sentinelBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.sentinel,
  },
  
  // ============================================
  // МИФИЧЕСКИЕ ВОРКЕРЫ
  // ============================================
  
  ascendant: {
    id: 'ascendant',
    name: 'Вознёсшийся',
    description: 'Существо, превзошедшее смертные ограничения',
    icon: '👼',
    order: 8,
    color: '#FFD700',
    showBeforeUnlock: false,
    boostUpgradeId: 'ascendantBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.ascendant,
  },
  
  deity: {
    id: 'deity',
    name: 'Божество',
    description: 'Бог кристаллов, черпающий энергию из самого мироздания',
    icon: '⚡',
    order: 9,
    color: '#FF1493',
    showBeforeUnlock: false,
    boostUpgradeId: 'deityBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.deity,
  },
  
  omniscient: {
    id: 'omniscient',
    name: 'Всезнающий',
    description: 'Высшая сущность, познавшая все тайны кристаллов',
    icon: '🌌',
    order: 10,
    color: '#8A2BE2',
    showBeforeUnlock: false,
    boostUpgradeId: 'omniscientBoost',
    // Экономика из economy/balance/workers.ts
    ...WORKERS_ECONOMY.omniscient,
  },
}

/**
 * Получить воркера по ID
 */
export function getWorker(id: string): WorkerConfig | undefined {
  return WORKERS[id]
}

/**
 * Получить всех воркеров
 */
export function getAllWorkers(): WorkerConfig[] {
  return Object.values(WORKERS)
}

/**
 * Получить воркеров отсортированных по порядку
 */
export function getWorkersSorted(): WorkerConfig[] {
  return getAllWorkers().sort((a, b) => a.order - b.order)
}

/**
 * Получить следующего воркера в цепочке разблокировок
 */
export function getNextWorker(currentWorkerId: string): WorkerConfig | undefined {
  const currentWorker = getWorker(currentWorkerId)
  if (!currentWorker) return undefined
  
  return getAllWorkers().find(
    w => w.unlockRequirement?.type === 'worker' && 
         w.unlockRequirement?.targetId === currentWorkerId
  )
}

/**
 * Получить базовых воркеров (без требований разблокировки)
 */
export function getBaseWorkers(): WorkerConfig[] {
  return getAllWorkers().filter(w => !w.unlockRequirement)
}

