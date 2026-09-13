import 'dotenv/config';
import { and, eq } from 'drizzle-orm';
import { auth } from '../server/auth.js';
import { db } from '../server/db/client.js';
import { tailorProfiles, tailorServices, user } from '../server/db/schema.js';

if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
  throw new Error('Refusing to seed production without ALLOW_PRODUCTION_SEED=true');
}

const customerPassword = process.env.SEED_CUSTOMER_PASSWORD;
const tailorPassword = process.env.SEED_TAILOR_PASSWORD;
if (!customerPassword || !tailorPassword) {
  throw new Error('SEED_CUSTOMER_PASSWORD and SEED_TAILOR_PASSWORD are required');
}

async function ensureUser(input: {
  name: string;
  email: string;
  password: string;
  accountType: 'customer' | 'tailor';
  phone: string;
  city: string;
  shopName?: string;
}) {
  const [existing] = await db.select({ id: user.id }).from(user).where(eq(user.email, input.email)).limit(1);
  if (existing) return existing.id;

  const result = await auth.api.signUpEmail({ body: input });
  return result.user.id;
}

async function main() {
  await ensureUser({
    name: 'Demo Customer',
    email: 'customer@localtailor.test',
    password: customerPassword,
    accountType: 'customer',
    phone: '+91 90000 00001',
    city: 'Pudukkottai',
  });

  const tailorUserId = await ensureUser({
    name: 'Demo Tailor',
    email: 'tailor@localtailor.test',
    password: tailorPassword,
    accountType: 'tailor',
    phone: '+91 90000 00002',
    city: 'Pudukkottai',
    shopName: 'Demo Tailor Studio',
  });

  const [tailor] = await db
    .select({ id: tailorProfiles.id })
    .from(tailorProfiles)
    .where(eq(tailorProfiles.userId, tailorUserId))
    .limit(1);
  if (!tailor) throw new Error('Tailor profile provisioning failed');

  const [service] = await db
    .select({ id: tailorServices.id })
    .from(tailorServices)
    .where(and(eq(tailorServices.tailorId, tailor.id), eq(tailorServices.name, 'Blouse Stitching')))
    .limit(1);
  if (!service) {
    await db.insert(tailorServices).values({
      tailorId: tailor.id,
      name: 'Blouse Stitching',
      category: 'Women',
      startingPricePaise: 35_000,
      estimatedTime: '3–4 days',
      description: 'Custom blouse stitching and fitting.',
    });
  }
}

main().then(() => console.log('Development seed complete'));
