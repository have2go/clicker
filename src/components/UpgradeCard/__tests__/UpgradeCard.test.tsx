import { render, screen, fireEvent } from '@testing-library/react'
import { UpgradeCard } from '../UpgradeCard'
import { D } from '../../../utils/bigNumber'
import type { UpgradeConfig } from '../../../types/upgrades'

const mockUpgradeConfig: UpgradeConfig = {
  id: 'testUpgrade',
  name: 'Test Upgrade',
  description: 'A test upgrade',
  icon: '⚡',
  type: 'multiplier' as any,
  category: 'active' as any,
  baseCost: D(100),
  costGrowth: 1.5,
  effect: (level: number) => ({
    type: 'multiplicative' as any,
    target: 'click' as any,
    value: D(Math.pow(1.25, level)),
  }),
  maxLevel: 10,
  showBeforeUnlock: true,
}

const defaultProps = {
  config: mockUpgradeConfig,
  level: 0,
  cost: D(100),
  canAfford: true,
  isUnlocked: true,
  onBuy: jest.fn(),
}

describe('UpgradeCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders upgrade information correctly', () => {
    render(<UpgradeCard {...defaultProps} />)

    expect(screen.getByText('Test Upgrade')).toBeInTheDocument()
    expect(screen.getByText('A test upgrade')).toBeInTheDocument()
    expect(screen.getByText('⚡')).toBeInTheDocument()
    expect(screen.getByText(/Уровень: 0/)).toBeInTheDocument()
  })

  it('shows buy button when unlocked and not maxed', () => {
    render(<UpgradeCard {...defaultProps} />)

    const buyButton = screen.getByRole('button')
    expect(buyButton).toBeInTheDocument()
    expect(buyButton).toHaveTextContent('💰 100.00 Cr')
    expect(buyButton).not.toBeDisabled()
  })

  it('disables buy button when cannot afford', () => {
    render(<UpgradeCard {...defaultProps} canAfford={false} />)

    const buyButton = screen.getByRole('button')
    expect(buyButton).toBeDisabled()
  })

  it('shows effect when level > 0', () => {
    render(<UpgradeCard {...defaultProps} level={1} />)

    expect(screen.getByText('x1.25 к кликам')).toBeInTheDocument()
  })

  it('shows maxed message when at max level', () => {
    render(<UpgradeCard {...defaultProps} level={10} />)

    expect(screen.getByText('✓ Максимальный уровень')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows unlock hint when locked', () => {
    render(<UpgradeCard {...defaultProps} isUnlocked={false} />)

    expect(screen.getByText('🔒 Требуется разблокировка')).toBeInTheDocument()
  })

  it('does not render when locked and showBeforeUnlock is false', () => {
    const configWithoutShow = { ...mockUpgradeConfig, showBeforeUnlock: false }
    render(<UpgradeCard {...defaultProps} config={configWithoutShow} isUnlocked={false} />)

    expect(screen.queryByText('Test Upgrade')).not.toBeInTheDocument()
  })

  it('handles unlock requirement text for crystals', () => {
    const configWithUnlock = {
      ...mockUpgradeConfig,
      unlockRequirement: { type: 'crystals' as any, amount: D(1000) }
    }

    render(<UpgradeCard {...defaultProps} config={configWithUnlock} isUnlocked={false} />)

    expect(screen.getByText(/Требуется: 1\.00K кристаллов заработано/)).toBeInTheDocument()
  })

  it('handles unlock requirement text for upgrade', () => {
    const configWithUnlock = {
      ...mockUpgradeConfig,
      unlockRequirement: { type: 'upgrade' as any, targetId: 'otherUpgrade', level: 5 }
    }

    render(<UpgradeCard {...defaultProps} config={configWithUnlock} isUnlocked={false} />)

    expect(screen.getByText(/Требуется: otherUpgrade уровень 5/)).toBeInTheDocument()
  })

  it('calls onBuy when button is clicked', () => {
    render(<UpgradeCard {...defaultProps} />)

    const buyButton = screen.getByRole('button')
    fireEvent.click(buyButton)

    expect(defaultProps.onBuy).toHaveBeenCalledTimes(1)
  })

  it('shows locked state when not unlocked', () => {
    render(<UpgradeCard {...defaultProps} isUnlocked={false} />)

    // Check that unlock hint is shown
    expect(screen.getByText('🔒 Требуется разблокировка')).toBeInTheDocument()
  })
})
