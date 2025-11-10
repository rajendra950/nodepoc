import { z } from 'zod';

// User Master Response Schema
export const userMasterResponseSchema = {
  type: 'object',
  properties: {
    user_id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string' },
    is_active: { type: 'boolean' },
    creation_date: { type: 'string', format: 'date-time' },
    modification_date: { type: 'string', format: 'date-time' },
  },
};

// Zod schema for validation
export const createUserMasterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  is_active: z.boolean().default(true),
});

export type CreateUserMasterDto = z.infer<typeof createUserMasterSchema>;

// User Master Response Interface
export interface UserMasterResponse {
  user_id: number;
  name: string;
  email: string;
  is_active: boolean;
  creation_date: Date;
  modification_date: Date;
}

