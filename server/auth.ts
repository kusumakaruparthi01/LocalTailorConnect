import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db/client.js';
import * as schema from './db/schema.js';

const cleanURL = (value?: string) => value?.trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '');
const configuredBaseURL = cleanURL(process.env.BETTER_AUTH_URL);
const canonicalProductionURL = 'https://local-tailor-connect.vercel.app';
const vercelDeploymentURL = cleanURL(process.env.VERCEL_URL)
  ? `https://${cleanURL(process.env.VERCEL_URL)}`
  : undefined;
const baseURL = process.env.NODE_ENV === 'production'
  ? canonicalProductionURL
  : configuredBaseURL;
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
  trustedOrigins: [
    baseURL,
    canonicalProductionURL,
    ...(configuredBaseURL ? [configuredBaseURL] : []),
    ...(vercelDeploymentURL ? [vercelDeploymentURL] : []),
  ],
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
