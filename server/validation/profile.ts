import { z } from 'zod';

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(30),
  city: z.string().trim().min(2).max(100),
  shopName: z.string().trim().min(2).max(150).optional(),
});
