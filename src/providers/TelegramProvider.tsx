import { type ReactNode, useEffect } from 'react'
import { init, miniApp, themeParams, viewport, closingBehavior } from '@telegram-apps/sdk'

// Типы ошибок
interface TelegramInitError {
  type: 'sdk_init_failed' | 'component_mount_failed' | 'configuration_failed'
  message: string
  originalError?: unknown
}

// Константы для Telegram SDK
const TELEGRAM_CONFIG = {
  headerColor: 'bg_color',
  logPrefix: '[Telegram]',
} as const

// Флаг для отладочного логирования
const DEV_MODE = import.meta.env.DEV

/**
 * Создает структурированную ошибку инициализации Telegram SDK
 */
function createTelegramError(
  type: TelegramInitError['type'],
  message: string,
  originalError?: unknown
): TelegramInitError {
  return { type, message, originalError }
}

/**
 * Provider для интеграции с Telegram Mini Apps
 * Оборачивает приложение и предоставляет доступ к Telegram SDK
 */
export function TelegramProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Инициализируем SDK
    try {
      const cleanup = init({ acceptCustomStyles: true })
      
      // Монтируем компоненты
      if (miniApp.mount.isAvailable()) miniApp.mount()
      if (themeParams.mount.isAvailable()) themeParams.mount()
      if (viewport.mount.isAvailable()) viewport.mount()
      if (closingBehavior.mount.isAvailable()) closingBehavior.mount()

      // Настраиваем viewport
      if (viewport.expand.isAvailable()) {
        viewport.expand()
      }

      // Включаем подтверждение закрытия
      if (closingBehavior.enableConfirmation.isAvailable()) {
        closingBehavior.enableConfirmation()
      }

      // Настраиваем цвета
      if (miniApp.setHeaderColor.isAvailable()) {
        miniApp.setHeaderColor(TELEGRAM_CONFIG.headerColor)
      }

      // Уведомляем что готовы
      if (miniApp.ready.isAvailable()) {
        miniApp.ready()
      }

      if (DEV_MODE) {
        console.log(`${TELEGRAM_CONFIG.logPrefix} SDK initialized successfully`)
      }

      return () => {
        cleanup()
        if (closingBehavior.disableConfirmation.isAvailable()) {
          closingBehavior.disableConfirmation()
        }
      }
    } catch (error) {
      const telegramError = createTelegramError(
        'sdk_init_failed',
        'Failed to initialize Telegram SDK, falling back to browser mode',
        error
      )

      if (DEV_MODE) {
        console.warn(`${TELEGRAM_CONFIG.logPrefix} ${telegramError.message}:`, telegramError.originalError)
      }
    }
  }, [])

  return <>{children}</>
}

/**
 * Проверка, запущено ли приложение в Telegram
 */
export function isTelegramEnvironment(): boolean {
  return (
    typeof window !== 'undefined' &&
    (window.location.search.includes('tgWebAppData') ||
      window.location.hash.includes('tgWebAppData') ||
      // @ts-expect-error - Telegram WebApp может быть определён глобально
      typeof window.Telegram?.WebApp !== 'undefined')
  )
}
