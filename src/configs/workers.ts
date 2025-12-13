import { D } from '../utils/bigNumber'
import type { WorkerConfig } from '../types/workers'

/**
 * Все типы воркеров в игре
 * Конфигурация позволяет легко добавлять новые типы воркеров
 */

export const WORKERS: Record<string, WorkerConfig> = {
  // ============================================
  // БАЗОВЫЕ ВОРКЕРЫ
  // ============================================
  
  basic: {
    id: 'basic',
    name: 'Рабочий',
    description: 'Базовый рабочий, добывает небольшое количество кристаллов',
    icon: '👷',
    baseCps: D(0.1),
    baseCost: D(25),
    costGrowth: 1.15,
    order: 1,
    color: '#8B7355',
  },
  
  engineer: {
    id: 'engineer',
    name: 'Инженер',
    description: 'Опытный специалист с улучшенной производительностью',
    icon: '👨‍🔧',
    baseCps: D(1),
    baseCost: D(250),
    costGrowth: 1.15,
    order: 2,
    color: '#4169E1',
    unlockRequirement: {
      type: 'worker',
      targetId: 'basic',
      level: 5,
    },
    showBeforeUnlock: true,
  },
  
  master: {
    id: 'master',
    name: 'Мастер',
    description: 'Высококвалифицированный работник',
    icon: '👨‍🏭',
    baseCps: D(10),
    baseCost: D(2500),
    costGrowth: 1.15,
    order: 3,
    color: '#9370DB',
    unlockRequirement: {
      type: 'worker',
      targetId: 'engineer',
      level: 5,
    },
    showBeforeUnlock: true,
  },
  
  // ============================================
  // ПРОДВИНУТЫЕ ВОРКЕРЫ
  // ============================================
  
  architect: {
    id: 'architect',
    name: 'Архитектор',
    description: 'Проектирует эффективные системы добычи',
    icon: '👨‍💼',
    baseCps: D(100),
    baseCost: D(25000),
    costGrowth: 1.15,
    order: 4,
    color: '#FFD700',
    unlockRequirement: {
      type: 'worker',
      targetId: 'master',
      level: 5,
    },
    showBeforeUnlock: true,
  },
  
  scientist: {
    id: 'scientist',
    name: 'Учёный',
    description: 'Использует научные методы для оптимизации добычи',
    icon: '👨‍🔬',
    baseCps: D(1000),
    baseCost: D(250000),
    costGrowth: 1.15,
    order: 5,
    color: '#00CED1',
    unlockRequirement: {
      type: 'worker',
      targetId: 'architect',
      level: 5,
    },
    showBeforeUnlock: true,
  },
  
  // ============================================
  // ЭЛИТНЫЕ ВОРКЕРЫ
  // ============================================
  
  overseer: {
    id: 'overseer',
    name: 'Надзиратель',
    description: 'Координирует работу всех остальных',
    icon: '👑',
    baseCps: D(10000),
    baseCost: D(2500000),
    costGrowth: 1.15,
    order: 6,
    color: '#DC143C',
    unlockRequirement: {
      type: 'worker',
      targetId: 'scientist',
      level: 5,
    },
    showBeforeUnlock: true,
  },
  
  automaton: {
    id: 'automaton',
    name: 'Автоматон',
    description: 'Полностью автоматизированная добывающая машина',
    icon: '🤖',
    baseCps: D(100000),
    baseCost: D(25000000),
    costGrowth: 1.15,
    order: 7,
    color: '#708090',
    unlockRequirement: {
      type: 'worker',
      targetId: 'overseer',
      level: 5,
    },
    showBeforeUnlock: true,
  },
  
  // ============================================
  // МИФИЧЕСКИЕ ВОРКЕРЫ
  // ============================================
  
  crystallizer: {
    id: 'crystallizer',
    name: 'Кристаллизатор',
    description: 'Создаёт кристаллы из чистой энергии',
    icon: '💎',
    baseCps: D(1000000),
    baseCost: D(250000000),
    costGrowth: 1.15,
    order: 8,
    color: '#FF1493',
    unlockRequirement: {
      type: 'worker',
      targetId: 'automaton',
      level: 5,
    },
    showBeforeUnlock: false,
  },
  
  synthesizer: {
    id: 'synthesizer',
    name: 'Синтезатор',
    description: 'Синтезирует кристаллы на квантовом уровне',
    icon: '✨',
    baseCps: D(10000000),
    baseCost: D(2500000000),
    costGrowth: 1.15,
    order: 9,
    color: '#8A2BE2',
    unlockRequirement: {
      type: 'worker',
      targetId: 'crystallizer',
      level: 5,
    },
    showBeforeUnlock: false,
  },
  
  transcendent: {
    id: 'transcendent',
    name: 'Трансцендент',
    description: 'Превосходит все известные границы производства',
    icon: '🌟',
    baseCps: D(100000000),
    baseCost: D(25000000000),
    costGrowth: 1.15,
    order: 10,
    color: '#FF6347',
    unlockRequirement: {
      type: 'worker',
      targetId: 'synthesizer',
      level: 5,
    },
    showBeforeUnlock: false,
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

