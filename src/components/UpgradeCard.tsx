import { memo } from 'react'
import { Decimal } from '../utils/bigNumber'
import { formatNumber } from '../utils/numberFormatter'
import type { UpgradeConfig } from '../types/upgrades'
import styles from './UpgradeCard.module.scss'

interface UpgradeCardProps {
  config: UpgradeConfig
  level: number
  cost: Decimal
  canAfford: boolean
  isUnlocked: boolean
  onBuy: () => void
}

export const UpgradeCard = memo(function UpgradeCard({
  config,
  level,
  cost,
  canAfford,
  isUnlocked,
  onBuy,
}: UpgradeCardProps) {
  if (!isUnlocked && !config.showBeforeUnlock) {
    return null
  }
  
  const isMaxed = config.maxLevel !== undefined && level >= config.maxLevel
  const effect = config.effect(level)
  
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
      
      {!isUnlocked && (
        <div className={styles.unlockHint}>
          🔒 Требуется разблокировка
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

