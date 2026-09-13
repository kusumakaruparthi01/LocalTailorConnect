import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/client';
import * as schema from './db/schema';

const baseURL = process.env.BETTER_AUTH_URL;
const secret = process.env.BETTER_AUTH_SECRET;

if (!baseURL || !secret) {
  throw new Error('BETTER_AUTH_URL and BETTER_AUTH_SECRET are required');
}

export const auth = betterAuth({
  baseURL,
  secret,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  trustedOrigins: [baseURL],
  user: {
    additionalFields: {
      accountType: {
        type: 'string',
        required: true,
        input: true,
      },
      phone: {
        type: 'string',
        required: true,
        input: true,
      },
      city: {
        type: 'string',
        required: true,
        input: true,
      },
      shopName: {
        type: 'string',
        required: false,
        input: true,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
});
