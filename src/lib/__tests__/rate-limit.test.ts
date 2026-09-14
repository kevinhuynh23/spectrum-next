import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  checkRateLimit,
  getClientIp,
  resetRateLimiter,
} from '@/lib/rate-limit'

afterEach(() => {
  resetRateLimiter()
  vi.useRealTimers()
})

describe('checkRateLimit', () => {
  it('allows up to the limit, then rejects', () => {
    const opts = { key: 'k1', limit: 3, windowMs: 60_000 }
    expect(checkRateLimit(opts).ok).toBe(true)
    expect(checkRateLimit(opts).ok).toBe(true)
    const last = checkRateLimit(opts)
    expect(last.ok).toBe(true)
    expect(last.remaining).toBe(0)
    const blocked = checkRateLimit(opts)
    expect(blocked.ok).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfterMs).toBeGreaterThan(0)
  })

  it('resets after the window expires', () => {
    vi.useFakeTimers()
    const opts = { key: 'k2', limit: 1, windowMs: 60_000 }
    expect(checkRateLimit(opts).ok).toBe(true)
    expect(checkRateLimit(opts).ok).toBe(false)
    vi.advanceTimersByTime(60_001)
    expect(checkRateLimit(opts).ok).toBe(true)
  })

  it('tracks keys independently', () => {
    expect(checkRateLimit({ key: 'a', limit: 1, windowMs: 60_000 }).ok).toBe(true)
    expect(checkRateLimit({ key: 'b', limit: 1, windowMs: 60_000 }).ok).toBe(true)
    expect(checkRateLimit({ key: 'a', limit: 1, windowMs: 60_000 }).ok).toBe(false)
  })
})

describe('getClientIp', () => {
  it('prefers the first x-forwarded-for entry', () => {
    const h = new Headers({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(getClientIp(h)).toBe('1.2.3.4')
  })

  it('falls back to x-real-ip', () => {
    const h = new Headers({ 'x-real-ip': '9.9.9.9' })
    expect(getClientIp(h)).toBe('9.9.9.9')
  })

  it('returns unknown when no IP headers are present', () => {
    expect(getClientIp(new Headers())).toBe('unknown')
  })
})
