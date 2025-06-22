import { z } from 'zod';

export const RoleSchema = z.object({
  name: z.string(),
  permissions: z.array(z.string()),
  inherits: z.array(z.string()),
});

export type Role = z.infer<typeof RoleSchema>;
