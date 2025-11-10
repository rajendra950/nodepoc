import { FastifyInstance } from 'fastify';
import { userMasterRoutes } from './user-master.controller';

export async function userMasterModule(fastify: FastifyInstance) {
  fastify.register(userMasterRoutes, { prefix: '/user-master' });
}

