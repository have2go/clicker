import { useState, useEffect, useCallback, type RefObject } from 'react'

export type Tab = 'active' | 'passive' | 'global' | 'offline' | 'stats' | 'prestige'

interface UseBottomSheetGesturesProps {
  sheetRef: RefObject<HTMLDivElement | null>
  isSheetOpen: boolean
  onTabChange: (tab: Tab | null) => void
  onHapticFeedback?: () => void
}

interface UseBottomSheetGesturesReturn {
  isDragging: boolean
  hasDragged: boolean
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: (e: React.TouchEvent) => void
  handleMouseDown: (e: React.MouseEvent) => void
  handleHandleClick: (e: React.MouseEvent | React.TouchEvent) => void
}

export function useBottomSheetGestures({
  sheetRef,
  isSheetOpen,
  onTabChange,
}: UseBottomSheetGesturesProps): UseBottomSheetGesturesReturn {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)

  const handleGestureStart = useCallback((clientY: number, target: EventTarget | null) => {
    // Не начинаем драг если кликнули по табу
    if (target instanceof HTMLElement && target.closest('[data-tab-button]')) {
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
  }, [isDragging, dragStartY, isSheetOpen, sheetRef])

  const handleGestureEnd = useCallback((clientY: number) => {
    if (!isDragging || !sheetRef.current) return

    const deltaY = clientY - dragStartY
    const threshold = 100 // minimum drag distance to trigger state change

    // Reset transform
    sheetRef.current.style.transform = ''

    if (isSheetOpen && deltaY > threshold) {
      // Swiped down - close sheet
      onTabChange(null)
    } else if (!isSheetOpen && deltaY < -threshold) {
      // Swiped up - open sheet with first tab
      onTabChange('active')
    }

    setIsDragging(false)
    setDragStartY(0)
  }, [isDragging, dragStartY, isSheetOpen, onTabChange, sheetRef])

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
      onTabChange(null)
    } else {
      onTabChange('active')
    }
  }, [hasDragged, isSheetOpen, onTabChange])

  // Touch event handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    try {
      const touch = e.touches[0]
      if (touch) {
        handleGestureStart(touch.clientY, e.target)
      }
    } catch (error) {
      console.warn('[BottomSheetGestures] Touch start failed:', error)
    }
  }, [handleGestureStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    try {
      const touch = e.touches[0]
      if (touch) {
        handleGestureMove(touch.clientY)
      }
    } catch (error) {
      console.warn('[BottomSheetGestures] Touch move failed:', error)
    }
  }, [handleGestureMove])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    try {
      const touch = e.changedTouches[0]
      if (touch) {
        handleGestureEnd(touch.clientY)
      }
    } catch (error) {
      console.warn('[BottomSheetGestures] Touch end failed:', error)
    }
  }, [handleGestureEnd])

  // Mouse event handlers (for desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    try {
      handleGestureStart(e.clientY, e.target)
    } catch (error) {
      console.warn('[BottomSheetGestures] Mouse down failed:', error)
    }
  }, [handleGestureStart])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      try {
        handleGestureMove(e.clientY)
      } catch (error) {
        console.warn('[BottomSheetGestures] Mouse move failed:', error)
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      try {
        handleGestureEnd(e.clientY)
      } catch (error) {
        console.warn('[BottomSheetGestures] Mouse up failed:', error)
      }
    }

    try {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } catch (error) {
      console.warn('[BottomSheetGestures] Failed to add mouse listeners:', error)
    }

    return () => {
      try {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      } catch (error) {
        console.warn('[BottomSheetGestures] Failed to remove mouse listeners:', error)
      }
    }
  }, [isDragging, handleGestureMove, handleGestureEnd])

  return {
    isDragging,
    hasDragged,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleHandleClick,
  }
}

