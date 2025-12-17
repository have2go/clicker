import { memo } from 'react'
import { Decimal } from '../../utils/bigNumber'
import { formatNumber } from '../../utils/numberFormatter'
import { getAllPrestigeUpgrades, PRESTIGE_CONFIG } from '../../configs/prestige'
import type { PrestigeUpgrade } from '../../types/prestige'
import styles from './PrestigePanel.module.scss'

interface PrestigePanelProps {
  totalCrystalsEarned: Decimal
  prestigeLevel: number
  prestigeCurrency: Decimal
  canPrestige: boolean
  prestigeReward: Decimal
  onPrestige: () => void
  onBuyUpgrade: (upgradeId: string) => void
  getUpgradeLevel: (upgradeId: string) => number
  canAffordUpgrade: (upgradeId: string) => boolean
}

export const PrestigePanel = memo(function PrestigePanel({
  totalCrystalsEarned,
  prestigeLevel,
  prestigeCurrency,
  canPrestige,
  prestigeReward,
  onPrestige,
  onBuyUpgrade,
  getUpgradeLevel,
  canAffordUpgrade,
}: PrestigePanelProps) {
  const upgrades = getAllPrestigeUpgrades()
  
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>🌟 Престиж</h2>
        <div className={styles.info}>
          Сбросьте прогресс для получения постоянных бонусов
        </div>
      </div>
      
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>Уровень престижа:</div>
          <div className={styles.statValue}>{prestigeLevel}</div>
        </div>
        
        <div className={styles.stat}>
          <div className={styles.statLabel}>Кристаллы престижа:</div>
          <div className={styles.statValue}>{formatNumber(prestigeCurrency)}</div>
        </div>
        
        <div className={styles.stat}>
          <div className={styles.statLabel}>Всего заработано:</div>
          <div className={styles.statValue}>{formatNumber(totalCrystalsEarned)} Cr</div>
        </div>
      </div>
      
      <div className={styles.prestigeAction}>
        {canPrestige ? (
          <>
            <div className={styles.reward}>
              Получите: <span className={styles.rewardValue}>+{formatNumber(prestigeReward)}</span> 💎
            </div>
            <button
              className={styles.prestigeButton}
              onClick={onPrestige}
            >
              ⚡ Выполнить престиж
            </button>
          </>
        ) : (
          <div className={styles.requirement}>
            Требуется: {formatNumber(PRESTIGE_CONFIG.minCrystalsForPrestige)} Cr
          </div>
        )}
      </div>
      
      {prestigeCurrency.gt(0) && (
        <div className={styles.upgrades}>
          <h3 className={styles.upgradesTitle}>Постоянные улучшения</h3>
          
          {upgrades.map((upgrade: PrestigeUpgrade) => {
            const level = getUpgradeLevel(upgrade.id)
            const canAfford = canAffordUpgrade(upgrade.id)
            const isMaxed = upgrade.maxLevel !== undefined && level >= upgrade.maxLevel
            
            return (
              <div key={upgrade.id} className={styles.upgrade}>
                <div className={styles.upgradeHeader}>
                  <span className={styles.upgradeIcon}>{upgrade.icon}</span>
                  <div className={styles.upgradeInfo}>
                    <div className={styles.upgradeName}>{upgrade.name}</div>
                    <div className={styles.upgradeDesc}>{upgrade.description}</div>
                  </div>
                </div>
                
                <div className={styles.upgradeFooter}>
                  <div className={styles.upgradeLevel}>
                    Уровень: {level}
                    {upgrade.maxLevel && <span> / {upgrade.maxLevel}</span>}
                  </div>
                  
                  {!isMaxed ? (
                    <button
                      className={styles.upgradeButton}
                      onClick={() => onBuyUpgrade(upgrade.id)}
                      disabled={!canAfford}
                    >
                      💎 {formatNumber(upgrade.cost)}
                    </button>
                  ) : (
                    <div className={styles.maxed}>✓ Макс</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})

