import { memo, useMemo } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { getUpgradesByCategory } from '../../configs/upgrades'
import { UpgradeCategory } from '../../types/upgrades'
import { UpgradeCard } from '../UpgradeCard/UpgradeCard'
import styles from './tabs.module.scss'

export const GlobalTab = memo(function GlobalTab() {
  // Получаем методы из gameStore
  const {
    getUpgradeLevel,
    getUpgradeCost,
    isUpgradeUnlocked,
    canAffordUpgrade,
    buyUpgrade,
  } = useGameStore()

  const globalUpgrades = useMemo(() =>
    getUpgradesByCategory(UpgradeCategory.GLOBAL),
    []
  )
  
  const synergyUpgrades = useMemo(() => 
    getUpgradesByCategory(UpgradeCategory.SYNERGY),
    []
  )

  const thematicPulseSynergy = useMemo(() => 
    synergyUpgrades.filter(u => u.id === 'thematicPulse'),
    [synergyUpgrades]
  )

  const hasGlobalSynergy = thematicPulseSynergy.some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock)

  return (
    <div className={styles.globalSection}>
      <div className={styles.categorySection}>
        <h3 className={styles.categoryTitle}>Глобальные множители</h3>
        {globalUpgrades.map(config => {
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
      
      {/* Global Synergies */}
      {hasGlobalSynergy && (
        <div className={styles.categorySection}>
          <h3 className={styles.categoryTitle}>⚡ Синергии</h3>
          {thematicPulseSynergy.map(config => {
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

