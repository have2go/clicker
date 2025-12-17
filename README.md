# 💎 Crystal Clicker - Telegram Mini App

[![CI](https://github.com/your-username/crystal-clicker/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/crystal-clicker/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/your-username/crystal-clicker/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/crystal-clicker)

Idle-кликер игра с полной интеграцией Telegram Mini Apps.

## 🚀 Быстрый старт

### Локально
```bash
npm install
npm run dev
```

### Деплой в Telegram
```bash
npm run build
vercel --prod
```

Затем настройте Mini App в [@BotFather](https://t.me/BotFather):
```
/newapp
```

## ✨ Особенности

### 🎮 Игровые механики
- ⚡ Клик по кристаллу для заработка
- 👷 Воркеры (автоматическое производство)
- 🔧 Апгрейды (усиления клика и производства)
- 🌟 Престиж система с постоянными бонусами
- 💾 Автосохранение каждые 30 секунд
- ⏱ Оффлайн прогресс

### 📱 Telegram интеграция
- ✅ **Адаптивная тема** - автоматически под настройки пользователя
- ✅ **Haptic feedback** - вибрация на все действия
- ✅ **Viewport expansion** - полноэкранный режим
- ✅ **Closing confirmation** - защита от случайного закрытия
- ✅ **Main Button** - нативная кнопка Telegram
- ✅ **Кросс-платформа** - работает и в браузере

## 📦 Технологии

- **React 18** + TypeScript
- **Zustand** - state management
- **@telegram-apps/sdk** - Telegram интеграция
- **break_infinity.js** - большие числа
- **Vite** - сборка
- **SCSS Modules** - стили

## 📁 Структура

```
src/
├── components/      # React компоненты
├── configs/         # Игровые конфиги (воркеры, апгрейды)
├── stores/          # Zustand stores
├── hooks/           # Custom hooks
├── providers/       # Telegram provider
├── types/           # TypeScript types
└── utils/           # Утилиты
```

## 📚 Документация

- **[QUICK_START_TELEGRAM.md](QUICK_START_TELEGRAM.md)** - быстрый старт
- **[TELEGRAM_INTEGRATION.md](TELEGRAM_INTEGRATION.md)** - детали интеграции
- **[TELEGRAM_DEPLOY.md](TELEGRAM_DEPLOY.md)** - гайд по деплою
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - архитектура проекта

## 🎯 Команды

```bash
npm run dev      # Локальный сервер
npm run build    # Продакшн билд
npm run preview  # Превью билда
```

## 🔧 Конфигурация

### Добавить воркера
Отредактируйте `src/configs/workers.ts`

### Добавить апгрейд
Отредактируйте `src/configs/upgrades.ts`

### Настроить престиж
Отредактируйте `src/configs/prestige.ts`

## 🌐 Деплой

### Vercel (рекомендуется)
```bash
vercel --prod
```

### GitHub Pages / Netlify / Cloudflare
Просто задеплойте папку `dist/` после `npm run build`

## 🧪 Тестирование

### Запуск тестов
```bash
# Все тесты
npm test

# С покрытием
npm run test:coverage

# В режиме наблюдения
npm run test:watch
```

### Структура тестов
- `src/__tests__/` - интеграционные тесты
- `src/**/__tests__/` - unit тесты для компонентов и утилит
- `coverage/` - отчёт о покрытии кода

### CI/CD
- Автоматический запуск тестов при push/PR
- Проверка на Node.js 18.x и 20.x
- Отчёт о покрытии в Codecov

## 🐛 Отладка

- Откройте DevTools Console для логов
- Telegram Desktop: F12
- Проверьте `vercel.json` для настроек

## 📄 Лицензия

MIT

## 🙏 Благодарности

- [Telegram Mini Apps](https://docs.telegram-mini-apps.com/)
- [break_infinity.js](https://github.com/Patashu/break_infinity.js)

---

**Готово к игре! 🎮**

Запустите локально или задеплойте в Telegram.
