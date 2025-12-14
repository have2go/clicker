# Экономический баланс игры

Эта папка содержит **только экономические параметры** игры, отделённые от контента.

## Структура

### 📊 `balance.ts`
Главный файл с **всеми числами** игры:
- **Воркеры**: цены, CPS, рост, требования разблокировки
- **Апгрейды**: цены, эффекты, формулы прогрессии
- **Престиж**: формулы наград, множители
- **Константы**: базовые параметры игры

### 📈 `progression.md`
Анализ прогрессии и балансировки:
- Таблицы стоимости на разных уровнях
- Анализ соотношения цена/производство
- Временные метки прохождения
- Рекомендации по балансу

### 🔧 `index.ts`
Удобный экспорт всех экономических данных.

## Зачем это нужно?

### ✅ Преимущества разделения

1. **Анализ баланса**
   ```typescript
   // Легко найти все цены и множители
   import { WORKERS_ECONOMY, UPGRADES_ECONOMY } from './economy'
   ```

2. **Быстрые изменения**
   ```typescript
   // Изменить баланс = изменить одно число в balance.ts
   // Не нужно искать по всем файлам!
   ```

3. **A/B тестирование**
   ```typescript
   // Можно создать balance_v2.ts и быстро переключаться
   import { WORKERS_ECONOMY } from './economy/balance_v2'
   ```

4. **Экспорт для анализа**
   ```typescript
   import { exportBalanceForAnalysis } from './economy'
   // Экспорт в JSON для Excel/Google Sheets
   ```

## Использование

### Контентные файлы используют экономику

**workers.ts** (контент):
```typescript
import { WORKERS_ECONOMY } from './economy/balance'

export const WORKERS = {
  basic: {
    name: 'Рабочий',      // Контент
    icon: '👷',           // Контент
    ...WORKERS_ECONOMY.basic  // Экономика
  }
}
```

**Результат**: Все экономические параметры в одном месте!

### Анализ прогрессии

```typescript
import { 
  calculateWorkerCostToLevel,
  calculateUpgradeCostToLevel,
} from './economy'

// Сколько стоит прокачать basic воркера с 1 до 100?
const cost = calculateWorkerCostToLevel('basic', 1, 100)
console.log(cost.toString()) // "~140,000"

// Какой эффект даёт 10 уровень clickMultiplier?
const effect = getUpgradeEffectAtLevel('clickMultiplier', 10)
console.log(effect.toString()) // "9.31" (x9.31 множитель)
```

### Экспорт для аналитики

```typescript
import { exportBalanceForAnalysis } from './economy'

// Получить все данные в JSON-friendly формате
const data = exportBalanceForAnalysis()

// Пример структуры:
{
  workers: [
    {
      id: 'basic',
      baseCost: '25',
      costGrowth: 1.15,
      baseCps: '0.1',
      cost_level_10: '91.33',
      cost_level_50: '1636.65',
    },
    // ...
  ],
  upgrades: [...],
  prestige: {...}
}
```

Эти данные можно:
- Скопировать в Excel для анализа
- Использовать в балансировочных калькуляторах
- Строить графики прогрессии
- Симулировать игровые сессии

## Примеры изменений

### Сделать воркеров дешевле

**До** (workers.ts - разбросано):
```typescript
basic: { baseCost: D(25), ... }
engineer: { baseCost: D(250), ... }
master: { baseCost: D(2500), ... }
```

**После** (economy/balance.ts - в одном месте):
```typescript
export const WORKERS_ECONOMY = {
  basic: { baseCost: D(20), ... },      // Было 25
  engineer: { baseCost: D(200), ... },  // Было 250
  master: { baseCost: D(2000), ... },   // Было 2500
}
```

### Изменить формулу престижа

```typescript
// economy/balance.ts
export const PRESTIGE_ECONOMY = {
  // Было: sqrt(crystals / 1M)
  rewardFormula: (crystals) => crystals.div(1e6).sqrt().floor(),
  
  // Стало: sqrt(crystals / 500K) - быстрее престиж
  rewardFormula: (crystals) => crystals.div(5e5).sqrt().floor(),
}
```

## Workflow балансировки

1. **Изменить числа** в `balance.ts`
2. **Обновить анализ** в `progression.md` (опционально)
3. **Тестировать** в игре
4. **Повторить** до идеального баланса

Контентные файлы (`workers.ts`, `upgrades.ts`, `prestige.ts`) **не трогаем**!

## Расширение системы

### Добавить новый воркер

1. Добавить экономику в `balance.ts`:
```typescript
export const WORKERS_ECONOMY = {
  // ...
  newWorker: {
    baseCost: D(100000),
    costGrowth: 1.15,
    baseCps: D(500),
    unlockRequirement: {
      type: 'worker',
      targetId: 'previousWorker',
      level: 5,
    },
  },
}
```

2. Добавить контент в `workers.ts`:
```typescript
export const WORKERS = {
  // ...
  newWorker: {
    name: 'Новый воркер',
    icon: '🔥',
    // Экономика подтягивается автоматически
    ...WORKERS_ECONOMY.newWorker,
  },
}
```

### Создать альтернативный баланс

```typescript
// economy/balance_easy.ts
export const WORKERS_ECONOMY = {
  basic: {
    baseCost: D(10),      // Дешевле
    costGrowth: 1.1,      // Медленнее растёт
    baseCps: D(0.5),      // Больше производит
  },
  // ...
}
```

Переключение:
```typescript
// workers.ts
import { WORKERS_ECONOMY } from './economy/balance_easy'
```

## Файлы в этой папке

```
economy/
├── balance.ts           # ВСЕ числа игры
├── progression.md       # Анализ прогрессии
├── index.ts            # Удобные экспорты
└── README.md           # Эта документация
```

## См. также

- `/configs/workers.ts` - контент воркеров
- `/configs/upgrades.ts` - контент апгрейдов  
- `/configs/prestige.ts` - контент престижа
- `/.cursor/rules/main.mdc` - основная документация проекта
