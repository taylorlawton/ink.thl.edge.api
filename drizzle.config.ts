import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  dialect: 'turso',
  out: './db/migrations',
  dbCredentials: {
    url: process.env.BUNNY_DATABASE_URL || '',
    authToken: process.env.BUNNY_DATABASE_READ_ONLY_AUTH_TOKEN || process.env.BUNNY_DATABASE_AUTH_TOKEN || '',
  },
  migrations: {
    table: '_journal',
  }
})