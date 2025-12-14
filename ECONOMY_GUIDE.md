# Экономический анализ игры

Это руководство описывает новую структуру экономического баланса проекта.

## 🎯 Что изменилось?

Вся **экономическая часть** игры (цены, множители, формулы) теперь **отделена от контента** (названий, описаний, иконок).

### До:
```typescript
// workers.ts
basic: {
  name: 'Рабочий',           // Контент
  baseCost: D(25),           // Экономика
  costGrowth: 1.15,          // Экономика
  baseCps: D(0.1),           // Экономика
  icon: '👷',                // Контент
}
```

### После:
```typescript
// configs/economy/balance.ts
export const WORKERS_ECONOMY = {
  basic: {
    baseCost: D(25),
    costGrowth: 1.15,
    baseCps: D(0.1),
  }
}

// configs/workers.ts
import { WORKERS_ECONOMY } from './economy/balance'

basic: {
  name: 'Рабочий',
  icon: '👷',
  ...WORKERS_ECONOMY.basic,  // Экономика подтягивается
}
```

## 📁 Новая структура

```
src/configs/
├── economy/                    # 🆕 НОВАЯ ПАПКА
│   ├── balance.ts             # Все числа игры
│   ├── progression.md         # Анализ прогрессии
│   ├── index.ts              # Экспорты
│   └── README.md             # Документация
├── workers.ts                # Контент воркеров
├── upgrades.ts               # Контент апгрейдов
└── prestige.ts               # Контент престижа

scripts/
└── exportBalance.ts          # 🆕 Экспорт в CSV
```

## 🔢 Файл balance.ts

Содержит **только числа**:

### Воркеры:
```typescript
export const WORKERS_ECONOMY: Record<string, WorkerEconomy> = {
  basic: {
    baseCost: D(25),
    costGrowth: 1.15,
    baseCps: D(0.1),
  },
  // ... все остальные
}
```

### Апгрейды:
```typescript
export const UPGRADES_ECONOMY: Record<string, UpgradeEconomy> = {
  clickPower: {
    baseCost: D(20),
    costGrowth: 1.6,
    effectFormula: (level) => D(level * 0.2),
    effectType: 'additive',
    effectTarget: 'click',
  },
  // ... все остальные
}
```

### Престиж:
```typescript
export const PRESTIGE_ECONOMY = {
  minCrystalsRequired: D(1e6),
  rewardFormula: (crystals) => crystals.div(1e6).sqrt().floor(),
  currencyMultiplierFormula: (currency) => D(1).add(currency.mul(0.1)),
}
```

## 📊 Экспорт в CSV для анализа

### Использование:
```bash
npm run export-balance
```

### Результат:
Создаются 3 CSV файла:
- `balance_workers.csv` - все данные воркеров
- `balance_upgrades.csv` - все данные апгрейдов
- `balance_prestige.csv` - прогрессия престижа

### Что включено:

**Workers CSV:**
- Base Cost, Cost Growth, Base CPS
- CPS/Cost Ratio (эффективность)
- Cost на уровнях 10, 25, 50, 100
- Total Cost до уровней 10, 25, 50, 100
- Unlock requirements

**Upgrades CSV:**
- Base Cost, Cost Growth
- Effect Type & Target
- Cost на уровнях 1, 5, 10, 20
- Total Cost до уровней 5, 10, 20
- Effect на уровнях 1, 5, 10, 20
- Unlock requirements

**Prestige CSV:**
- Прогрессия награды от 1M до 100B кристаллов
- Глобальные множители
- Престиж-апгрейды с эффектами

### Открыть в Excel/Google Sheets:
1. Запустить `npm run export-balance`
2. Открыть CSV файлы
3. Анализировать, строить графики, находить дисбалансы

## 🛠️ Как использовать

### 1. Изменить баланс игры

Открыть `src/configs/economy/balance.ts` и изменить числа:

```typescript
// Сделать воркеров дешевле
export const WORKERS_ECONOMY = {
  basic: {
    baseCost: D(20),      // Было 25
    costGrowth: 1.12,     // Было 1.15
    baseCps: D(0.15),     // Было 0.1
  },
}
```

Контентные файлы (`workers.ts`, `upgrades.ts`) **трогать не нужно**!

### 2. Добавить новый воркер/апгрейд

**Шаг 1:** Добавить экономику в `balance.ts`:
```typescript
export const WORKERS_ECONOMY = {
  // ...
  myNewWorker: {
    baseCost: D(100000),
    costGrowth: 1.15,
    baseCps: D(500),
  },
}
```

