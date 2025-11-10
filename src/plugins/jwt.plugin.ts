import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { FastifyInstance } from 'fastify';
import appConfig from '../config/app.config';
import { jwtAuthHook } from '../modules/auth/strategies/jwt.strategy';

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(jwt, {
    secret: appConfig.jwt.secret,
  });

  fastify.decorate('authenticate', jwtAuthHook);
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: typeof jwtAuthHook;
  }
}


