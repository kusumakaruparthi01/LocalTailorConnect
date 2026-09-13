import { config } from 'dotenv';
import { randomBytes } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

config({ path: '.env.local' });

describe('account profile provisioning', () => {
  let auth: typeof import('./auth').auth;
  let db: typeof import('./db/client').db;
  let schema: typeof import('./db/schema');
  let eq: typeof import('drizzle-orm').eq;
  const createdUserIds: string[] = [];
  const createPassword = () => randomBytes(24).toString('base64url');

  beforeAll(async () => {
    ({ auth } = await import('./auth'));
    ({ db } = await import('./db/client'));
    schema = await import('./db/schema');
    ({ eq } = await import('drizzle-orm'));
  });

  afterAll(async () => {
    for (const id of createdUserIds) {
      await db.delete(schema.user).where(eq(schema.user.id, id));
    }
  });

  it('creates an isolated customer profile during signup', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const result = await auth.api.signUpEmail({
      body: {
        name: 'Isolation Customer',
        email: `customer-${suffix}@example.test`,
        password: createPassword(),
        accountType: 'customer',
        phone: '+91 90000 00101',
        city: 'Pudukkottai',
      },
    });
    createdUserIds.push(result.user.id);
    const rows = await db.select().from(schema.customerProfiles)
      .where(eq(schema.customerProfiles.userId, result.user.id));
    expect(rows).toHaveLength(1);
  });

  it('creates the submitted tailor workshop instead of a default studio', async () => {
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const result = await auth.api.signUpEmail({
      body: {
        name: 'Arun Master',
        email: `tailor-${suffix}@example.test`,
        password: createPassword(),
        accountType: 'tailor',
        phone: '+91 90000 00102',
        city: 'Madurai',
        shopName: 'Arun Custom Studio',
      },
    });
    createdUserIds.push(result.user.id);
    const rows = await db.select().from(schema.tailorProfiles)
      .where(eq(schema.tailorProfiles.userId, result.user.id));
    expect(rows).toHaveLength(1);
    expect(rows[0].shopName).toBe('Arun Custom Studio');
    expect(rows[0].verificationStatus).toBe('pending');
  });
});
