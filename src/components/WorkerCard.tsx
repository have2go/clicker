import { memo } from 'react'
import { Decimal } from '../utils/bigNumber'
import { formatNumber } from '../utils/numberFormatter'
import type { WorkerConfig } from '../types/workers'
import styles from './WorkerCard.module.scss'

interface WorkerCardProps {
  config: WorkerConfig
  count: number
  cost: Decimal
  cps: Decimal
  canAfford: boolean
  isUnlocked: boolean
  onBuy: () => void
}

export const WorkerCard = memo(function WorkerCard({
  config,
  count,
  cost,
  cps,
  canAfford,
  isUnlocked,
  onBuy,
}: WorkerCardProps) {
  if (!isUnlocked && !config.showBeforeUnlock) {
    return null
  }
  
  return (
    <div 
      className={`${styles.card} ${!isUnlocked ? styles.locked : ''}`}
      style={{ '--worker-color': config.color } as React.CSSProperties}
    >
      <div className={styles.header}>
        <span className={styles.icon}>{config.icon}</span>
        <div className={styles.info}>
          <div className={styles.name}>{config.name}</div>
          <div className={styles.description}>{config.description}</div>
        </div>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.production}>
          <div className={styles.label}>Производство:</div>
          <div className={styles.value}>{formatNumber(config.baseCps)} Cr/s</div>
        </div>
        
        {count > 0 && (
          <div className={styles.total}>
            <div className={styles.label}>Всего:</div>
            <div className={styles.value}>{formatNumber(cps)} Cr/s</div>
          </div>
        )}
      </div>
      
      <div className={styles.quantity}>
        <div className={styles.quantityLabel}>Количество:</div>
        <div className={styles.quantityValue}>{count}</div>
      </div>
      
      {!isUnlocked && (
        <div className={styles.unlockHint}>
          🔒 Требуется разблокировка
        </div>
      )}
      
      {isUnlocked && (
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
    </div>
  )
})

