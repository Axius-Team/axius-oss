import { runMigrations } from '../src/lib/db/client'

console.log('Running database migrations...')
try {
  runMigrations()
  console.log('Migrations complete.')
  process.exit(0)
} catch (error) {
  console.error('Migration failed:', error)
  process.exit(1)
}
