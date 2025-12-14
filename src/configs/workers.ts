import type { WorkerConfig } from '../types/workers'
import { WORKERS_ECONOMY } from './economy/balance'

/**
 * Все типы воркеров в игре
 * 
 * ВАЖНО: Экономические параметры (цены, CPS, рост) находятся в economy/balance.ts
 * Здесь только контент: названия, описания, иконки, UI параметры
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
    order: 1,
    color: '#8B7355',
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.basic,
  },
  
  engineer: {
    id: 'engineer',
    name: 'Инженер',
    description: 'Опытный специалист с улучшенной производительностью',
    icon: '👨‍🔧',
    order: 2,
    color: '#4169E1',
    showBeforeUnlock: true,
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.engineer,
  },
  
  master: {
    id: 'master',
    name: 'Мастер',
    description: 'Высококвалифицированный работник',
    icon: '👨‍🏭',
    order: 3,
    color: '#9370DB',
    showBeforeUnlock: true,
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.master,
  },
  
  // ============================================
  // ПРОДВИНУТЫЕ ВОРКЕРЫ
  // ============================================
  
  architect: {
    id: 'architect',
    name: 'Архитектор',
    description: 'Проектирует эффективные системы добычи',
    icon: '👨‍💼',
    order: 4,
    color: '#FFD700',
    showBeforeUnlock: true,
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.architect,
  },
  
  scientist: {
    id: 'scientist',
    name: 'Учёный',
    description: 'Использует научные методы для оптимизации добычи',
    icon: '👨‍🔬',
    order: 5,
    color: '#00CED1',
    showBeforeUnlock: true,
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.scientist,
  },
  
  // ============================================
  // ЭЛИТНЫЕ ВОРКЕРЫ
  // ============================================
  
  overseer: {
    id: 'overseer',
    name: 'Надзиратель',
    description: 'Координирует работу всех остальных',
    icon: '👑',
    order: 6,
    color: '#DC143C',
    showBeforeUnlock: true,
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.overseer,
  },
  
  automaton: {
    id: 'automaton',
    name: 'Автоматон',
    description: 'Полностью автоматизированная добывающая машина',
    icon: '🤖',
    order: 7,
    color: '#708090',
    showBeforeUnlock: true,
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.automaton,
  },
  
  // ============================================
  // МИФИЧЕСКИЕ ВОРКЕРЫ
  // ============================================
  
  crystallizer: {
    id: 'crystallizer',
    name: 'Кристаллизатор',
    description: 'Создаёт кристаллы из чистой энергии',
    icon: '💎',
    order: 8,
    color: '#FF1493',
    showBeforeUnlock: false,
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.crystallizer,
  },
  
  synthesizer: {
    id: 'synthesizer',
    name: 'Синтезатор',
    description: 'Синтезирует кристаллы на квантовом уровне',
    icon: '✨',
    order: 9,
    color: '#8A2BE2',
    showBeforeUnlock: false,
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.synthesizer,
  },
  
  transcendent: {
    id: 'transcendent',
    name: 'Трансцендент',
    description: 'Превосходит все известные границы производства',
    icon: '🌟',
    order: 10,
    color: '#FF6347',
    showBeforeUnlock: false,
    // Экономика из balance.ts
    ...WORKERS_ECONOMY.transcendent,
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

