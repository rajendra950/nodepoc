import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { createRbacMiddleware } from '../common/interceptors/rbac.interceptor';

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authorize', (roles: string[]) => {
    return createRbacMiddleware(roles);
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    authorize: (roles: string[]) => any;
  }
}


