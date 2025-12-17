describe('Simple test', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle localStorage mock', () => {
    localStorage.setItem('test', 'value')
    expect(localStorage.getItem('test')).toBe('value')
  })
})
