import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { db } from '../server/db/client';
import { adminUsers, user } from '../server/db/schema';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error('Usage: npm run admin:promote -- user@example.com');

const [target] = await db.select({ id: user.id }).from(user).where(eq(user.email, email)).limit(1);
if (!target) throw new Error('User not found');

await db.insert(adminUsers).values({ userId: target.id }).onConflictDoNothing();
console.log(`Admin access granted to ${email}`);
