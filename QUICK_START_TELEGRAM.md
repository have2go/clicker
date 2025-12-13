# 🚀 TELEGRAM INTEGRATION - QUICK START

## ✅ Что сделано

### 1. Установлен Telegram SDK
```bash
npm install @telegram-apps/sdk-react
```

### 2. Созданы компоненты интеграции

- **`TelegramProvider`** - провайдер для инициализации SDK
- **`useTelegramHaptics`** - хук для тактильной обратной связи
- **`useTelegramMainButton`** - хук для главной кнопки Telegram

### 3. Реализованные фичи

✅ **Автоматическая тема** - приложение адаптируется под тему Telegram  
✅ **Haptic feedback** - вибрация на все действия  
✅ **Viewport expansion** - полноэкранный режим  
✅ **Closing confirmation** - защита от потери прогресса  
✅ **Main Button** - нативная кнопка для престижа  
✅ **Работа в браузере** - fallback для обычного веб  

## 📦 Деплой в Telegram

### Шаг 1: Билд
```bash
npm run build
```

### Шаг 2: Деплой на Vercel
```bash
vercel --prod
```

Или через GitHub:
1. Загрузите код на GitHub
2. Подключите репозиторий к Vercel
3. Vercel автоматически задеплоит

### Шаг 3: Настройка в Telegram

1. Откройте [@BotFather](https://t.me/BotFather)
2. Команда: `/newbot` (создайте бота если нет)
3. Команда: `/newapp` (создайте Mini App)
4. Выберите бота
5. Введите название
6. Загрузите иконку 512x512
7. Вставьте URL деплоя (например: `https://your-app.vercel.app`)
8. Выберите короткое имя

Готово! Приложение доступно: `https://t.me/your_bot/app_name`

## 🧪 Локальное тестирование

### В браузере:
```bash
npm run dev
```
Откройте http://localhost:5173

### В Telegram (через ngrok):
```bash
# Терминал 1
npm run dev

# Терминал 2
npm install -g ngrok
ngrok http 5173

# Используйте HTTPS URL в BotFather
```

## 📁 Ключевые файлы

```
src/
├── providers/TelegramProvider.tsx   # SDK инициализация
├── hooks/
│   ├── useTelegramHaptics.ts       # Вибрации
│   └── useTelegramMainButton.ts    # Главная кнопка
├── main.tsx                         # Подключение провайдера
├── index.html                       # Telegram мета-теги
vercel.json                          # Конфиг деплоя
```

## 🎮 Интеграции в коде

### Haptic Feedback (вибрация)
```typescript
const haptics = useTelegramHaptics()

// Легкая вибрация (клик)
haptics.light()

// Средняя вибрация (покупка)
haptics.medium()

// Успех
haptics.success()

// Ошибка
haptics.error()
```

### Main Button (главная кнопка)
```typescript
useTelegramMainButton({
  text: 'Подтвердить',
  isVisible: true,
  isEnabled: canProceed,
  onClick: handleClick,
})
```

### Проверка окружения
```typescript
import { isTelegramEnvironment } from './providers/TelegramProvider'

if (isTelegramEnvironment()) {
  // Telegram-specific код
}
```

## 🎨 Telegram Theming

Приложение автоматически использует цвета темы:

```css
background: var(--tg-theme-bg-color);
color: var(--tg-theme-text-color);
```

Доступные переменные:
- `--tg-theme-bg-color` (фон)
- `--tg-theme-text-color` (текст)
- `--tg-theme-button-color` (кнопки)
- `--tg-theme-secondary-bg-color` (карточки)

## 📊 Производительность

- Bundle: 309 KB (95 KB gzipped) ✅
- CSS: 16 KB (3.4 KB gzipped) ✅
- FPS: 60+ ✅

## 📚 Документация

- **TELEGRAM_INTEGRATION.md** - полная документация интеграции
- **TELEGRAM_DEPLOY.md** - подробный гайд по деплою
- **ARCHITECTURE.md** - архитектура игры

## 🔗 Полезные ссылки

- [Telegram Mini Apps Docs](https://docs.telegram-mini-apps.com/)
- [BotFather](https://t.me/BotFather)
- [SDK GitHub](https://github.com/telegram-mini-apps/telegram-apps)

---

**Готово к запуску! 🎉**

Просто задеплойте и создайте Mini App в BotFather.

