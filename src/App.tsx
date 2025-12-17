import { useState, useEffect, useMemo, useCallback } from 'react'
import { useGameStore } from './stores/gameStore'
import { useMultiplierStore, multiplierSelectors } from './stores/multiplierStore'
import { usePrestigeStore } from './stores/prestigeStore'
import { useGameLoop } from './hooks/useGameLoop'
import { useTelegramHaptics } from './hooks/useTelegramHaptics'
import { useTelegramMainButton } from './hooks/useTelegramMainButton'
import { formatNumber } from './utils/numberFormatter'
import { checkAndMigrate } from './utils/migration'
import { StatsPanel } from './components/StatsPanel/StatsPanel'
import { PrestigePanel } from './components/PrestigePanel/PrestigePanel'
import { DevPanel } from './components/DevPanel/DevPanel'
import { PerformanceOverlay } from './components/PerformanceOverlay'
import { BottomSheet } from './components/BottomSheet/BottomSheet'
import { ActiveTab } from './components/tabs/ActiveTab'
import { PassiveTab } from './components/tabs/PassiveTab'
import { GlobalTab } from './components/tabs/GlobalTab'
import { OfflineTab } from './components/tabs/OfflineTab'
import type { Tab } from './hooks/useBottomSheetGestures'
import styles from './App.module.scss'
import diamondImage from './assets/diamond.svg'

function App() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null)
  const [showPerformanceOverlay, setShowPerformanceOverlay] = useState(false)
  
  // Telegram haptic feedback
  const haptics = useTelegramHaptics()
  
  // Game state
  const {
    crystals,
    totalCrystalsEarned,
    totalCps,
    baseClickValue,
    totalClicks,
    click,
    recalculateStats,
    reset,
  } = useGameStore()
  
  // Multiplier state
  const { multipliers } = useMultiplierStore()
  
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
  const clickMultiplier = useMemo(() =>
    multiplierSelectors.getClickMultiplier(multipliers),
    [multipliers]
  )
  const productionMultiplier = useMemo(() =>
    multiplierSelectors.getProductionMultiplier(multipliers),
    [multipliers]
  )
  
  // Prestige reward calculation
  const canDoPrestige = useMemo(() => 
    canPrestige(totalCrystalsEarned), 
    [canPrestige, totalCrystalsEarned]
  )
  const prestigeReward = useMemo(() => 
    calculatePrestigeReward(totalCrystalsEarned),
    [calculatePrestigeReward, totalCrystalsEarned]
  )
  
  // Prestige handler (memoized to prevent unnecessary re-subscriptions in useTelegramMainButton)
  const handlePrestige = useCallback(() => {
    if (window.confirm('Вы уверены? Весь прогресс будет сброшен!')) {
      haptics.warning()
      performPrestige(totalCrystalsEarned, reset)
      haptics.success()
    }
  }, [haptics, performPrestige, totalCrystalsEarned, reset])
  
  // Telegram MainButton для престижа (показывается только на вкладке престижа)
  useTelegramMainButton({
    text: canDoPrestige 
      ? `🌟 Престиж (+${formatNumber(prestigeReward)})` 
      : '🌟 Престиж (недоступен)',
    isVisible: activeTab === 'prestige',
    isEnabled: canDoPrestige,
    onClick: handlePrestige,
  })
  
  // Click handler с тактильной обратной связью
  const handleClick = useCallback(() => {
    click()
    haptics.light()
  }, [click, haptics])
  

  const isSheetOpen = activeTab !== null

  return (
    <div className={`${styles.container} ${isSheetOpen ? styles.sheetOpen : ''}`}>
      {/* DEV Tools */}
      <DevPanel
        showPerformanceOverlay={showPerformanceOverlay}
        onTogglePerformanceOverlay={() => setShowPerformanceOverlay(!showPerformanceOverlay)}
      />

      {/* Performance Overlay */}
      <PerformanceOverlay isVisible={showPerformanceOverlay} />

      {/* Header: Crystal counter */}
      <div className={styles.crystalsStat}>
        <div className={styles.crystalsAmount}>
          💎 {formatNumber(crystals)} Cr
        </div>
      </div>
      {totalCps.gt(0) && (
        <div className={styles.cpsUnderHeader}>
          +{formatNumber(totalCps)} Cr/s
        </div>
      )}

      {/* Click button with CPS below */}
      <div className={styles.clickArea}>
        <button className={styles.clickButton} onClick={handleClick}>
          <img src={diamondImage} alt="Diamond" className={styles.diamondImage} />
        </button>
      </div>

      {/* Bottom sheet with tabs */}
      <BottomSheet
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onHapticFeedback={haptics.selectionChanged}
      >
        {activeTab === 'active' && (
          <ActiveTab />
        )}

        {activeTab === 'passive' && (
          <PassiveTab />
        )}

        {activeTab === 'global' && (
          <GlobalTab />
        )}

        {activeTab === 'offline' && (
          <OfflineTab />
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
      </BottomSheet>
    </div>
  )
}

export default App