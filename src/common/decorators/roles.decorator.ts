export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 * Usage: Add this metadata to routes that require specific roles
 */
export function Roles(...roles: string[]) {
  return { roles };
}


