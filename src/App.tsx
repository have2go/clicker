import { useState, useEffect, useMemo } from 'react'
import { useGameStore } from './stores/gameStore'
import { useMultiplierStore } from './stores/multiplierStore'
import { usePrestigeStore } from './stores/prestigeStore'
import { useGameLoop } from './hooks/useGameLoop'
import { formatNumber } from './utils/numberFormatter'
import { checkAndMigrate } from './utils/migration'
import { getUpgradesByCategory } from './configs/upgrades'
import { getWorkersSorted } from './configs/workers'
import { UpgradeCategory } from './types/upgrades'
import { UpgradeCard } from './components/UpgradeCard'
import { WorkerCard } from './components/WorkerCard'
import { StatsPanel } from './components/StatsPanel'
import { PrestigePanel } from './components/PrestigePanel'
import styles from './App.module.scss'
import diamondImage from './assets/diamond.svg'

const DEV_MODE = true

type Tab = 'active' | 'passive' | 'stats' | 'prestige'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('active')
  
  // Game state
  const {
    crystals,
    totalCrystalsEarned,
    totalCps,
    baseClickValue,
    totalClicks,
    click,
    buyWorker,
    buyUpgrade,
    getWorkerCount,
    getWorkerCost,
    getUpgradeLevel,
    getUpgradeCost,
    isWorkerUnlocked,
    isUpgradeUnlocked,
    canAffordWorker,
    canAffordUpgrade,
    recalculateStats,
    reset,
  } = useGameStore()
  
  // Multiplier state
  const {
    getClickMultiplier,
    getProductionMultiplier,
    getWorkerMultiplier,
  } = useMultiplierStore()
  
  // Prestige state
  const {
    level: prestigeLevel,
    currency: prestigeCurrency,
    canPrestige,
    calculatePrestigeReward,
    performPrestige,
    buyPrestigeUpgrade,
    getUpgradeLevel: getPrestigeUpgradeLevel,
    canAffordUpgrade: canAffordPrestigeUpgrade,
  } = usePrestigeStore()
  
  // Start game loop
  useGameLoop()
  
  // Check for migrations on mount
  useEffect(() => {
    const migrated = checkAndMigrate()
    if (migrated) {
      console.log('[App] Migration detected, reloading state')
      recalculateStats()
    }
  }, [recalculateStats])
  
  // Get multipliers
  const clickMultiplier = useMemo(() => getClickMultiplier(), [getClickMultiplier])
  const productionMultiplier = useMemo(() => getProductionMultiplier(), [getProductionMultiplier])
  
  // Prestige reward calculation
  const canDoPrestige = useMemo(() => 
    canPrestige(totalCrystalsEarned), 
    [canPrestige, totalCrystalsEarned]
  )
  const prestigeReward = useMemo(() => 
    calculatePrestigeReward(totalCrystalsEarned),
    [calculatePrestigeReward, totalCrystalsEarned]
  )
  
  // Prestige handler
  const handlePrestige = () => {
    if (window.confirm('Вы уверены? Весь прогресс будет сброшен!')) {
      performPrestige(totalCrystalsEarned, reset)
    }
  }
  
  // Get upgrades and workers
  const activeUpgrades = useMemo(() => 
    getUpgradesByCategory(UpgradeCategory.ACTIVE),
    []
  )
  
  const passiveUpgrades = useMemo(() => 
    getUpgradesByCategory(UpgradeCategory.PASSIVE),
    []
  )
  
  const utilityUpgrades = useMemo(() => 
    getUpgradesByCategory(UpgradeCategory.UTILITY),
    []
  )
  
  const workers = useMemo(() => getWorkersSorted(), [])

  return (
    <div className={styles.container}>
      {/* Header: Crystal counter */}
      <div className={styles.crystalsStat}>
        <div className={styles.crystalsAmount}>
          💎 {formatNumber(crystals)} Cr
        </div>
        {totalCps.gt(0) && (
          <div className={styles.cpsDisplay}>
            +{formatNumber(totalCps)} Cr/s
          </div>
        )}
        {DEV_MODE && (
          <button 
            className={styles.resetButton} 
            onClick={reset} 
            title="Сбросить игру (только для разработки)"
          >
            🔄
          </button>
        )}
      </div>

      {/* Click button */}
      <button className={styles.clickButton} onClick={click}>
        <img src={diamondImage} alt="Diamond" className={styles.diamondImage} />
      </button>

      {/* Tab navigation */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'active' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('active')}
        >
          ⚡ Активные
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'passive' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('passive')}
        >
          👷 Пассивные
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'prestige' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('prestige')}
        >
          🌟 Престиж
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'stats' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Инфо
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'active' && (
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
                  />
                )
              })}
            </div>
            
            {/* Utility upgrades */}
            {utilityUpgrades.some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock) && (
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
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'passive' && (
          <div className={styles.passiveSection}>
            {/* Workers */}
            <div className={styles.categorySection}>
              <h3 className={styles.categoryTitle}>Воркеры</h3>
              {workers.map(config => {
                const count = getWorkerCount(config.id)
                const cost = getWorkerCost(config.id)
                const unlocked = isWorkerUnlocked(config.id)
                const canAfford = canAffordWorker(config.id)
                const workerMultiplier = getWorkerMultiplier(config.id)
                const cps = config.baseCps.mul(count).mul(workerMultiplier)
                
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
                  />
                )
              })}
            </div>
            
            {/* Passive upgrades */}
            {passiveUpgrades.some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock) && (
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
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'prestige' && (
          <PrestigePanel
            totalCrystalsEarned={totalCrystalsEarned}
            prestigeLevel={prestigeLevel}
            prestigeCurrency={prestigeCurrency}
            canPrestige={canDoPrestige}
            prestigeReward={prestigeReward}
            onPrestige={handlePrestige}
            onBuyUpgrade={buyPrestigeUpgrade}
            getUpgradeLevel={getPrestigeUpgradeLevel}
            canAffordUpgrade={canAffordPrestigeUpgrade}
          />
        )}

        {activeTab === 'stats' && (
          <StatsPanel
            totalCrystalsEarned={totalCrystalsEarned}
            totalCps={totalCps}
            baseClickValue={baseClickValue}
            clickMultiplier={clickMultiplier}
            productionMultiplier={productionMultiplier}
            totalClicks={totalClicks}
          />
        )}
      </div>
    </div>
  )
}

export default App
