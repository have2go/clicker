import { memo, useRef } from 'react'
import { useBottomSheetGestures, type Tab } from '../../hooks/useBottomSheetGestures'
import styles from './BottomSheet.module.scss'

interface BottomSheetProps {
  activeTab: Tab | null
  onTabChange: (tab: Tab | null) => void
  onHapticFeedback?: () => void
  children: React.ReactNode
}

export const BottomSheet = memo(function BottomSheet({
  activeTab,
  onTabChange,
  onHapticFeedback,
  children,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const isSheetOpen = activeTab !== null

  const {
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleHandleClick,
  } = useBottomSheetGestures({
    sheetRef,
    isSheetOpen,
    onTabChange,
    onHapticFeedback,
  })

  const handleTabClick = (tab: Tab) => {
    onHapticFeedback?.()
    onTabChange(activeTab === tab ? null : tab)
  }

  return (
    <>
      {/* Bottom sheet overlay */}
      <div
        className={`${styles.sheetOverlay} ${isSheetOpen ? styles.sheetOverlayOpen : ''}`}
        onClick={() => onTabChange(null)}
        aria-hidden={!isSheetOpen}
      />

      {/* Bottom sheet */}
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
              data-tab-button
            >
              <span className={styles.tabIcon}>⚡</span>
              <span className={styles.tabText}> Клик</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'passive' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('passive')}
              data-tab-button
            >
              <span className={styles.tabIcon}>👷</span>
              <span className={styles.tabText}> Воркеры</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'global' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('global')}
              data-tab-button
            >
              <span className={styles.tabIcon}>🌟</span>
              <span className={styles.tabText}> Глобальные</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'offline' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('offline')}
              data-tab-button
            >
              <span className={styles.tabIcon}>💤</span>
              <span className={styles.tabText}> Offline</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'prestige' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('prestige')}
              data-tab-button
            >
              <span className={styles.tabIcon}>⭐</span>
              <span className={styles.tabText}> Престиж</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'stats' ? styles.tabActive : ''}`}
              onClick={() => handleTabClick('stats')}
              data-tab-button
            >
              <span className={styles.tabIcon}>📊</span>
              <span className={styles.tabText}> Инфо</span>
            </button>
          </div>
        </div>

        <div className={styles.sheetContent}>
          {children}
        </div>
      </div>
    </>
  )
})

