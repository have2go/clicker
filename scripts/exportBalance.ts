/**
 * Скрипт для экспорта экономики игры в CSV формат
 * 
 * Использование:
 *   npx tsx scripts/exportBalance.ts
 * 
 * Создаёт файлы:
 *   - balance_workers.csv
 *   - balance_upgrades.csv
 *   - balance_prestige.csv
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { D } from '../src/utils/bigNumber'
import {
  WORKERS_ECONOMY,
  UPGRADES_ECONOMY,
  PRESTIGE_ECONOMY,
  PRESTIGE_UPGRADES_ECONOMY,
  calculateWorkerCostToLevel,
  calculateUpgradeCostToLevel,
} from '../src/configs/economy/balance'

// ============================================
// CSV Generation helpers
// ============================================

function escapeCSV(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function arrayToCSV(rows: string[][]): string {
  return rows.map(row => row.map(escapeCSV).join(',')).join('\n')
}

// ============================================
// Workers Export
// ============================================

function exportWorkers(): string {
  const headers = [
    'ID',
    'Base Cost',
    'Cost Growth',
    'Base CPS',
    'CPS/Cost Ratio',
    'Cost Level 10',
    'Cost Level 25',
    'Cost Level 50',
    'Cost Level 100',
    'Total Cost to 10',
    'Total Cost to 25',
    'Total Cost to 50',
    'Total Cost to 100',
    'Unlock Type',
    'Unlock Target',
    'Unlock Level',
  ]

  const rows = [headers]

  for (const [id, eco] of Object.entries(WORKERS_ECONOMY)) {
    const baseCost = eco.baseCost.toNumber()
    const baseCps = eco.baseCps.toNumber()
    const ratio = baseCps / baseCost

    rows.push([
      id,
      eco.baseCost.toString(),
      eco.costGrowth.toString(),
      eco.baseCps.toString(),
      ratio.toFixed(6),
      eco.baseCost.mul(Math.pow(eco.costGrowth, 9)).toString(),
      eco.baseCost.mul(Math.pow(eco.costGrowth, 24)).toString(),
      eco.baseCost.mul(Math.pow(eco.costGrowth, 49)).toString(),
      eco.baseCost.mul(Math.pow(eco.costGrowth, 99)).toString(),
      calculateWorkerCostToLevel(id, 0, 10).toString(),
      calculateWorkerCostToLevel(id, 0, 25).toString(),
      calculateWorkerCostToLevel(id, 0, 50).toString(),
      calculateWorkerCostToLevel(id, 0, 100).toString(),
      eco.unlockRequirement?.type || 'none',
      eco.unlockRequirement?.targetId || '',
      eco.unlockRequirement?.level?.toString() || '',
    ])
  }

  return arrayToCSV(rows)
}

// ============================================
// Upgrades Export
// ============================================

function exportUpgrades(): string {
  const headers = [
    'ID',
    'Base Cost',
    'Cost Growth',
    'Effect Type',
    'Effect Target',
    'Max Level',
    'Cost Level 1',
    'Cost Level 5',
    'Cost Level 10',
    'Cost Level 20',
    'Total Cost to 5',
    'Total Cost to 10',
    'Total Cost to 20',
    'Effect Level 1',
    'Effect Level 5',
    'Effect Level 10',
    'Effect Level 20',
    'Unlock Type',
    'Unlock Target',
  ]

  const rows = [headers]

  for (const [id, eco] of Object.entries(UPGRADES_ECONOMY)) {
    rows.push([
      id,
      eco.baseCost.toString(),
      eco.costGrowth.toString(),
      eco.effectType,
      eco.effectTarget,
      eco.maxLevel?.toString() || 'unlimited',
      eco.baseCost.toString(),
      eco.baseCost.mul(Math.pow(eco.costGrowth, 4)).toString(),
      eco.baseCost.mul(Math.pow(eco.costGrowth, 9)).toString(),
      eco.baseCost.mul(Math.pow(eco.costGrowth, 19)).toString(),
      calculateUpgradeCostToLevel(id, 0, 5).toString(),
      calculateUpgradeCostToLevel(id, 0, 10).toString(),
      calculateUpgradeCostToLevel(id, 0, 20).toString(),
      eco.effectFormula(1).toString(),
      eco.effectFormula(5).toString(),
      eco.effectFormula(10).toString(),
      eco.effectFormula(20).toString(),
      eco.unlockRequirement?.type || 'none',
      eco.unlockRequirement?.targetId || eco.unlockRequirement?.amount?.toString() || '',
    ])
  }

  return arrayToCSV(rows)
}

// ============================================
// Prestige Export
// ============================================

function exportPrestige(): string {
  const headers = [
    'Crystals',
    'Prestige Reward',
    'Global Multiplier',
    'Total Bonus %',
  ]

  const rows = [headers]

  // Примеры прогрессии
  const milestones = [
    1e6, 2e6, 3e6, 4e6, 5e6,
    10e6, 25e6, 50e6, 75e6, 100e6,
    250e6, 500e6, 750e6, 1e9,
    5e9, 10e9, 50e9, 100e9,
  ]

  for (const crystals of milestones) {
    const reward = PRESTIGE_ECONOMY.rewardFormula(D(crystals))
    const multiplier = PRESTIGE_ECONOMY.currencyMultiplierFormula(reward)
    const bonus = multiplier.sub(1).mul(100)

    rows.push([
      crystals.toExponential(2),
      reward.toString(),
      multiplier.toString(),
      bonus.toString(),
    ])
  }

  // Престиж-апгрейды
  const upgradeHeaders = [
    '',
    'ID',
    'Cost',
    'Effect Type',
    'Target',
    'Max Level',
    'Effect L1',
    'Effect L5',
    'Effect L10',
  ]

  rows.push([]) // пустая строка
  rows.push(upgradeHeaders)

  for (const [id, eco] of Object.entries(PRESTIGE_UPGRADES_ECONOMY)) {
    rows.push([
      '',
      id,
      eco.cost.toString(),
      eco.effectType,
      eco.effectTarget || 'special',
      eco.maxLevel?.toString() || 'unlimited',
      eco.effectFormula(1).toString(),
      eco.effectFormula(5).toString(),
      eco.effectFormula(10).toString(),
    ])
  }

  return arrayToCSV(rows)
}

// ============================================
// Main Export
// ============================================

function main() {
  const outputDir = process.cwd()

  // Workers
  const workersCSV = exportWorkers()
  const workersPath = join(outputDir, 'balance_workers.csv')
  writeFileSync(workersPath, workersCSV, 'utf-8')
  console.log(`✅ Exported workers to: ${workersPath}`)

  // Upgrades
  const upgradesCSV = exportUpgrades()
  const upgradesPath = join(outputDir, 'balance_upgrades.csv')
  writeFileSync(upgradesPath, upgradesCSV, 'utf-8')
  console.log(`✅ Exported upgrades to: ${upgradesPath}`)

  // Prestige
  const prestigeCSV = exportPrestige()
  const prestigePath = join(outputDir, 'balance_prestige.csv')
  writeFileSync(prestigePath, prestigeCSV, 'utf-8')
  console.log(`✅ Exported prestige to: ${prestigePath}`)

  console.log('\n📊 Balance data exported successfully!')
  console.log('   Open CSV files in Excel/Google Sheets for analysis')
}

main()
