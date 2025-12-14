import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useGameStore } from './stores/gameStore'
import { useMultiplierStore } from './stores/multiplierStore'
import { usePrestigeStore } from './stores/prestigeStore'
import { useGameLoop } from './hooks/useGameLoop'
import { useTelegramHaptics } from './hooks/useTelegramHaptics'
import { useTelegramMainButton } from './hooks/useTelegramMainButton'
import { formatNumber } from './utils/numberFormatter'
import { checkAndMigrate } from './utils/migration'
import { getUpgradesByCategory } from './configs/upgrades'
import { getWorkersSorted } from './configs/workers'
import { UpgradeCategory } from './types/upgrades'
import { UpgradeCard } from './components/UpgradeCard'
import { WorkerCard } from './components/WorkerCard'
import { StatsPanel } from './components/StatsPanel'
import { PrestigePanel } from './components/PrestigePanel'
import { DevPanel } from './components/DevPanel'
import styles from './App.module.scss'
import diamondImage from './assets/diamond.svg'

type Tab = 'active' | 'passive' | 'global' | 'offline' | 'stats' | 'prestige'

function App() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  
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
  
  // Wrapped buy functions с haptics (memoized to prevent unnecessary re-renders of child components)
  const handleBuyWorker = useCallback((workerId: string) => {
    const canBuy = canAffordWorker(workerId)
    if (canBuy) {
      buyWorker(workerId)
      haptics.medium()
    } else {
      haptics.error()
    }
  }, [canAffordWorker, buyWorker, haptics])
  
  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    const canBuy = canAffordUpgrade(upgradeId)
    if (canBuy) {
      buyUpgrade(upgradeId)
      haptics.medium()
    } else {
      haptics.error()
    }
  }, [canAffordUpgrade, buyUpgrade, haptics])
  
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
  
  const globalUpgrades = useMemo(() => 
    getUpgradesByCategory(UpgradeCategory.GLOBAL),
    []
  )
  
  const offlineUpgrades = useMemo(() => 
    getUpgradesByCategory(UpgradeCategory.OFFLINE),
    []
  )
  
  const synergyUpgrades = useMemo(() => 
    getUpgradesByCategory(UpgradeCategory.SYNERGY),
    []
  )
  
  const workers = useMemo(() => getWorkersSorted(), [])

  const isSheetOpen = activeTab !== null

  const handleTabClick = useCallback((tab: Tab) => {
    haptics.selectionChanged()
    setActiveTab(prev => (prev === tab ? null : tab))
  }, [haptics])

  // Gesture handlers for bottom sheet (memoized to prevent unnecessary re-creation)
  const handleGestureStart = useCallback((clientY: number, target: EventTarget | null) => {
    // Не начинаем драг если кликнули по табу
    if (target instanceof HTMLElement && target.closest(`.${styles.tab}`)) {
      return
    }
    
    setIsDragging(true)
    setDragStartY(clientY)
    setHasDragged(false)
  }, [])

  const handleGestureMove = useCallback((clientY: number) => {
    if (!isDragging || !sheetRef.current) return

    const deltaY = clientY - dragStartY
    
    // Отмечаем, что был драг, если движение больше 5px
    if (Math.abs(deltaY) > 5) {
      setHasDragged(true)
    }
    
    // Only allow dragging within reasonable bounds
    if (isSheetOpen && deltaY > 0) {
      // Dragging down when open
      const clampedDelta = Math.min(deltaY, 300)
      sheetRef.current.style.transform = `translate(-50%, ${clampedDelta}px)`
    } else if (!isSheetOpen && deltaY < 0) {
      // Dragging up when closed
      const clampedDelta = Math.max(deltaY, -300)
      sheetRef.current.style.transform = `translate(-50%, calc(100% - var(--sheet-peek) + ${clampedDelta}px))`
    }
  }, [isDragging, dragStartY, isSheetOpen])

  const handleGestureEnd = useCallback((clientY: number) => {
    if (!isDragging || !sheetRef.current) return

    const deltaY = clientY - dragStartY
    const threshold = 100 // minimum drag distance to trigger state change

    // Reset transform
    sheetRef.current.style.transform = ''

    if (isSheetOpen && deltaY > threshold) {
      // Swiped down - close sheet
      setActiveTab(null)
    } else if (!isSheetOpen && deltaY < -threshold) {
      // Swiped up - open sheet with first tab
      setActiveTab('active')
    }

    setIsDragging(false)
    setDragStartY(0)
  }, [isDragging, dragStartY, isSheetOpen])

  // Handle click on handle (tap to toggle)
  const handleHandleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Не обрабатываем клик если был драг
    if (hasDragged) {
      setHasDragged(false)
      return
    }

    e.stopPropagation() // Предотвращаем всплытие к header

    // Toggle sheet
    if (isSheetOpen) {
      setActiveTab(null)
    } else {
      setActiveTab('active')
    }
  }, [hasDragged, isSheetOpen])

  // Touch event handlers (memoized)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      handleGestureStart(touch.clientY, e.target)
    }
  }, [handleGestureStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (touch) {
      handleGestureMove(touch.clientY)
    }
  }, [handleGestureMove])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    if (touch) {
      handleGestureEnd(touch.clientY)
    }
  }, [handleGestureEnd])

  // Mouse event handlers (for desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    handleGestureStart(e.clientY, e.target)
  }, [handleGestureStart])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleGestureMove(e.clientY)
    }

    const handleMouseUp = (e: MouseEvent) => {
      handleGestureEnd(e.clientY)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleGestureMove, handleGestureEnd])

  return (
    <div className={`${styles.container} ${isSheetOpen ? styles.sheetOpen : ''}`}>
      {/* DEV Tools */}
      <DevPanel />
      
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

      {/* Bottom sheet overlay */}
      <div
        className={`${styles.sheetOverlay} ${isSheetOpen ? styles.sheetOverlayOpen : ''}`}
        onClick={() => setActiveTab(null)}
        aria-hidden={!isSheetOpen}
      />

      {/* Bottom sheet (tabs are the header, content slides up) */}
      <div
        ref={sheetRef}
        className={`${styles.bottomSheet} ${isSheetOpen ? styles.bottomSheetOpen : ''} ${isDragging ? styles.bottomSheetDragging : ''}`}
        role="dialog"
        aria-label="Меню"
        aria-hidden={!isSheetOpen}
      >
        <div 
          className={styles.sheetHeader}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div 
            className={styles.sheetHandle}
            onClick={handleHandleClick}
          />

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'active' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('active')}
            >
              <span className={styles.tabIcon}>⚡</span>
              <span className={styles.tabText}> Клик</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'passive' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('passive')}
            >
              <span className={styles.tabIcon}>👷</span>
              <span className={styles.tabText}> Воркеры</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'global' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('global')}
            >
              <span className={styles.tabIcon}>🌟</span>
              <span className={styles.tabText}> Глобальные</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'offline' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('offline')}
            >
              <span className={styles.tabIcon}>💤</span>
              <span className={styles.tabText}> Offline</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'prestige' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('prestige')}
            >
              <span className={styles.tabIcon}>⭐</span>
              <span className={styles.tabText}> Престиж</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'stats' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('stats')}
            >
              <span className={styles.tabIcon}>📊</span>
              <span className={styles.tabText}> Инфо</span>
            </button>
          </div>
        </div>

        <div className={styles.sheetContent}>
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
                      onBuy={() => handleBuyUpgrade(config.id)}
                      isUpgradeUnlocked={isUpgradeUnlocked}
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
                      onBuy={() => handleBuyUpgrade(config.id)}
                      isUpgradeUnlocked={isUpgradeUnlocked}
                      />
                    )
                  })}
                </div>
              )}
              
              {/* Click Synergies */}
              {synergyUpgrades.filter(u => u.id === 'clickResonance').some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock) && (
                <div className={styles.categorySection}>
                  <h3 className={styles.categoryTitle}>⚡ Синергии</h3>
                  {synergyUpgrades.filter(u => u.id === 'clickResonance').map(config => {
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
                        onBuy={() => handleBuyUpgrade(config.id)}
                        isUpgradeUnlocked={isUpgradeUnlocked}
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
                      onBuy={() => handleBuyWorker(config.id)}
                      boostLevel={boostLevel}
                      boostCost={boostCost}
                      canAffordBoost={canAffordBoost}
                      onBuyBoost={config.boostUpgradeId ? () => handleBuyUpgrade(config.boostUpgradeId!) : undefined}
                      boostMultiplier={effectiveMultiplier}
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
                      onBuy={() => handleBuyUpgrade(config.id)}
                      isUpgradeUnlocked={isUpgradeUnlocked}
                      />
                    )
                  })}
                </div>
              )}
              
              {/* Worker Synergies */}
              {synergyUpgrades.filter(u => u.id === 'workerDevotion').some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock) && (
                <div className={styles.categorySection}>
                  <h3 className={styles.categoryTitle}>⚡ Синергии</h3>
                  {synergyUpgrades.filter(u => u.id === 'workerDevotion').map(config => {
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
                        onBuy={() => handleBuyUpgrade(config.id)}
                        isUpgradeUnlocked={isUpgradeUnlocked}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'global' && (
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
                      onBuy={() => handleBuyUpgrade(config.id)}
                      isUpgradeUnlocked={isUpgradeUnlocked}
                    />
                  )
                })}
              </div>
              
              {/* Global Synergies */}
              {synergyUpgrades.filter(u => u.id === 'thematicPulse').some(u => isUpgradeUnlocked(u.id) || u.showBeforeUnlock) && (
                <div className={styles.categorySection}>
                  <h3 className={styles.categoryTitle}>⚡ Синергии</h3>
                  {synergyUpgrades.filter(u => u.id === 'thematicPulse').map(config => {
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
                        onBuy={() => handleBuyUpgrade(config.id)}
                        isUpgradeUnlocked={isUpgradeUnlocked}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'offline' && (
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
                      onBuy={() => handleBuyUpgrade(config.id)}
                      isUpgradeUnlocked={isUpgradeUnlocked}
                    />
                  )
                })}
              </div>
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
    </div>
  )
}

export default App