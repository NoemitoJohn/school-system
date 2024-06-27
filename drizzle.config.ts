import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: './src/database/schema.ts',
  out: './src/database/migration',
  dialect: 'sqlite', // 'postgresql' | 'mysql' | 'sqlite'
  driver: "turso",
  dbCredentials: {
    // url: "file:school.db",
    url : process.env.DB_URL!,
    authToken: process.env.DB_TOKEN,
  },
});
