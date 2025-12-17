import { memo } from 'react'
import { Decimal } from '../../utils/bigNumber'
import { formatNumber } from '../../utils/numberFormatter'
import type { UpgradeConfig } from '../../types/upgrades'
import { getUpgrade } from '../../configs/upgrades'
import styles from './UpgradeCard.module.scss'

interface UpgradeCardProps {
  config: UpgradeConfig
  level: number
  cost: Decimal
  canAfford: boolean
  isUnlocked: boolean
  onBuy: () => void
  isUpgradeUnlocked?: (upgradeId: string) => boolean
}

/**
 * Получить текстовое описание требования разблокировки
 */
function getUnlockRequirementText(
  config: UpgradeConfig, 
  isUpgradeUnlocked?: (upgradeId: string) => boolean
): string {
  if (!config.unlockRequirement) return 'Требуется разблокировка'
  
  const req = config.unlockRequirement
  
  switch (req.type) {
    case 'crystals':
      return `Требуется: ${formatNumber(req.amount || Decimal.fromNumber(0))} кристаллов заработано`
    
    case 'upgrade':
      if (req.targetId) {
        const targetUpgrade = getUpgrade(req.targetId)
        const isTargetUnlocked = isUpgradeUnlocked?.(req.targetId) ?? true
        const upgradeName = isTargetUnlocked ? (targetUpgrade?.name || req.targetId) : '???'
        const levelText = req.level ? ` уровень ${req.level}` : ''
        return `Требуется: ${upgradeName}${levelText}`
      }
      return 'Требуется другой апгрейд'
    
    case 'worker':
      return `Требуется: воркер${req.level ? ` уровень ${req.level}` : ''}`
    
    case 'prestige':
      return `Требуется престиж${req.level ? ` уровень ${req.level}` : ''}`
    
    case 'upgrades_count':
      return `Требуется: ${req.count || 0} купленных апгрейдов`
    
    case 'category_upgrades': {
      if (req.upgradeIds && req.minLevels) {
        // Показываем список требуемых апгрейдов, скрываем неразблокированные
        const requirements = req.upgradeIds.map((id, i) => {
          const upgrade = getUpgrade(id)
          const isTargetUnlocked = isUpgradeUnlocked?.(id) ?? true
          const name = isTargetUnlocked ? (upgrade?.name || id) : '???'
          const level = req.minLevels?.[i] || 1
          return `${name} L${level}`
        }).join(', ')
        return `Требуется: ${requirements}`
      }
      if (req.upgradeIds) {
        const requirements = req.upgradeIds.map(id => {
          const upgrade = getUpgrade(id)
          const isTargetUnlocked = isUpgradeUnlocked?.(id) ?? true
          return isTargetUnlocked ? (upgrade?.name || id) : '???'
        }).join(', ')
        return `Требуется: ${requirements}`
      }
      return 'Требуется несколько апгрейдов'
    }
    
    default:
      return 'Требуется разблокировка'
  }
}

export const UpgradeCard = memo(function UpgradeCard({
  config,
  level,
  cost,
  canAfford,
  isUnlocked,
  onBuy,
  isUpgradeUnlocked,
}: UpgradeCardProps) {
  if (!isUnlocked && !config.showBeforeUnlock) {
    return null
  }
  
  const isMaxed = config.maxLevel !== undefined && level >= config.maxLevel
  const effect = config.effect(level)
  const unlockText = !isUnlocked ? getUnlockRequirementText(config, isUpgradeUnlocked) : null
  
  return (
    <div className={`${styles.card} ${!isUnlocked ? styles.locked : ''}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{config.icon}</span>
        <div className={styles.info}>
          <div className={styles.name}>{config.name}</div>
          <div className={styles.description}>{config.description}</div>
        </div>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.level}>
          Уровень: {level}
          {config.maxLevel && <span className={styles.maxLevel}> / {config.maxLevel}</span>}
        </div>
        
        {level > 0 && (
          <div className={styles.effect}>
            {effect.type === 'additive' ? '+' : 'x'}
            {formatNumber(effect.value)}
            {effect.target === 'click' && ' к кликам'}
            {effect.target === 'production' && ' к CPS'}
            {effect.target === 'global' && ' ко всему'}
          </div>
        )}
      </div>
      
      {!isUnlocked && unlockText && (
        <div className={styles.unlockHint}>
          🔒 {unlockText}
        </div>
      )}
      
      {isUnlocked && !isMaxed && (
        <button
          className={styles.buyButton}
          onClick={onBuy}
          disabled={!canAfford}
        >
          <span className={styles.buyText}>
            💰 {formatNumber(cost)} Cr
          </span>
        </button>
      )}
      
      {isMaxed && (
        <div className={styles.maxed}>
          ✓ Максимальный уровень
        </div>
      )}
    </div>
  )
})

