import { memo, useMemo } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getUpgradesByCategory } from '../../configs/upgrades'
import { UpgradeCategory } from '../../types/upgrades'
import { UpgradeCard } from '../UpgradeCard/UpgradeCard'
import styles from './tabs.module.scss'

export const ActiveTab = memo(function ActiveTab() {
  // Получаем методы из gameStore
  const {
    getUpgradeLevel,
    getUpgradeCost,
    isUpgradeUnlocked,
    canAffordUpgrade,
    buyUpgrade,
  } = useGameStore()

  const activeUpgrades = useMemo(() =>
    getUpgradesByCategory(UpgradeCategory.ACTIVE),
    []
  )

  const utilityUpgrades = useMemo(() =>
    getUpgradesByCategory(UpgradeCategory.UTILITY),
    []
  )

  const synergyUpgrades = useMemo(() =>
    getUpgradesByCategory(UpgradeCategory.SYNERGY),
    []
  )

  const clickResonanceSynergy = useMemo(() =>
    synergyUpgrades.filter(u => u.id === 'clickResonance'),
    [synergyUpgrades]
  )

  const hasUtilityUpgrades = utilityUpgrades.some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock)
  const hasClickSynergy = clickResonanceSynergy.some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock)

  return (
    <div className={styles.upgradesSection}>
      {/* Click upgrades */}
      <div className={styles.categorySection}>
        <h3 className={styles.categoryTitle}>Усиления клика</h3>
        {activeUpgrades.map(config => {
          const level = getUpgradeLevel(config.id)
          const cost = getUpgradeCost(config.id)
          const unlocked = isUpgradeUnlocked(config.id)
          const canAfford = canAffordUpgrade(config.id)

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
      
      {/* Utility upgrades */}
      {hasUtilityUpgrades && (
        <div className={styles.categorySection}>
          <h3 className={styles.categoryTitle}>Автоматизация</h3>
          {utilityUpgrades.map(config => {
            const level = getUpgradeLevel(config.id)
            const cost = getUpgradeCost(config.id)
            const unlocked = isUpgradeUnlocked(config.id)
            const canAfford = canAffordUpgrade(config.id)

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
      )}
      
      {/* Click Synergies */}
      {hasClickSynergy && (
        <div className={styles.categorySection}>
          <h3 className={styles.categoryTitle}>⚡ Синергии</h3>
          {clickResonanceSynergy.map(config => {
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
      )}
    </div>
  )
})

