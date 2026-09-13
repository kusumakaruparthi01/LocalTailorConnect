import { eq } from 'drizzle-orm';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './auth.js';
import { db } from './db/client.js';
import { adminUsers, tailorProfiles } from './db/schema.js';
import type { AccountType, Actor } from './authz.js';
import type { ApiRequest, ApiResponse } from './api-types.js';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function getActor(req: ApiRequest): Promise<Actor> {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) throw new HttpError(401, 'Authentication required');

  const authUser = session.user as typeof session.user & { accountType?: string };
  let accountType = authUser.accountType as AccountType | undefined;
  let tailorProfileId: string | null = null;

  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.userId, authUser.id)).limit(1);
  if (admin) accountType = 'admin';

  if (accountType === 'tailor') {
    const [profile] = await db
      .select({ id: tailorProfiles.id })
      .from(tailorProfiles)
      .where(eq(tailorProfiles.userId, authUser.id))
      .limit(1);
    tailorProfileId = profile?.id ?? null;
  }

  if (!accountType || !['customer', 'tailor', 'admin'].includes(accountType)) {
    throw new HttpError(403, 'Account is not provisioned');
  }
  return { id: authUser.id, accountType, tailorProfileId };
}

export function allowMethods(req: ApiRequest, methods: string[]) {
  if (!req.method || !methods.includes(req.method)) {
    throw new HttpError(405, 'Method not allowed');
  }
}

export function sendError(res: ApiResponse, error: unknown) {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error instanceof Error && error.message === 'Forbidden') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  console.error(error);
  return res.status(500).json({ error: 'Internal server error' });
}
