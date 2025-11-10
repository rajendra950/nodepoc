import { z } from 'zod';

// Register DTO
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;

// Login DTO
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDto = z.infer<typeof loginSchema>;

// Refresh Token DTO
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

// Auth Response
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    avatar?: string | null;
    roles: string[];
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}


