import { z } from 'zod';

// Update User DTO
export const updateUserSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

// Query Users DTO
export const queryUsersSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().positive()).default('1'),
  limit: z.string().transform(Number).pipe(z.number().positive().max(100)).default('10'),
  search: z.string().optional(),
  role: z.string().optional(),
});

export type QueryUsersDto = z.infer<typeof queryUsersSchema>;

// Assign Role DTO
export const assignRoleSchema = z.object({
  roleId: z.string().uuid('Invalid role ID'),
});

export type AssignRoleDto = z.infer<typeof assignRoleSchema>;

// User Response
export interface UserResponse {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  provider: string;
  roles: {
    id: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}


