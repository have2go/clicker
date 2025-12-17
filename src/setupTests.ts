// Setup file for Jest tests
import '@testing-library/jest-dom'

// Mock break_infinity.js before any imports
jest.mock('break_infinity.js', () => {
  class MockDecimal {
    private _value: number

    constructor(value: string | number | MockDecimal) {
      if (value instanceof MockDecimal) {
        this._value = value._value
      } else if (typeof value === 'string') {
        // Handle scientific notation and very large numbers
        // For mock, we'll cap very large numbers to avoid Infinity
        const parsed = parseFloat(value)
        if (!isFinite(parsed)) {
          // For extremely large numbers, store as string representation
          this._value = Number.MAX_VALUE
        } else {
          this._value = parsed
        }
      } else {
        this._value = value
      }
    }

    get mantissa(): number {
      return this._value
    }

    get exponent(): number {
      return 0
    }

    toNumber(): number {
      return this._value
    }

    toString(): string {
      if (this._value >= 1e21 || this._value <= 1e-6) {
        return this._value.toExponential()
      }
      return this._value.toString()
    }

    add(other: MockDecimal | number): MockDecimal {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return new MockDecimal(this._value + otherVal)
    }

    sub(other: MockDecimal | number): MockDecimal {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return new MockDecimal(this._value - otherVal)
    }

    mul(other: MockDecimal | number): MockDecimal {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return new MockDecimal(this._value * otherVal)
    }

    div(other: MockDecimal | number): MockDecimal {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return new MockDecimal(this._value / otherVal)
    }

    pow(other: MockDecimal | number): MockDecimal {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return new MockDecimal(Math.pow(this._value, otherVal))
    }

    equals(other: MockDecimal | number): boolean {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return Math.abs(this._value - otherVal) < Number.EPSILON
    }

    gt(other: MockDecimal | number): boolean {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return this._value > otherVal
    }

    gte(other: MockDecimal | number): boolean {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return this._value >= otherVal
    }

    lt(other: MockDecimal | number): boolean {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return this._value < otherVal
    }

    lte(other: MockDecimal | number): boolean {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return this._value <= otherVal
    }

    abs(): MockDecimal {
      return new MockDecimal(Math.abs(this._value))
    }

    eq(other: MockDecimal | number): boolean {
      const otherVal = other instanceof MockDecimal ? other._value : Number(other)
      return Math.abs(this._value - otherVal) < Number.EPSILON
    }

    // Static methods
    static pow(base: number, exponent: number): MockDecimal {
      return new MockDecimal(Math.pow(base, exponent))
    }
  }

  // Return as default export
  return {
    __esModule: true,
    default: MockDecimal
  }
})


// Mock CSS modules
jest.mock('./UpgradeCard.module.scss', () => ({
  card: 'mock-card',
  header: 'mock-header',
  icon: 'mock-icon',
  info: 'mock-info',
  name: 'mock-name',
  description: 'mock-description',
  stats: 'mock-stats',
  level: 'mock-level',
  maxLevel: 'mock-maxLevel',
  effect: 'mock-effect',
  unlockHint: 'mock-unlockHint',
  buyButton: 'mock-buyButton',
  buyText: 'mock-buyText',
  maxed: 'mock-maxed',
  locked: 'mock-locked'
}))

jest.mock('./WorkerCard.module.scss', () => ({
  card: 'mock-card',
  workerMode: 'mock-workerMode',
  boostMode: 'mock-boostMode',
  header: 'mock-header',
  icon: 'mock-icon',
  info: 'mock-info',
  name: 'mock-name',
  description: 'mock-description',
  stats: 'mock-stats',
  production: 'mock-production',
  label: 'mock-label',
  value: 'mock-value',
  valueContainer: 'mock-valueContainer',
  boostMultiplierBadge: 'mock-boostMultiplierBadge',
  boostedValue: 'mock-boostedValue',
  total: 'mock-total',
  quantity: 'mock-quantity',
  quantityLabel: 'mock-quantityLabel',
  quantityValue: 'mock-quantityValue',
  boostInfo: 'mock-boostInfo',
  boostLabel: 'mock-boostLabel',
  boostHint: 'mock-boostHint',
  unlockHint: 'mock-unlockHint',
  buyButton: 'mock-buyButton',
  buyText: 'mock-buyText',
  clickable: 'mock-clickable',
  backButton: 'mock-backButton',
  boostTitle: 'mock-boostTitle',
  boostHeader: 'mock-boostHeader',
  boostDescription: 'mock-boostDescription',
  boostStats: 'mock-boostStats',
  boostStatItem: 'mock-boostStatItem',
  boostLevelBadge: 'mock-boostLevelBadge',
  locked: 'mock-locked',
  hidden: 'mock-hidden'
}))

jest.mock('./StatsPanel.module.scss', () => ({
  panel: 'mock-panel',
  title: 'mock-title',
  stats: 'mock-stats',
  stat: 'mock-stat',
  statLabel: 'mock-statLabel',
  statValue: 'mock-statValue',
  multiplier: 'mock-multiplier'
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
;(globalThis as any).localStorage = localStorageMock;

// Mock console methods to reduce noise in tests
;(globalThis as any).console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});
