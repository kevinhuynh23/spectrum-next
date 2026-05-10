import { describe, it, expect } from 'vitest'
import { getBiasForSource } from '../bias'

describe('getBiasForSource', () => {
  it('returns a known rating for Fox News', () => {
    expect(getBiasForSource('Fox News')).toBe('Right')
  })

  it('returns a known rating for NPR', () => {
    expect(getBiasForSource('NPR')).toBe('Center-Left')
  })

  it('returns null for an unknown source', () => {
    expect(getBiasForSource('Some Unknown Outlet')).toBeNull()
  })
})
