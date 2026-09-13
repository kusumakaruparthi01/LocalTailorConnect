import { describe, expect, it } from 'vitest';
import { canAccessOrder, canManageTailorProfile, requireAccountType } from './authz';

const customer = { id: 'customer-a', accountType: 'customer' as const };
const otherCustomer = { id: 'customer-b', accountType: 'customer' as const };
const tailor = { id: 'tailor-user-a', accountType: 'tailor' as const, tailorProfileId: 'tailor-a' };
const otherTailor = { id: 'tailor-user-b', accountType: 'tailor' as const, tailorProfileId: 'tailor-b' };
const admin = { id: 'admin-a', accountType: 'admin' as const };
const order = { customerUserId: customer.id, tailorId: 'tailor-a' };

describe('order authorization', () => {
  it('allows only the customer, assigned tailor, or admin', () => {
    expect(canAccessOrder(customer, order)).toBe(true);
    expect(canAccessOrder(tailor, order)).toBe(true);
    expect(canAccessOrder(admin, order)).toBe(true);
    expect(canAccessOrder(otherCustomer, order)).toBe(false);
    expect(canAccessOrder(otherTailor, order)).toBe(false);
  });

  it('prevents a tailor from managing another tailor profile', () => {
    expect(canManageTailorProfile(tailor, 'tailor-a')).toBe(true);
    expect(canManageTailorProfile(otherTailor, 'tailor-a')).toBe(false);
    expect(canManageTailorProfile(admin, 'tailor-a')).toBe(true);
  });

  it('rejects the wrong account type', () => {
    expect(() => requireAccountType(customer, 'tailor')).toThrow('Forbidden');
    expect(() => requireAccountType(tailor, 'tailor')).not.toThrow();
  });
});
