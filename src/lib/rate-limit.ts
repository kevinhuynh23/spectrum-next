/**
 * Minimal dependency-free in-memory rate limiter (fixed window).
 *
 * Used to blunt brute-force and mass-registration attacks on the auth
 * endpoints (signup via tRPC, login via the NextAuth credentials provider).
 *
 * LIMITATION: buckets live in this process's memory. On multi-instance
 * deployments (Vercel, containers behind a load balancer) every instance
 * keeps its own counters, so the effective limit is `limit x instances`
 * and a determined attacker can spread attempts across instances. For a
 * shared counter, back this with Redis/Upstash behind the same
 * `checkRateLimit` interface.
 */

export interface RateLimitOptions {
  /** Bucket key — scope it per endpoint and client, e.g. `auth:signup:1.2.3.4`. */
  key: string
  /** Max hits allowed per window. */
  limit: number
  /** Window length in milliseconds. */
  windowMs: number
}

export interface RateLimitResult {
  ok: boolean
  remaining: number
  /** Milliseconds until the current window resets (0 when ok). */
  retryAfterMs: number
}

type Bucket = { count: number; windowStart: number }

const buckets = new Map<string, Bucket>()
/** Upper bound on live buckets so the map can't grow without limit. */
const MAX_BUCKETS = 10_000

function prune(now: number) {
  if (buckets.size <= MAX_BUCKETS) return
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > 60 * 60 * 1000) buckets.delete(key)
  }
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now - bucket.windowStart >= windowMs) {
    prune(now)
    buckets.set(key, { count: 1, windowStart: now })
    return { ok: true, remaining: limit - 1, retryAfterMs: 0 }
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: bucket.windowStart + windowMs - now }
  }

  bucket.count += 1
  return { ok: true, remaining: limit - bucket.count, retryAfterMs: 0 }
}

/** Best-effort client IP from request headers (proxy-aware). */
export function getClientIp(h: Headers): string {
  const forwarded = h.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = h.get('x-real-ip')?.trim()
  if (realIp) return realIp
  return 'unknown'
}

/**
 * Returns the client IP from the current Next.js request's headers.
 * Falls back to 'unknown' (shared bucket) when called outside a request
 * scope so callers stay fail-safe rather than crashing.
 */
export async function clientIpFromRequest(): Promise<string> {
  try {
    const { headers } = await import('next/headers')
    return getClientIp(await headers())
  } catch {
    return 'unknown'
  }
}

/** Clears all buckets. Exported for tests only. */
export function resetRateLimiter() {
  buckets.clear()
}
