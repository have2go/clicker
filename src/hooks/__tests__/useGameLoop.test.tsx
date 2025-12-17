import { renderHook } from '@testing-library/react'
import { useGameLoop } from '../useGameLoop'

// Extend the global type for tests
declare const global: any

// Mock performance for tests
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => 1000)
  },
  writable: true
})

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = jest.fn()
const mockCancelAnimationFrame = jest.fn()

Object.defineProperty(global, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  writable: true
})

Object.defineProperty(global, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
  writable: true
})

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
