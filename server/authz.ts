export type AccountType = 'customer' | 'tailor' | 'admin';

export interface Actor {
  id: string;
  accountType: AccountType;
  tailorProfileId?: string | null;
}

export interface OwnedOrder {
  customerUserId: string;
  tailorId: string;
}

export const canAccessOrder = (actor: Actor, order: OwnedOrder) =>
  actor.accountType === 'admin' ||
  (actor.accountType === 'customer' && order.customerUserId === actor.id) ||
  (actor.accountType === 'tailor' && order.tailorId === actor.tailorProfileId);

export const canManageTailorProfile = (actor: Actor, tailorId: string) =>
  actor.accountType === 'admin' ||
  (actor.accountType === 'tailor' && actor.tailorProfileId === tailorId);

export function requireAccountType(actor: Actor, ...allowed: AccountType[]) {
  if (!allowed.includes(actor.accountType)) throw new Error('Forbidden');
}
