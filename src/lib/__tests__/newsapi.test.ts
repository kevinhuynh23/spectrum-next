import { describe, it, expect, vi } from 'vitest'
import { fetchNewsByCategory, fetchSpectrum, VALID_CATEGORIES } from '../newsapi'

describe('NewsAPI client', () => {
  it('VALID_CATEGORIES includes expected categories', () => {
    expect(VALID_CATEGORIES).toContain('headline')
    expect(VALID_CATEGORIES).toContain('technology')
    expect(VALID_CATEGORIES).toContain('sports')
  })

  it('fetchNewsByCategory rejects unknown categories', async () => {
    await expect(fetchNewsByCategory('invalid-cat')).rejects.toThrow('Invalid category')
  })

  it('fetchSpectrum builds correct query url', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ articles: [] }),
    } as Response)

    await fetchSpectrum('Tech Giants Compete')

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('Tech+Giants+Compete'),
      expect.any(Object),
    )
    fetchSpy.mockRestore()
  })
})
