import { renderHook } from '@testing-library/react'
import { useGameLoop } from '../useGameLoop'

// Mock performance for tests
global.performance = {
  now: jest.fn(() => 1000)
} as any

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = jest.fn()
const mockCancelAnimationFrame = jest.fn()

global.requestAnimationFrame = mockRequestAnimationFrame
global.cancelAnimationFrame = mockCancelAnimationFrame

describe('useGameLoop', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock RAF to NOT call the callback to prevent infinite recursion
    mockRequestAnimationFrame.mockReturnValue(1)
  })

  it('should start RAF when mounted', () => {
    renderHook(() => useGameLoop())

    expect(mockRequestAnimationFrame).toHaveBeenCalledTimes(1)
  })

  it('should cancel RAF when unmounted', () => {
    const { unmount } = renderHook(() => useGameLoop())

    unmount()

    expect(mockCancelAnimationFrame).toHaveBeenCalledWith(1)
  })
})
