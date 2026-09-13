import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { config } from 'dotenv';
import ws from 'ws';
import * as schema from './schema.js';

if (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production') {
  config({ path: '.env.local' });
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required on the server');
}

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: databaseUrl });

export const db = drizzle(pool, { schema });
