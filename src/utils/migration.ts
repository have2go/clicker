import { D } from './bigNumber'
import type { GameState, LegacyGameState } from '../types/game'
import { SAVE_VERSION } from '../types/game'

/**
 * Система миграции сохранений между версиями
 */

const LEGACY_STORAGE_KEY = 'clicker-game-save'
const NEW_STORAGE_KEY = 'clicker-game-save-v2'

/**
 * Маппинг старых ID воркеров на новые
 */
const WORKER_ID_MIGRATION: Record<string, string> = {
  'basic': 'miner',
  'engineer': 'crafter',
  'master': 'alchemist',
  'architect': 'engineer',
  'scientist': 'technician',
  'overseer': 'golem',
  'automaton': 'sentinel',
  'crystallizer': 'ascendant',
  'synthesizer': 'deity',
  'transcendent': 'omniscient',
}

/**
 * Маппинг старых ID апгрейдов на новые
 */
const UPGRADE_ID_MIGRATION: Record<string, string> = {
  'criticalClick': 'criticalStrike',
}

/**
 * Проверяет наличие старого сохранения
 */
export function hasLegacySave(): boolean {
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    return legacy !== null
  } catch {
    return false
  }
}

/**
 * Мигрирует старое сохранение в новый формат
 */
export function migrateLegacySave(): GameState | null {
  try {
    const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!legacyData) return null
    
    const legacy = JSON.parse(legacyData) as LegacyGameState
    
    console.log('[Migration] Migrating from legacy save:', legacy)
    
    // Создаём новое состояние
    const workers = new Map<string, number>()
    if (legacy.workers > 0) {
      workers.set('miner', legacy.workers) // basic -> miner
    }
    
    const upgrades = new Map<string, number>()
    if (legacy.clickUpgradeLevel > 0) {
      upgrades.set('clickPower', legacy.clickUpgradeLevel)
    }
    
    const newState: GameState = {
      version: SAVE_VERSION,
      crystals: D(legacy.crystals),
      totalCrystalsEarned: D(legacy.crystals), // Приблизительно
      workers,
      upgrades,
      totalClicks: 0, // Не было в старой версии
      lastUpdate: legacy.lastUpdate,
    }
    
    console.log('[Migration] Migrated to new format:', newState)
    
    // Сохраняем в новом формате
    const serialized = {
      version: newState.version,
      crystals: newState.crystals.toString(),
      totalCrystalsEarned: newState.totalCrystalsEarned.toString(),
      workers: Array.from(newState.workers.entries()),
      upgrades: Array.from(newState.upgrades.entries()),
      totalClicks: newState.totalClicks,
      lastUpdate: newState.lastUpdate,
    }
    
    localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(serialized))
    
    // Создаём бэкап старого сохранения
    localStorage.setItem(LEGACY_STORAGE_KEY + '_backup', legacyData)
    
    // Удаляем старое сохранение
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    
    console.log('[Migration] Migration complete')
    
    return newState
  } catch (error) {
    console.error('[Migration] Failed to migrate:', error)
    return null
  }
}

/**
 * Откатывает миграцию (восстанавливает из бэкапа)
 */
export function rollbackMigration(): boolean {
  try {
    const backup = localStorage.getItem(LEGACY_STORAGE_KEY + '_backup')
    if (!backup) return false
    
    localStorage.setItem(LEGACY_STORAGE_KEY, backup)
    localStorage.removeItem(LEGACY_STORAGE_KEY + '_backup')
    localStorage.removeItem(NEW_STORAGE_KEY)
    
    console.log('[Migration] Rollback complete')
    return true
  } catch (error) {
    console.error('[Migration] Failed to rollback:', error)
    return false
  }
}

/**
 * Проверяет версию сохранения и выполняет миграцию если нужно
 */
export function checkAndMigrate(): GameState | null {
  // Проверяем наличие нового сохранения
  const newSave = localStorage.getItem(NEW_STORAGE_KEY)
  if (newSave) {
    try {
      const parsed = JSON.parse(newSave)
      
      // Проверяем версию
      if (parsed.version !== SAVE_VERSION) {
        console.log(`[Migration] Version mismatch: ${parsed.version} -> ${SAVE_VERSION}`)
        
        let migrated = false
        
        // Миграция воркеров для версии 2 -> 3
        if (parsed.workers && Array.isArray(parsed.workers)) {
          parsed.workers = parsed.workers.map(([id, count]: [string, number]) => {
            const newId = WORKER_ID_MIGRATION[id] || id
            if (newId !== id) {
              console.log(`[Migration] Migrating worker: ${id} -> ${newId}`)
              migrated = true
            }
            return [newId, count]
          })
        }
        
        // Миграция апгрейдов для версии 3 -> 4
        if (parsed.upgrades && Array.isArray(parsed.upgrades)) {
          parsed.upgrades = parsed.upgrades.map(([id, level]: [string, number]) => {
            const newId = UPGRADE_ID_MIGRATION[id] || id
            if (newId !== id) {
              console.log(`[Migration] Migrating upgrade: ${id} -> ${newId}`)
              migrated = true
            }
            return [newId, level]
          })
        }
        
        if (migrated) {
          parsed.version = SAVE_VERSION
          localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(parsed))
          console.log('[Migration] IDs migrated successfully')
        }
      }
      
      return null // Нет нужды в миграции
    } catch (error) {
      console.error('[Migration] Failed to parse new save:', error)
    }
  }
  
  // Проверяем старое сохранение
  if (hasLegacySave()) {
    console.log('[Migration] Legacy save detected, migrating...')
    return migrateLegacySave()
  }
  
  return null
}

/**
 * Экспортирует сохранение в строку (для бэкапа)
 */
export function exportSave(): string | null {
  try {
    const save = localStorage.getItem(NEW_STORAGE_KEY)
    if (!save) return null
    
    const encoded = btoa(save)
    return encoded
  } catch (error) {
    console.error('[Migration] Failed to export save:', error)
    return null
  }
}

/**
 * Импортирует сохранение из строки
 */
export function importSave(encoded: string): boolean {
  try {
    const decoded = atob(encoded)
    const parsed = JSON.parse(decoded)
    
    // Валидация
    if (!parsed.version || !parsed.crystals) {
      throw new Error('Invalid save format')
    }
    
    // Создаём бэкап текущего сохранения
    const current = localStorage.getItem(NEW_STORAGE_KEY)
    if (current) {
      localStorage.setItem(NEW_STORAGE_KEY + '_import_backup', current)
    }
    
    localStorage.setItem(NEW_STORAGE_KEY, decoded)
    
    console.log('[Migration] Import successful')
    return true
  } catch (error) {
    console.error('[Migration] Failed to import save:', error)
    return false
  }
}

/**
 * Удаляет все сохранения (полный сброс)
 */
export function clearAllSaves(): void {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    localStorage.removeItem(LEGACY_STORAGE_KEY + '_backup')
    localStorage.removeItem(NEW_STORAGE_KEY)
    localStorage.removeItem(NEW_STORAGE_KEY + '_import_backup')
    console.log('[Migration] All saves cleared')
  } catch (error) {
    console.error('[Migration] Failed to clear saves:', error)
  }
}

