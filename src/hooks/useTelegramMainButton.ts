import { mainButton } from '@telegram-apps/sdk'
import { useEffect } from 'react'
import { isTelegramEnvironment } from '../providers/TelegramProvider'

interface UseTelegramMainButtonOptions {
  text: string
  isVisible: boolean
  isEnabled: boolean
  onClick: () => void
}

/**
 * Хук для управления главной кнопкой Telegram
 * Показывается внизу приложения в Telegram
 */
export function useTelegramMainButton(options: UseTelegramMainButtonOptions) {
  const isTelegram = isTelegramEnvironment()
  const { text, isVisible, isEnabled, onClick } = options

  useEffect(() => {
    if (!isTelegram) return

    let cleanup: (() => void) | undefined

    try {
      // Монтируем кнопку если еще не смонтирована
      if (mainButton.mount.isAvailable()) {
        mainButton.mount()
      }

      // Устанавливаем параметры кнопки
      if (mainButton.setParams.isAvailable()) {
        mainButton.setParams({
          text,
          isVisible,
          isEnabled,
          backgroundColor: '#2ea6ff',
          textColor: '#ffffff',
        })
      }

      // Подписываемся на клики
      if (mainButton.onClick.isAvailable()) {
        cleanup = mainButton.onClick(onClick)
      }
    } catch (error) {
      console.warn('[MainButton] Setup failed:', error)
    }

    return cleanup
  }, [isTelegram, text, isVisible, isEnabled, onClick])
}

