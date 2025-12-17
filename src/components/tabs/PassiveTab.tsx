import { memo, useMemo } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useMultiplierStore, multiplierSelectors } from '../../stores/multiplierStore'
import { getUpgradesByCategory } from '../../configs/upgrades'
import { getWorkersSorted } from '../../configs/workers'
import { UpgradeCategory } from '../../types/upgrades'
import { UpgradeCard } from '../UpgradeCard/UpgradeCard'
import { WorkerCard } from '../WorkerCard/WorkerCard'
import styles from './tabs.module.scss'

export const PassiveTab = memo(function PassiveTab() {
  // Получаем методы из gameStore
  const {
    getWorkerCount,
    getWorkerCost,
    isWorkerUnlocked,
    canAffordWorker,
    buyWorker,
    getUpgradeLevel,
    getUpgradeCost,
    isUpgradeUnlocked,
    canAffordUpgrade,
    buyUpgrade,
  } = useGameStore()

  // Получаем состояние из multiplierStore
  const { multipliers } = useMultiplierStore()

  const workers = useMemo(() => getWorkersSorted(), [])
  
  const passiveUpgrades = useMemo(() => 
    getUpgradesByCategory(UpgradeCategory.PASSIVE),
    []
  )
  
  const synergyUpgrades = useMemo(() => 
    getUpgradesByCategory(UpgradeCategory.SYNERGY),
    []
  )

  const workerDevotionSynergy = useMemo(() => 
    synergyUpgrades.filter(u => u.id === 'workerDevotion'),
    [synergyUpgrades]
  )

  const hasPassiveUpgrades = passiveUpgrades.some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock)
  const hasWorkerSynergy = workerDevotionSynergy.some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock)

  return (
    <div className={styles.passiveSection}>
      {/* Workers */}
      <div className={styles.categorySection}>
        <h3 className={styles.categoryTitle}>Воркеры</h3>
        {workers.map(config => {
          const count = getWorkerCount(config.id)
          const cost = getWorkerCost(config.id)
          const unlocked = isWorkerUnlocked(config.id)
          const canAfford = canAffordWorker(config.id)
          const workerMultiplier = multiplierSelectors.getWorkerMultiplier(multipliers, config.id)
          const cps = config.baseCps.mul(count).mul(workerMultiplier)
          
          // Get boost info
          const boostLevel = config.boostUpgradeId ? getUpgradeLevel(config.boostUpgradeId) : undefined
          const boostCost = config.boostUpgradeId ? getUpgradeCost(config.boostUpgradeId) : undefined
          const canAffordBoost = config.boostUpgradeId ? canAffordUpgrade(config.boostUpgradeId) : false
          
          // Pass the full worker multiplier (includes global + production + worker boost)
          const effectiveMultiplier = workerMultiplier.gt(1) ? workerMultiplier : undefined
          
          // Skip locked workers that shouldn't be shown
          if (!unlocked && !config.showBeforeUnlock) {
            return null
          }
          
          return (
            <WorkerCard
              key={config.id}
              config={config}
              count={count}
              cost={cost}
              cps={cps}
              canAfford={canAfford}
              isUnlocked={unlocked}
              onBuy={() => buyWorker(config.id)}
              boostLevel={boostLevel}
              boostCost={boostCost}
              canAffordBoost={canAffordBoost}
              onBuyBoost={config.boostUpgradeId ? () => buyUpgrade(config.boostUpgradeId!) : undefined}
              boostMultiplier={effectiveMultiplier}
            />
          )
        })}
      </div>
      
      {/* Passive upgrades */}
      {hasPassiveUpgrades && (
        <div className={styles.categorySection}>
          <h3 className={styles.categoryTitle}>Усиления производства</h3>
          {passiveUpgrades.map(config => {
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
      
      {/* Worker Synergies */}
      {hasWorkerSynergy && (
        <div className={styles.categorySection}>
          <h3 className={styles.categoryTitle}>⚡ Синергии</h3>
          {workerDevotionSynergy.map(config => {
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

