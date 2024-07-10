import { drizzle } from 'drizzle-orm/postgres-js';
import dotenv from 'dotenv';
import postgres from 'postgres';
dotenv.config();


// const client = createClient({
//   // url: "file:school.db",
//   url : process.env.DB_URL!, 
//   authToken: process.env.DB_TOKEN,
// });


const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString)

export const db = drizzle(client);
