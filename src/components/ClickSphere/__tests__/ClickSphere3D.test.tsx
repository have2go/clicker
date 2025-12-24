import { render, fireEvent } from '@testing-library/react'
import { ClickSphere3D } from '../ClickSphere3D'

describe('ClickSphere3D', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    mockOnClick.mockClear()
  })

  it('renders without crashing', () => {
    render(
      <ClickSphere3D
        onClick={mockOnClick}
        size={200}
        disabled={false}
      />
    )

    // Ищем div контейнер по стилю
    const container = document.querySelector('div[style*="width: 200px"]') as HTMLElement
    expect(container).toBeInTheDocument()
    expect(container.style.width).toBe('200px')
    expect(container.style.height).toBe('200px')
  })

  it('calls onClick when clicked', () => {
    render(
      <ClickSphere3D
        onClick={mockOnClick}
        size={200}
        disabled={false}
      />
    )

    const container = document.querySelector('div[style*="width: 200px"]') as HTMLElement
    fireEvent.pointerDown(container)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    render(
      <ClickSphere3D
        onClick={mockOnClick}
        size={200}
        disabled={true}
      />
    )

    const container = document.querySelector('div[style*="width: 200px"]') as HTMLElement
    fireEvent.pointerDown(container)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('renders sphere elements', () => {
    render(
      <ClickSphere3D
        onClick={mockOnClick}
        size={200}
        disabled={false}
      />
    )

    // Проверяем наличие элементов сферы (без CSS классов)
    const container = document.querySelector('div[style*="width: 200px"]') as HTMLElement
    expect(container.children.length).toBeGreaterThan(0)
  })
})