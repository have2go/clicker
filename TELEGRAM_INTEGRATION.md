# 🎮 Crystal Clicker - Telegram Mini App Integration

## ✅ Что реализовано

### 1. **Полная интеграция с Telegram SDK** 
- ✅ `@telegram-apps/sdk-react` установлен и настроен
- ✅ `TelegramProvider` для инициализации SDK
- ✅ Автоматическое определение окружения (Telegram/браузер)

### 2. **Нативный UX Telegram**

#### 🎨 Тема и цвета
- Автоматическая адаптация под светлую/темную тему пользователя
- Использование Telegram CSS переменных (`--tg-theme-*`)
- Корректное отображение в любой теме

#### 📳 Haptic Feedback (вибрация)
- **Light** - при клике на кристалл
- **Medium** - при покупке воркеров и апгрейдов
- **Success** - при успешном престиже
- **Error** - при неудачной попытке покупки
- **Warning** - предупреждение перед престижем
- **Selection Changed** - при переключении табов

#### 📱 Native Features
- **Viewport Expansion** - автоматическое разворачивание на полный экран
- **Closing Confirmation** - подтверждение перед закрытием (защита от потери прогресса)
- **Main Button** - нативная кнопка Telegram для престижа (показывается на вкладке престижа)
- **Header Colors** - кастомизация цвета шапки

### 3. **Кросс-платформенность**
- ✅ Полностью работает в браузере (fallback)
- ✅ Полностью работает в Telegram
- ✅ Graceful degradation при недоступности фич

## 📁 Структура интеграции

```
src/
├── providers/
│   └── TelegramProvider.tsx    # Инициализация SDK
├── hooks/
│   ├── useTelegramHaptics.ts   # Хук для вибраций
│   └── useTelegramMainButton.ts # Хук для главной кнопки
└── main.tsx                    # Подключение провайдера
```

## 🚀 Быстрый деплой

### 1. Билд приложения

```bash
npm run build
```

### 2. Деплой на Vercel (рекомендуется)

```bash
# Установите Vercel CLI
npm install -g vercel

# Деплой
vercel --prod
```

Или просто:
- Загрузите репозиторий на GitHub
- Подключите к Vercel через веб-интерфейс
- Vercel автоматически задеплоит

### 3. Создание Mini App в Telegram

1. Откройте [@BotFather](https://t.me/BotFather)
2. Создайте бота: `/newbot`
3. Создайте Mini App: `/newapp`
4. Укажите URL вашего деплоя (например: `https://your-app.vercel.app`)
5. Загрузите иконку 512x512px
6. Готово! Ваше приложение по ссылке: `https://t.me/your_bot/app_name`

## 🎯 Как это работает

### Haptic Feedback

```typescript
import { useTelegramHaptics } from './hooks/useTelegramHaptics'

function Component() {
  const haptics = useTelegramHaptics()
  
  const handleClick = () => {
    haptics.light() // Легкая вибрация
  }
  
  const handlePurchase = () => {
    haptics.medium() // Средняя вибрация
  }
}
```

### Main Button (для важных действий)

```typescript
import { useTelegramMainButton } from './hooks/useTelegramMainButton'

function Component() {
  useTelegramMainButton({
    text: 'Подтвердить',
    isVisible: true,
    isEnabled: canProceed,
    onClick: handleAction,
  })
}
```

### Проверка окружения

```typescript
import { isTelegramEnvironment } from './providers/TelegramProvider'

if (isTelegramEnvironment()) {
  // Код только для Telegram
}
```

## 🎨 Telegram Theme Variables

Приложение автоматически использует цвета:

| Переменная | Описание |
|------------|----------|
| `--tg-theme-bg-color` | Основной фон |
| `--tg-theme-text-color` | Основной текст |
| `--tg-theme-hint-color` | Вторичный текст |
| `--tg-theme-button-color` | Цвет кнопок |
| `--tg-theme-secondary-bg-color` | Вторичный фон |

Используйте их в CSS:

```css
.myCard {
  background: var(--tg-theme-secondary-bg-color);
  color: var(--tg-theme-text-color);
}
```

## 🧪 Тестирование локально

### В браузере:
```bash
npm run dev
# Откройте http://localhost:5173
```

### В Telegram (через туннель):

```bash
# В первом терминале
npm run dev

# Во втором терминале
ngrok http 5173

# Используйте HTTPS URL от ngrok в BotFather
```

## 📱 Особенности Telegram Web Apps

### Что работает:
- ✅ Haptic feedback (только на мобильных)
- ✅ Theme colors (везде)
- ✅ Main Button (везде)
- ✅ Viewport expansion (везде)
- ✅ Closing confirmation (везде)

### Ограничения:
- Haptic feedback не работает на десктопе (это норма)
- Требуется HTTPS (кроме localhost)
- Main Button показывается только в Telegram

## 🔧 Конфигурация

### vercel.json
Настроен для корректной работы SPA:
- Rewrite всех путей на `index.html`
- Правильные заголовки для кеширования
- Разрешение iframe для Telegram

### index.html
Мета-теги для Telegram:
```html
<meta name="telegram-web-app" content="yes" />
<meta name="viewport" content="viewport-fit=cover" />
```

## 📊 Производительность

- ⚡ Bundle size: ~309 KB (95 KB gzipped)
- ⚡ CSS: ~16 KB (3.4 KB gzipped)
- ⚡ RAF loop: 60+ FPS
- ⚡ First Paint: < 1s

## 🐛 Отладка

### В браузере:
Откройте DevTools Console - увидите логи SDK:
```
[Telegram] Initialization failed: ...
[Haptics] Light impact failed: ...
```

### В Telegram:
- Telegram Desktop: F12 для DevTools
- Telegram Mobile: используйте Eruda (добавьте в код)

```javascript
// Для mobile debugging
if (import.meta.env.DEV) {
  import('eruda').then(eruda => eruda.default.init())
}
```

## 📦 Зависимости

```json
{
  "@telegram-apps/sdk": "^3.x",
  "@telegram-apps/sdk-react": "^3.x"
}
```

## 🎓 Полезные ссылки

- [Telegram Mini Apps Docs](https://docs.telegram-mini-apps.com/)
- [SDK GitHub](https://github.com/telegram-mini-apps/telegram-apps)
- [BotFather](https://t.me/BotFather)
- [Мой деплой гайд](./TELEGRAM_DEPLOY.md)

## 🤝 Поддержка

Если что-то не работает:

1. Проверьте консоль браузера
2. Убедитесь что URL доступен по HTTPS
3. Проверьте настройки в BotFather
4. Telegram Web Apps требуют HTTPS (локально работает на localhost)

---

**Готово к деплою! 🚀**

Просто выполните `npm run build` и задеплойте `dist/` на любой хостинг.

