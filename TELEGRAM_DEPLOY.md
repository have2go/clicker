# 🎮 Clicker Game - Telegram Mini App

Idle-кликер игра с полной интеграцией с Telegram Mini Apps.

## 🚀 Деплой в Telegram

### 1. Подготовка билда

```bash
npm run build
```

Это создаст оптимизированную версию в папке `dist/`.

### 2. Хостинг

Разместите содержимое папки `dist/` на любом из:

- **GitHub Pages** (бесплатно)
- **Vercel** (бесплатно, рекомендуется)
- **Netlify** (бесплатно)
- **Cloudflare Pages** (бесплатно)

#### Пример с Vercel:

```bash
npm install -g vercel
vercel --prod
```

### 3. Создание бота

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Создайте бота командой `/newbot`
3. Следуйте инструкциям (имя и username)
4. Получите токен бота

### 4. Настройка Mini App

В [@BotFather](https://t.me/BotFather):

```
/newapp
```

- Выберите вашего бота
- Введите название приложения
- Введите описание
- Загрузите иконку (512x512 px)
- Введите URL вашего хостинга (например: `https://your-app.vercel.app`)
- Выберите короткое имя (будет в ссылке)

### 5. Запуск

Ваше приложение доступно по ссылке:
```
https://t.me/your_bot_username/your_short_name
```

## 🎯 Интегрированные фичи Telegram

### ✅ Реализовано

- **🎨 Автоматическая тема** - приложение адаптируется под светлую/темную тему Telegram
- **📳 Haptic Feedback** - тактильная обратная связь:
  - Легкая вибрация при клике на кристалл
  - Средняя вибрация при покупках
  - Вибрация успеха/ошибки для действий
  - Вибрация при смене табов
- **📱 Viewport Expansion** - автоматическое разворачивание на полный экран
- **⚠️ Closing Confirmation** - подтверждение перед закрытием (защита от потери прогресса)
- **🎨 CSS Variables** - использование цветов темы Telegram
- **🌐 Работа в браузере** - полностью функционально и вне Telegram

### 🎨 Telegram Theme Variables

Приложение автоматически использует цвета из темы пользователя:

```css
--tg-theme-bg-color           /* Основной фон */
--tg-theme-text-color         /* Основной текст */
--tg-theme-hint-color         /* Вторичный текст */
--tg-theme-link-color         /* Ссылки */
--tg-theme-button-color       /* Кнопки */
--tg-theme-button-text-color  /* Текст кнопок */
--tg-theme-secondary-bg-color /* Вторичный фон */
```

## 🛠 Разработка

### Локальный запуск

```bash
npm install
npm run dev
```

### Тестирование в Telegram

Для тестирования в процессе разработки используйте ngrok или локальный туннель:

```bash
# Установка ngrok
npm install -g ngrok

# Запуск туннеля (в отдельном терминале)
ngrok http 5173

# Используйте предоставленный URL в BotFather
```

### Проверка окружения

Приложение автоматически определяет, запущено ли оно в Telegram:

```typescript
import { isTelegramEnvironment } from './providers/TelegramProvider'

if (isTelegramEnvironment()) {
  // Код для Telegram
}
```

## 📦 Технологии

- **React 18** + TypeScript
- **Zustand** - state management
- **@telegram-apps/sdk-react** - официальный SDK Telegram
- **break_infinity.js** - работа с большими числами
- **Vite** - сборка и dev server
- **SCSS Modules** - стили

## 🎮 Игровые фичи

- ⚡ Клик по кристаллу
- 👷 Воркеры (автоматическое производство)
- 🔧 Апгрейды (усиления клика и производства)
- 🌟 Престиж система (сброс с бонусами)
- 💾 Автосохранение (каждые 30 сек)
- ⏱ Оффлайн прогресс (начисление за время отсутствия)
- 📊 Детальная статистика

## 📱 Рекомендации для Telegram

### Производительность

- RAF loop работает на частоте экрана (60-240 FPS)
- Мемоизация компонентов для плавности
- CSS animations с `will-change` для GPU ускорения

### UX в Telegram

- Все интерактивные элементы > 44px для удобства тапов
- Haptic feedback на все важные действия
- Адаптивная тема под настройки пользователя
- Safe area insets для вырезов экранов
- Защита от случайного закрытия

### Отладка

В режиме разработки SDK выводит логи в консоль:

```typescript
<SDKProvider debug>
```

## 📄 Лицензия

MIT

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь что URL доступен по HTTPS
3. Проверьте что все настройки в BotFather корректны
4. Telegram Mini Apps работают только на HTTPS (кроме localhost)

## 🔗 Полезные ссылки

- [Telegram Mini Apps Documentation](https://docs.telegram-mini-apps.com/)
- [Telegram SDK GitHub](https://github.com/telegram-mini-apps/telegram-apps)
- [BotFather](https://t.me/BotFather)

