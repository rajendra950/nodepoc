import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenError } from '../filters/error.filter';

export function createRbacMiddleware(requiredRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      throw new ForbiddenError('Authentication required');
    }

    const hasRole = requiredRoles.some((role) =>
      user.roles.includes(role)
    );

    if (!hasRole) {
      throw new ForbiddenError(
        `Requires one of these roles: ${requiredRoles.join(', ')}`
      );
    }
  };
}


