import { memo, useMemo } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getUpgradesByCategory } from '../../configs/upgrades'
import { UpgradeCategory } from '../../types/upgrades'
import { UpgradeCard } from '../UpgradeCard/UpgradeCard'
import styles from './tabs.module.scss'

export const OfflineTab = memo(function OfflineTab() {
  // Получаем методы из gameStore
  const {
    getUpgradeLevel,
    getUpgradeCost,
    isUpgradeUnlocked,
    canAffordUpgrade,
    buyUpgrade,
  } = useGameStore()

  const offlineUpgrades = useMemo(() =>
    getUpgradesByCategory(UpgradeCategory.OFFLINE),
    []
  )

  return (
    <div className={styles.offlineSection}>
      <div className={styles.categorySection}>
        <h3 className={styles.categoryTitle}>Оффлайн & Idle система</h3>
        <p className={styles.categoryDescription}>
          Усиления для оффлайн прогресса и пассивного дохода
        </p>
        {offlineUpgrades.map(config => {
          const level = getUpgradeLevel(config.id)
          const cost = getUpgradeCost(config.id)
          const unlocked = isUpgradeUnlocked(config.id)
          const canAfford = canAffordUpgrade(config.id)
          
          // Skip locked upgrades that shouldn't be shown
          if (!unlocked && !config.showBeforeUnlock) {
            return null
          }
          
          return (
            <UpgradeCard
              key={config.id}
              config={config}
              level={level}
              cost={cost}
              canAfford={canAfford}
              isUnlocked={unlocked}
              onBuy={() => buyUpgrade(config.id)}
              isUpgradeUnlocked={isUpgradeUnlocked}
            />
          )
        })}
      </div>
    </div>
  )
})