**Шаг 2:** Добавить контент в `workers.ts`:
```typescript
export const WORKERS = {
  // ...
  myNewWorker: {
    name: 'Новый воркер',
    icon: '🔥',
    description: '...',
    ...WORKERS_ECONOMY.myNewWorker,  // Экономика автоматически
  },
}
```

### 3. Анализировать прогрессию

```typescript
import { 
  calculateWorkerCostToLevel,
  calculateUpgradeCostToLevel,
  getUpgradeEffectAtLevel,
} from './configs/economy'

// Сколько стоит прокачать basic с 1 до 100?
const cost = calculateWorkerCostToLevel('basic', 1, 100)
console.log(cost.toString()) // "195,718,741.78"

// Какой эффект даёт 10-й уровень clickMultiplier?
const effect = getUpgradeEffectAtLevel('clickMultiplier', 10)
console.log(effect.toString()) // "9.31" (x9.31 множитель)
```

### 4. Экспортировать для внешнего анализа

```bash
npm run export-balance
# Открыть balance_*.csv в Excel
# Построить графики, найти проблемы баланса
```

## 📈 Файл progression.md

Содержит анализ экономики:
- Таблицы прогрессии
- Расчёты CPS/Cost эффективности
- Временные метки (early/mid/late game)
- Выявленные проблемы баланса
- Рекомендации по улучшению

Пример из файла:

```markdown
### Стоимость и производство

| Воркер | Базовая цена | Рост | Базовое CPS | CPS/стоимость |
|--------|-------------|------|-------------|---------------|
| basic  | 25          | 1.15 | 0.1         | 0.004         |
| engineer | 250       | 1.15 | 1           | 0.004         |

**Паттерн:** Каждый воркер в 10x дороже и производит в 10x больше. 
Идеальный баланс!
```

## 🎓 Workflow балансировки

1. **Изменить** числа в `balance.ts`
2. **Экспортировать** CSV: `npm run export-balance`
3. **Открыть** CSV в Excel, построить графики
4. **Обновить** анализ в `progression.md` (опционально)
5. **Тестировать** в игре: `npm run dev`
6. **Повторить** до идеального баланса

## ✅ Преимущества новой структуры

### 1. Быстрый поиск
```
Где цена basic воркера?
→ balance.ts, строка ~40
```

### 2. Массовые изменения
```typescript
// Сделать ВСЕ апгрейды дешевле на 20%
for (const eco of Object.values(UPGRADES_ECONOMY)) {
  eco.baseCost = eco.baseCost.mul(0.8)
}
```

### 3. A/B тестирование
```typescript
// Создать balance_hard.ts
// Переключить импорты
import { WORKERS_ECONOMY } from './economy/balance_hard'
```

### 4. Внешний анализ
- Экспорт в CSV
- Анализ в Excel/Python
- Симуляторы прогрессии
- Автоматизированное тестирование

### 5. Документация баланса
- Все формулы в одном месте
- Комментарии к прогрессии
- История изменений (git diff)

## 🔍 Примеры анализа

### Найти самый эффективный воркер:
```typescript
const efficiencies = Object.entries(WORKERS_ECONOMY).map(([id, eco]) => ({
  id,
  efficiency: eco.baseCps.div(eco.baseCost).toNumber()
}))

console.log(efficiencies.sort((a, b) => b.efficiency - a.efficiency))
```

### Построить кривую роста стоимости:
```bash
npm run export-balance
# В Excel: выделить колонки "Cost Level 10/25/50/100"
# Вставка → График → Линейный график
```

### Рассчитать время до престижа:
```typescript
const targetCrystals = PRESTIGE_ECONOMY.minCrystalsRequired
const currentCps = calculateWorkerTotalCps('basic', 10)
const timeSeconds = targetCrystals.div(currentCps).toNumber()
console.log(`${timeSeconds / 3600} часов`)
```

## 📚 Дополнительные файлы

- `src/configs/economy/README.md` - подробная документация economy/
- `src/configs/economy/progression.md` - анализ прогрессии
- `.cursor/rules/main.mdc` - основные правила проекта

## 🚀 Быстрый старт

```bash
# 1. Посмотреть текущий баланс
cat src/configs/economy/balance.ts

# 2. Экспортировать для анализа
npm run export-balance

# 3. Открыть CSV в Excel/Google Sheets

# 4. Изменить баланс
nano src/configs/economy/balance.ts

# 5. Тестировать
npm run dev
```

---

**Все экономические изменения теперь в одном месте: `src/configs/economy/balance.ts`** 🎯
