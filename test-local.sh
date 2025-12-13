#!/bin/bash

# Скрипт для локального тестирования Telegram Mini App

echo "🚀 Запуск локального сервера для тестирования..."
echo ""

# Проверяем установлен ли npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не найден. Установите Node.js"
    exit 1
fi

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости..."
    npm install
fi

# Запускаем dev сервер
echo "✅ Запускаем dev сервер на http://localhost:5173"
echo ""
echo "📱 Для тестирования в Telegram:"
echo "1. Установите ngrok: npm install -g ngrok"
echo "2. В новом терминале: ngrok http 5173"
echo "3. Используйте HTTPS URL от ngrok в BotFather"
echo ""
echo "🌐 Для тестирования в браузере:"
echo "   Откройте http://localhost:5173"
echo ""

npm run dev

