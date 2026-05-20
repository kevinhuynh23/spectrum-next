import '@testing-library/jest-dom'

// Provide a valid libsql URL so db.ts can initialize at module load time in tests.
// Individual test files that need real DB access create their own in-memory client.
process.env.TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL ?? ':memory:'
