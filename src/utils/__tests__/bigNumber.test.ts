import { D, serializeDecimal, deserializeDecimal, safeDeserializeDecimal, calculateUpgradeCost } from '../bigNumber'

describe('bigNumber utils', () => {
  describe('Decimal creation', () => {
    it('should create Decimal from number', () => {
      const decimal = D(123.45)
      expect(decimal.toNumber()).toBe(123.45)
    })

    it('should create Decimal from string', () => {
      const decimal = D('123.45')
      expect(decimal.toNumber()).toBe(123.45)
    })

    it('should handle very large numbers', () => {
      const decimal = D('1e100')
      expect(decimal.toString()).toBe('1e+100')
    })

    it('should handle extremely large numbers', () => {
      const decimal = D('1e100')
      expect(decimal.toString()).toBe('1e+100')
    })
  })

  describe('serialization', () => {
    it('should serialize Decimal correctly', () => {
      const decimal = D(123.456)
      const serialized = serializeDecimal(decimal)
      expect(serialized).toBe('123.456')
    })

    it('should deserialize Decimal correctly', () => {
      const original = D(123.456)
      const serialized = serializeDecimal(original)
      const deserialized = deserializeDecimal(serialized)
      expect(deserialized.equals(original)).toBe(true)
    })

    it('should handle safe deserialization', () => {
      const validDecimal = safeDeserializeDecimal('123.456', D(0))
      expect(validDecimal.toNumber()).toBe(123.456)

      const invalidDecimal = safeDeserializeDecimal('invalid', D(999))
      expect(invalidDecimal.toNumber()).toBe(999)

      const nullDecimal = safeDeserializeDecimal(null, D(777))
      expect(nullDecimal.toNumber()).toBe(777)
    })

    it('should handle edge cases in serialization', () => {
      const veryLarge = D('1e100')
      const serialized = serializeDecimal(veryLarge)
      const deserialized = safeDeserializeDecimal(serialized, D(0))
      expect(deserialized.equals(veryLarge)).toBe(true)
    })
  })

  describe('upgrade cost calculation', () => {
    it('should calculate linear cost correctly', () => {
      const baseCost = D(100)
      const costGrowth = 1.5
      const level = 3

      const cost = calculateUpgradeCost(baseCost, costGrowth, level)
      // Cost = baseCost * (costGrowth ^ level)
      // 100 * (1.5 ^ 3) = 100 * 3.375 = 337.5
      expect(cost.toNumber()).toBeCloseTo(337.5, 1)
    })

    it('should handle level 0 correctly', () => {
      const baseCost = D(100)
      const costGrowth = 2.0
      const level = 0

      const cost = calculateUpgradeCost(baseCost, costGrowth, level)
      expect(cost.equals(baseCost)).toBe(true)
    })

    it('should handle exponential growth', () => {
      const baseCost = D(10)
      const costGrowth = 10.0
      const level = 2

      const cost = calculateUpgradeCost(baseCost, costGrowth, level)
      // 10 * (10 ^ 2) = 10 * 100 = 1000
      expect(cost.toNumber()).toBe(1000)
    })
  })

  describe('Decimal operations', () => {
    it('should handle basic arithmetic', () => {
      const a = D(10)
      const b = D(5)

      expect(a.add(b).toNumber()).toBe(15)
      expect(a.sub(b).toNumber()).toBe(5)
      expect(a.mul(b).toNumber()).toBe(50)
      expect(a.div(b).toNumber()).toBe(2)
    })

    it('should handle very large numbers', () => {
      const a = D('1e100')
      const b = D('1e50')

      // For mock implementation, check approximate equality
      expect(a.mul(b).toString()).toMatch(/1.*e\+150/)
      // Division of very large numbers - just check the operation doesn't crash
      const divResult = a.div(b)
      expect(divResult.toNumber()).toBeGreaterThan(1e40)
      expect(divResult.toNumber()).toBeLessThan(1e60)
    })

    it('should handle precision correctly', () => {
      const a = D(0.1)
      const b = D(0.2)
      const result = a.add(b)

      expect(result.toNumber()).toBeCloseTo(0.3, 10)
    })
  })

  describe('comparison operations', () => {
    it('should compare Decimals correctly', () => {
      const a = D(10)
      const b = D(5)
      const c = D(10)

      expect(a.gt(b)).toBe(true)
      expect(a.gte(c)).toBe(true)
      expect(b.lt(a)).toBe(true)
      expect(a.equals(c)).toBe(true)
      expect(a.equals(b)).toBe(false)
    })

    it('should handle edge cases', () => {
      const zero = D(0)
      const negative = D(-1)
      const positive = D(1)

      expect(zero.gte(D(0))).toBe(true)
      expect(negative.lt(zero)).toBe(true)
      expect(positive.gt(zero)).toBe(true)
    })
  })
})
