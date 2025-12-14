import { useState, useCallback } from 'react'
import { useGameStore } from '../stores/gameStore'
import { useMultiplierStore } from '../stores/multiplierStore'
import { usePrestigeStore } from '../stores/prestigeStore'
import { MultiplierType, MultiplierSource } from '../types/multipliers'
import { D } from '../utils/bigNumber'
import styles from './DevPanel.module.scss'

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [incomeMultiplier, setIncomeMultiplier] = useState(1)
  const { reset } = useGameStore()
  const { addMultiplier, removeMultiplier } = useMultiplierStore()
  const { reset: resetPrestige } = usePrestigeStore()

  const handleFullReset = useCallback(() => {
    if (window.confirm('⚠️ ВЫ УВЕРЕНЫ? ЭТО УДАЛИТ ВЕСЬ ПРОГРЕСС БЕЗ ВОЗМОЖНОСТИ ВОССТАНОВЛЕНИЯ!')) {
      if (window.confirm('Последнее предупреждение! Действительно удалить ВСЁ?')) {
        // Полный сброс всех сторов
        reset()
        resetPrestige()
        
        // Удаляем дев-множитель если был
        removeMultiplier('dev_income_multiplier')
        
        // Очистить локалсторадж полностью
        localStorage.clear()
        
        alert('✅ Игра полностью сброшена!')
        
        // Перезагрузить страницу
        window.location.reload()
      }
    }
  }, [reset, resetPrestige, removeMultiplier])

  const handleApplyMultiplier = useCallback(() => {
    // Удаляем старый множитель если был
    removeMultiplier('dev_income_multiplier')
    
    // Добавляем новый если > 1
    if (incomeMultiplier > 1) {
      addMultiplier({
        id: 'dev_income_multiplier',
        type: MultiplierType.GLOBAL,
        source: MultiplierSource.TEMPORARY,
        value: D(incomeMultiplier),
        description: `🛠️ DEV: x${incomeMultiplier} доход`,
      })
    }
    
    alert(`✅ Множитель дохода установлен: x${incomeMultiplier}`)
  }, [incomeMultiplier, addMultiplier, removeMultiplier])

  const handleAddCrystals = useCallback(() => {
    const amount = prompt('Введите количество кристаллов для добавления:')
    if (amount) {
      const num = Number(amount)
      if (!isNaN(num) && num > 0) {
        const { crystals } = useGameStore.getState()
        useGameStore.setState({ 
          crystals: crystals.add(num),
        })
        alert(`✅ Добавлено ${num} кристаллов`)
      }
    }
  }, [])

  const handleAddPrestigeCurrency = useCallback(() => {
    const amount = prompt('Введите количество престиж-валюты для добавления:')
    if (amount) {
      const num = Number(amount)
      if (!isNaN(num) && num > 0) {
        const { currency } = usePrestigeStore.getState()
        usePrestigeStore.setState({ 
          currency: currency.add(num),
        })
        alert(`✅ Добавлено ${num} престиж-валюты`)
      }
    }
  }, [])

  if (!isOpen) {
    return (
      <button 
        className={styles.devButton}
        onClick={() => setIsOpen(true)}
        title="Инструменты разработчика"
      >
        DEV
      </button>
    )
  }

  return (
    <>
      <button 
        className={styles.devButton}
        onClick={() => setIsOpen(false)}
      >
        DEV
      </button>
      
      <div className={styles.overlay} onClick={() => setIsOpen(false)} />
      
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2>🛠️ DEV Tools</h2>
          <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>
        
        <div className={styles.content}>
          {/* Множитель дохода */}
          <div className={styles.section}>
            <h3>Множитель дохода</h3>
            <p className={styles.description}>
              Ускоряет весь доход для быстрого тестирования
            </p>
            <div className={styles.inputGroup}>
              <input 
                type="number" 
                min="1" 
                step="1"
                value={incomeMultiplier}
                onChange={(e) => setIncomeMultiplier(Number(e.target.value))}
                className={styles.input}
              />
              <button onClick={handleApplyMultiplier} className={styles.button}>
                Применить x{incomeMultiplier}
              </button>
            </div>
            <div className={styles.presets}>
              <button onClick={() => setIncomeMultiplier(1)} className={styles.presetButton}>x1</button>
              <button onClick={() => setIncomeMultiplier(10)} className={styles.presetButton}>x10</button>
              <button onClick={() => setIncomeMultiplier(100)} className={styles.presetButton}>x100</button>
              <button onClick={() => setIncomeMultiplier(1000)} className={styles.presetButton}>x1000</button>
              <button onClick={() => setIncomeMultiplier(10000)} className={styles.presetButton}>x10K</button>
            </div>
          </div>

          {/* Добавить ресурсы */}
          <div className={styles.section}>
            <h3>Добавить ресурсы</h3>
            <div className={styles.buttonGroup}>
              <button onClick={handleAddCrystals} className={styles.button}>
                💎 Добавить кристаллы
              </button>
              <button onClick={handleAddPrestigeCurrency} className={styles.button}>
                ⭐ Добавить престиж-валюту
              </button>
            </div>
          </div>

          {/* Сброс */}
          <div className={styles.section}>
            <h3>⚠️ Опасная зона</h3>
            <button onClick={handleFullReset} className={styles.dangerButton}>
              🔄 СБРОС ВСЕГО
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
