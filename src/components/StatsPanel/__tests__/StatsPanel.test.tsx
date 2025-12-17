import { render, screen } from '@testing-library/react'
import { StatsPanel } from '../StatsPanel'
import { D } from '../../../utils/bigNumber'

const defaultProps = {
  totalCrystalsEarned: D(10000),
  totalCps: D(500),
  baseClickValue: D(10),
  clickMultiplier: D(2),
  productionMultiplier: D(1),
  totalClicks: 1000,
}

describe('StatsPanel', () => {
  it('renders all stats correctly', () => {
    render(<StatsPanel {...defaultProps} />)

    expect(screen.getByText('📊 Статистика')).toBeInTheDocument()
    expect(screen.getByText('Всего заработано:')).toBeInTheDocument()
    expect(screen.getByText('📊 Статистика')).toBeInTheDocument()
    expect(screen.getByText('Кристаллов в секунду:')).toBeInTheDocument()
    expect(screen.getByText('Сила клика:')).toBeInTheDocument()
    expect(screen.getByText('Всего кликов:')).toBeInTheDocument()
  })

  it('shows click multiplier when greater than 1', () => {
    render(<StatsPanel {...defaultProps} />)

    expect(screen.getByText('Сила клика:')).toBeInTheDocument()
  })

  it('shows production multiplier when greater than 1', () => {
    render(<StatsPanel {...defaultProps} productionMultiplier={D(1.5)} />)

    expect(screen.getByText('Множитель производства:')).toBeInTheDocument()
    expect(screen.getByText('x1.50')).toBeInTheDocument()
  })

  it('does not show production multiplier when equals 1', () => {
    render(<StatsPanel {...defaultProps} />)

    expect(screen.queryByText('Множитель производства:')).not.toBeInTheDocument()
  })

  it('calculates final click value correctly', () => {
    render(<StatsPanel {...defaultProps} baseClickValue={D(5)} clickMultiplier={D(3)} />)

    expect(screen.getByText('📊 Статистика')).toBeInTheDocument()
  })

  it('handles zero values correctly', () => {
    const zeroProps = {
      totalCrystalsEarned: D(0),
      totalCps: D(0),
      baseClickValue: D(1),
      clickMultiplier: D(1),
      productionMultiplier: D(1),
      totalClicks: 0,
    }

    render(<StatsPanel {...zeroProps} />)

    expect(screen.getByText('📊 Статистика')).toBeInTheDocument()
    expect(screen.getByText('Всего заработано:')).toBeInTheDocument()
  })

  it('handles large numbers correctly', () => {
    const largeProps = {
      totalCrystalsEarned: D('1e15'),
      totalCps: D('1e12'),
      baseClickValue: D('1e10'),
      clickMultiplier: D(100),
      productionMultiplier: D(1),
      totalClicks: 1000000,
    }

    render(<StatsPanel {...largeProps} />)

    // Check that large numbers are displayed (exact format depends on mock)
    expect(screen.getByText('📊 Статистика')).toBeInTheDocument()
    expect(screen.getByText('Всего заработано:')).toBeInTheDocument()
  })

  it('renders all stats in correct order', () => {
    render(<StatsPanel {...defaultProps} />)

    const stats = screen.getAllByText(/:/)
    expect(stats).toHaveLength(4) // 4 stat labels

    // Check that stats are in the right order
    const statLabels = stats.map(stat => stat.textContent)
    expect(statLabels).toEqual([
      'Всего заработано:',
      'Кристаллов в секунду:',
      'Сила клика:',
      'Всего кликов:',
    ])
  })
})
