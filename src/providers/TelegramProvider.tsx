import { type ReactNode, useEffect } from 'react'
import { init, miniApp, themeParams, viewport, closingBehavior } from '@telegram-apps/sdk'

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
        miniApp.setHeaderColor('bg_color')
      }

      // Уведомляем что готовы
      if (miniApp.ready.isAvailable()) {
        miniApp.ready()
      }

      console.log('[Telegram] SDK initialized successfully')

      return () => {
        cleanup()
        if (closingBehavior.disableConfirmation.isAvailable()) {
          closingBehavior.disableConfirmation()
        }
      }
    } catch (error) {
      console.warn('[Telegram] Initialization failed (running in browser mode):', error)
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
