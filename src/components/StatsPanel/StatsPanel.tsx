import { memo } from 'react'
import { Decimal, D } from '../../utils/bigNumber'
import { formatNumber, formatMultiplier } from '../../utils/numberFormatter'
import styles from './StatsPanel.module.scss'

interface StatsPanelProps {
  totalCrystalsEarned: Decimal
  totalCps: Decimal
  baseClickValue: Decimal
  clickMultiplier: Decimal
  productionMultiplier: Decimal
  totalClicks: number
}

export const StatsPanel = memo(function StatsPanel({
  totalCrystalsEarned,
  totalCps,
  baseClickValue,
  clickMultiplier,
  productionMultiplier,
  totalClicks,
}: StatsPanelProps) {
  const finalClickValue = baseClickValue.mul(clickMultiplier)
  
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>📊 Статистика</h3>
      
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Всего заработано:</div>
          <div className={styles.statValue}>{formatNumber(totalCrystalsEarned)} Cr</div>
        </div>
        
        <div className={styles.stat}>
          <div className={styles.statLabel}>Кристаллов в секунду:</div>
          <div className={styles.statValue}>{formatNumber(totalCps)} Cr/s</div>
        </div>
        
        <div className={styles.stat}>
          <div className={styles.statLabel}>Сила клика:</div>
          <div className={styles.statValue}>
            {formatNumber(finalClickValue)} Cr
            {clickMultiplier.gt(1) && (
              <span className={styles.multiplier}> ({formatMultiplier(clickMultiplier)})</span>
            )}
          </div>
        </div>
        
        {productionMultiplier.gt(1) && (
          <div className={styles.stat}>
            <div className={styles.statLabel}>Множитель производства:</div>
            <div className={styles.statValue}>{formatMultiplier(productionMultiplier)}</div>
          </div>
        )}
        
        <div className={styles.stat}>
          <div className={styles.statLabel}>Всего кликов:</div>
          <div className={styles.statValue}>{formatNumber(D(totalClicks))}</div>
        </div>
      </div>
    </div>
  )
})

