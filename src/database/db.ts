import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  // url: "file:school.db",
  url : process.env.DB_URL!,
  authToken: process.env.DB_TOKEN,
  
});

export const db = drizzle(client);
