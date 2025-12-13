import { hapticFeedback } from '@telegram-apps/sdk'
import { isTelegramEnvironment } from '../providers/TelegramProvider'
import { useEffect, useState } from 'react'

/**
 * Хук для использования тактильных вибраций Telegram
 * Автоматически проверяет доступность и окружение
 */
export function useTelegramHaptics() {
  const isTelegram = isTelegramEnvironment()
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    // Проверяем доступность после монтирования
    if (isTelegram && hapticFeedback.impactOccurred.isAvailable()) {
      setIsAvailable(true)
    }
  }, [isTelegram])

  return {
    // Легкая вибрация для обычных кликов
    light: () => {
      if (!isAvailable || !hapticFeedback.impactOccurred.isAvailable()) return
      try {
        hapticFeedback.impactOccurred('light')
      } catch (error) {
        console.warn('[Haptics] Light impact failed:', error)
      }
    },

    // Средняя вибрация для покупок
    medium: () => {
      if (!isAvailable || !hapticFeedback.impactOccurred.isAvailable()) return
      try {
        hapticFeedback.impactOccurred('medium')
      } catch (error) {
        console.warn('[Haptics] Medium impact failed:', error)
      }
    },

    // Тяжелая вибрация для важных действий
    heavy: () => {
      if (!isAvailable || !hapticFeedback.impactOccurred.isAvailable()) return
      try {
        hapticFeedback.impactOccurred('heavy')
      } catch (error) {
        console.warn('[Haptics] Heavy impact failed:', error)
      }
    },

    // Успешное действие
    success: () => {
      if (!isAvailable || !hapticFeedback.notificationOccurred.isAvailable()) return
      try {
        hapticFeedback.notificationOccurred('success')
      } catch (error) {
        console.warn('[Haptics] Success notification failed:', error)
      }
    },

    // Ошибка
    error: () => {
      if (!isAvailable || !hapticFeedback.notificationOccurred.isAvailable()) return
      try {
        hapticFeedback.notificationOccurred('error')
      } catch (error) {
        console.warn('[Haptics] Error notification failed:', error)
      }
    },

    // Предупреждение
    warning: () => {
      if (!isAvailable || !hapticFeedback.notificationOccurred.isAvailable()) return
      try {
        hapticFeedback.notificationOccurred('warning')
      } catch (error) {
        console.warn('[Haptics] Warning notification failed:', error)
      }
    },

    // Изменение выбора (для табов, переключателей)
    selectionChanged: () => {
      if (!isAvailable || !hapticFeedback.selectionChanged.isAvailable()) return
      try {
        hapticFeedback.selectionChanged()
      } catch (error) {
        console.warn('[Haptics] Selection changed failed:', error)
      }
    },
  }
}

