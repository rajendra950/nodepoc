import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.controller';

export async function authModule(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/auth' });
}


