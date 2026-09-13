import { describe, expect, it } from 'vitest';
import { profileUpdateSchema } from './profile';

describe('profileUpdateSchema', () => {
  it('accepts trimmed account details', () => {
    expect(profileUpdateSchema.parse({
      name: '  Kavitha Raman  ',
      phone: ' +91 90000 00000 ',
      city: ' Chennai ',
      shopName: ' Raman Studio ',
    })).toEqual({
      name: 'Kavitha Raman',
      phone: '+91 90000 00000',
      city: 'Chennai',
      shopName: 'Raman Studio',
    });
  });

  it('rejects empty required details', () => {
    expect(() => profileUpdateSchema.parse({ name: '', phone: '', city: '' })).toThrow();
  });
});
