/**
 * Скрипт для экспорта экономики игры в Excel формат
 * 
 * Использование:
 *   npx tsx scripts/exportBalance.ts
 * 
 * Создаёт файл:
 *   - game_balance.xlsx (с несколькими листами)
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import * as XLSX from 'xlsx'
import { D } from '../src/utils/bigNumber'
import {
  WORKERS_ECONOMY,
  UPGRADES_ECONOMY,
  PRESTIGE_ECONOMY,
  PRESTIGE_UPGRADES_ECONOMY,
  GAME_BALANCE,
  calculateWorkerCostToLevel,
  calculateUpgradeCostToLevel,
} from '../src/configs/economy/balance'

// ============================================
// Workers Sheet
// ============================================

function createWorkersSheet() {
  const data = []
  
  // Заголовки
  data.push([
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
  ])

  // Данные
  for (const [id, eco] of Object.entries(WORKERS_ECONOMY)) {
    const baseCost = eco.baseCost.toNumber()
    const baseCps = eco.baseCps.toNumber()
    const ratio = baseCps / baseCost

    data.push([
      id,
      parseFloat(eco.baseCost.toString()),
      eco.costGrowth,
      parseFloat(eco.baseCps.toString()),
      parseFloat(ratio.toFixed(6)),
      parseFloat(eco.baseCost.mul(Math.pow(eco.costGrowth, 9)).toString()),
      parseFloat(eco.baseCost.mul(Math.pow(eco.costGrowth, 24)).toString()),
      parseFloat(eco.baseCost.mul(Math.pow(eco.costGrowth, 49)).toString()),
      parseFloat(eco.baseCost.mul(Math.pow(eco.costGrowth, 99)).toString()),
      parseFloat(calculateWorkerCostToLevel(id, 0, 10).toString()),
      parseFloat(calculateWorkerCostToLevel(id, 0, 25).toString()),
      parseFloat(calculateWorkerCostToLevel(id, 0, 50).toString()),
      parseFloat(calculateWorkerCostToLevel(id, 0, 100).toString()),
      eco.unlockRequirement?.type || 'none',
      eco.unlockRequirement?.targetId || '',
      eco.unlockRequirement?.level?.toString() || '',
    ])
  }

  return XLSX.utils.aoa_to_sheet(data)
}

// ============================================
// Upgrades Sheet
// ============================================

function createUpgradesSheet() {
  const data = []
  
  // Заголовки
  data.push([
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
  ])

  // Данные
  for (const [id, eco] of Object.entries(UPGRADES_ECONOMY)) {
    data.push([
      id,
      parseFloat(eco.baseCost.toString()),
      eco.costGrowth,
      eco.effectType,
      eco.effectTarget,
      eco.maxLevel || 'unlimited',
      parseFloat(eco.baseCost.toString()),
      parseFloat(eco.baseCost.mul(Math.pow(eco.costGrowth, 4)).toString()),
      parseFloat(eco.baseCost.mul(Math.pow(eco.costGrowth, 9)).toString()),
      parseFloat(eco.baseCost.mul(Math.pow(eco.costGrowth, 19)).toString()),
      parseFloat(calculateUpgradeCostToLevel(id, 0, 5).toString()),
      parseFloat(calculateUpgradeCostToLevel(id, 0, 10).toString()),
      parseFloat(calculateUpgradeCostToLevel(id, 0, 20).toString()),
      parseFloat(eco.effectFormula(1).toString()),
      parseFloat(eco.effectFormula(5).toString()),
      parseFloat(eco.effectFormula(10).toString()),
      parseFloat(eco.effectFormula(20).toString()),
      eco.unlockRequirement?.type || 'none',
      eco.unlockRequirement?.targetId || eco.unlockRequirement?.amount?.toString() || '',
    ])
  }

  return XLSX.utils.aoa_to_sheet(data)
}

// ============================================
// Prestige Progression Sheet
// ============================================

function createPrestigeProgressionSheet() {
  const data = []
  
  // Заголовки
  data.push([
    'Crystals',
    'Prestige Reward',
    'Global Multiplier',
    'Total Bonus %',
  ])

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

    data.push([
      crystals,
      parseFloat(reward.toString()),
      parseFloat(multiplier.toString()),
      parseFloat(bonus.toString()),
    ])
  }

  return XLSX.utils.aoa_to_sheet(data)
}

// ============================================
// Prestige Upgrades Sheet
// ============================================

function createPrestigeUpgradesSheet() {
  const data = []
  
  // Заголовки
  data.push([
    'ID',
    'Cost',
    'Effect Type',
    'Target',
    'Max Level',
    'Effect Level 1',
    'Effect Level 5',
    'Effect Level 10',
  ])

  // Данные
  for (const [id, eco] of Object.entries(PRESTIGE_UPGRADES_ECONOMY)) {
    data.push([
      id,
      parseFloat(eco.cost.toString()),
      eco.effectType,
      eco.effectTarget || 'special',
      eco.maxLevel || 'unlimited',
      parseFloat(eco.effectFormula(1).toString()),
      parseFloat(eco.effectFormula(5).toString()),
      parseFloat(eco.effectFormula(10).toString()),
    ])
  }

  return XLSX.utils.aoa_to_sheet(data)
}

// ============================================
// Summary Sheet
// ============================================

function createSummarySheet() {
  const data = []
  
  // Общая информация
  data.push(['GAME BALANCE SUMMARY'])
  data.push([])
  
  data.push(['Category', 'Count', 'Details'])
  data.push(['Workers', Object.keys(WORKERS_ECONOMY).length, 'Воркеры для производства кристаллов'])
  data.push(['Upgrades', Object.keys(UPGRADES_ECONOMY).length, 'Апгрейды для усиления'])
  data.push(['Prestige Upgrades', Object.keys(PRESTIGE_UPGRADES_ECONOMY).length, 'Престиж-апгрейды'])
  data.push([])
  
  // Константы игры
  data.push(['GAME CONSTANTS'])
  data.push([])
  data.push(['Parameter', 'Value', 'Description'])
  data.push(['Base Click Power', parseFloat(GAME_BALANCE.BASE_CLICK_POWER.toString()), 'Базовая сила клика'])
  data.push(['Auto Save Interval', GAME_BALANCE.AUTO_SAVE_INTERVAL, 'Интервал автосохранения (мс)'])
  data.push(['Max Offline Hours', GAME_BALANCE.MAX_OFFLINE_HOURS, 'Максимум оффлайн прогресса (часы)'])
  data.push(['Offline Progress %', GAME_BALANCE.OFFLINE_PROGRESS_PERCENTAGE * 100, 'Процент оффлайн прогресса'])
  data.push([])
  
  // Престиж конфиг
  data.push(['PRESTIGE CONFIG'])
  data.push([])
  data.push(['Parameter', 'Value'])
  data.push(['Min Crystals Required', parseFloat(PRESTIGE_ECONOMY.minCrystalsRequired.toString())])
  data.push(['Formula', 'sqrt(totalCrystals / 1M)'])
  data.push(['Currency Multiplier', '1 + (currency * 0.1)'])
  data.push([])
  
  // Статистика воркеров
  data.push(['WORKERS STATISTICS'])
  data.push([])
  data.push(['Worker', 'Base Cost', 'Base CPS', 'Efficiency'])
  for (const [id, eco] of Object.entries(WORKERS_ECONOMY)) {
    const efficiency = eco.baseCps.div(eco.baseCost).toNumber()
    data.push([
      id,
      parseFloat(eco.baseCost.toString()),
      parseFloat(eco.baseCps.toString()),
      parseFloat(efficiency.toFixed(6)),
    ])
  }
  data.push([])
  
  // Статистика апгрейдов
  data.push(['UPGRADES STATISTICS'])
  data.push([])
  data.push(['Upgrade', 'Base Cost', 'Cost Growth', 'Effect Type', 'Target'])
  for (const [id, eco] of Object.entries(UPGRADES_ECONOMY)) {
    data.push([
      id,
      parseFloat(eco.baseCost.toString()),
      eco.costGrowth,
      eco.effectType,
      eco.effectTarget,
    ])
  }

  return XLSX.utils.aoa_to_sheet(data)
}

// ============================================
// Main Export
// ============================================

function main() {
  console.log('📊 Exporting game balance to Excel...\n')

  // Создаём новую книгу
  const workbook = XLSX.utils.book_new()

  // Добавляем листы
  console.log('  Creating Summary sheet...')
  const summarySheet = createSummarySheet()
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  console.log('  Creating Workers sheet...')
  const workersSheet = createWorkersSheet()
  XLSX.utils.book_append_sheet(workbook, workersSheet, 'Workers')

  console.log('  Creating Upgrades sheet...')
  const upgradesSheet = createUpgradesSheet()
  XLSX.utils.book_append_sheet(workbook, upgradesSheet, 'Upgrades')

  console.log('  Creating Prestige Progression sheet...')
  const prestigeProgressionSheet = createPrestigeProgressionSheet()
  XLSX.utils.book_append_sheet(workbook, prestigeProgressionSheet, 'Prestige Progression')

  console.log('  Creating Prestige Upgrades sheet...')
  const prestigeUpgradesSheet = createPrestigeUpgradesSheet()
  XLSX.utils.book_append_sheet(workbook, prestigeUpgradesSheet, 'Prestige Upgrades')

  // Сохраняем файл
  const outputPath = join(process.cwd(), 'game_balance.xlsx')
  XLSX.writeFile(workbook, outputPath)

  console.log('\n✅ Balance exported successfully!')
  console.log(`   File: ${outputPath}`)
  console.log('\n📋 Sheets included:')
  console.log('   1. Summary - общая информация и константы')
  console.log('   2. Workers - все данные воркеров')
  console.log('   3. Upgrades - все данные апгрейдов')
  console.log('   4. Prestige Progression - прогрессия престижа')
  console.log('   5. Prestige Upgrades - престиж-апгрейды')
  console.log('\n🎯 Open in Excel/LibreOffice/Google Sheets for analysis')
}

main()
