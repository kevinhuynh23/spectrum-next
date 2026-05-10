import { describe, it, expect } from 'vitest'
import bcrypt from 'bcryptjs'

describe('Auth utilities', () => {
  it('bcrypt round-trips a password', async () => {
    const hash = await bcrypt.hash('secret123', 10)
    const valid = await bcrypt.compare('secret123', hash)
    const invalid = await bcrypt.compare('wrong', hash)
    expect(valid).toBe(true)
    expect(invalid).toBe(false)
  })
})
