import { memo, useMemo, useState } from 'react'
import { Decimal } from '../utils/bigNumber'
import { formatNumber } from '../utils/numberFormatter'
import type { WorkerConfig } from '../types/workers'
import { getUpgrade } from '../configs/upgrades'
import styles from './WorkerCard.module.scss'

interface WorkerCardProps {
  config: WorkerConfig
  count: number
  cost: Decimal
  cps: Decimal
  canAfford: boolean
  isUnlocked: boolean
  onBuy: () => void
  // Данные о бусте
  boostLevel?: number
  boostCost?: Decimal
  canAffordBoost?: boolean
  onBuyBoost?: () => void
  boostMultiplier?: Decimal // Множитель от буста
}

export const WorkerCard = memo(function WorkerCard({
  config,
  count,
  cost,
  cps,
  canAfford,
  isUnlocked,
  onBuy,
  boostLevel,
  boostCost,
  canAffordBoost,
  onBuyBoost,
  boostMultiplier,
}: WorkerCardProps) {
  const [showBoost, setShowBoost] = useState(false)
  
  if (!isUnlocked && !config.showBeforeUnlock) {
    return null
  }
  
  // Получаем информацию о бусте
  const boostInfo = useMemo(() => {
    if (!config.boostUpgradeId) return null
    const upgrade = getUpgrade(config.boostUpgradeId)
    return upgrade
  }, [config.boostUpgradeId])
  
  const isBoostAvailable = count >= 10 && boostInfo
  
  // Форматируем условие разблокировки
  const unlockText = useMemo(() => {
    if (!config.unlockRequirement) return null
    const req = config.unlockRequirement
    
    if (req.type === 'worker' && req.targetId && req.level) {
      return `Требуется: ${req.level} ${req.targetId === 'miner' ? 'шахтёров' : 
        req.targetId === 'crafter' ? 'ремесленников' :
        req.targetId === 'alchemist' ? 'алхимиков' :
        req.targetId === 'engineer' ? 'инженеров' :
        req.targetId === 'technician' ? 'техников' :
        req.targetId === 'golem' ? 'големов' :
        req.targetId === 'sentinel' ? 'стражей' :
        req.targetId === 'ascendant' ? 'вознёсшихся' :
        req.targetId === 'deity' ? 'божеств' :
        req.targetId === 'omniscient' ? 'всезнающих' : 'воркеров'}`
    }
    
    if (req.type === 'crystals' && req.amount) {
      return `Требуется: ${formatNumber(req.amount)} кристаллов`
    }
    
    return null
  }, [config.unlockRequirement])
  
  return (
    <div 
      className={`${styles.card} ${!isUnlocked ? styles.locked : ''} ${showBoost ? styles.boostMode : ''}`}
      style={{ '--worker-color': config.color } as React.CSSProperties}
    >
      {/* Режим воркера */}
      <div className={`${styles.workerMode} ${showBoost ? styles.hidden : ''}`}>
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
            <div className={styles.valueContainer}>
              <div className={styles.value}>{formatNumber(config.baseCps)} Cr/s</div>
              {boostMultiplier && boostMultiplier.gt(1) && (
                <div className={styles.boostMultiplierBadge}>
                  ×{boostMultiplier.toFixed(2)}
                </div>
              )}
            </div>
            {boostMultiplier && boostMultiplier.gt(1) && (
              <div className={styles.boostedValue}>
                = {formatNumber(config.baseCps.mul(boostMultiplier))} Cr/s
              </div>
            )}
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
        
        {/* Информация о бусте */}
        {boostInfo && isUnlocked && count > 0 && (
          <div 
            className={`${styles.boostInfo} ${isBoostAvailable ? styles.clickable : ''}`}
            onClick={isBoostAvailable ? () => setShowBoost(true) : undefined}
          >
            {count < 10 ? (
              <div className={styles.boostLabel}>
                🔒 {boostInfo.icon} Буст разблокируется на 10 уровне ({count}/10)
              </div>
            ) : (
              <>
                <div className={styles.boostLabel}>
                  ✓ {boostInfo.icon} {boostInfo.name}
                  {boostLevel && boostLevel > 0 && (
                    <span className={styles.boostLevelBadge}> ур.{boostLevel}</span>
                  )}
                </div>
                <div className={styles.boostHint}>
                  👉 Нажмите для улучшения
                </div>
              </>
            )}
          </div>
        )}
        
        {!isUnlocked && (
          <div className={styles.unlockHint}>
            🔒 {unlockText || 'Требуется разблокировка'}
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
      
      {/* Режим буста */}
      {boostInfo && isBoostAvailable && (
        <div className={`${styles.boostMode} ${!showBoost ? styles.hidden : ''}`}>
          <div className={styles.boostHeader}>
            <button 
              className={styles.backButton}
              onClick={() => setShowBoost(false)}
            >
              ← Назад
            </button>
            <div className={styles.boostTitle}>
              {boostInfo.icon} {boostInfo.name}
            </div>
          </div>
          
          <div className={styles.boostDescription}>
            {boostInfo.description}
          </div>
          
          <div className={styles.boostStats}>
            <div className={styles.boostStatItem}>
              <div className={styles.label}>Текущий уровень:</div>
              <div className={styles.value}>{boostLevel || 0}</div>
            </div>
            
            {boostLevel && boostLevel > 0 && boostInfo.effect && (
              <div className={styles.boostStatItem}>
                <div className={styles.label}>Эффект:</div>
                <div className={styles.value}>
                  {formatNumber(boostInfo.effect(boostLevel || 0).value)}x
                </div>
              </div>
            )}
          </div>
          
          {boostCost && onBuyBoost && (
            <button
              className={styles.buyButton}
              onClick={onBuyBoost}
              disabled={!canAffordBoost}
            >
              <span className={styles.buyText}>
                {boostLevel && boostLevel > 0 ? '⬆️' : '✨'} Улучшить за {formatNumber(boostCost)} Cr
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  )
})

