import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: "file:school.db",
  // authToken: "...",
});

export const db = drizzle(client);
