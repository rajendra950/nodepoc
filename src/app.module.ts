import Fastify, { FastifyInstance } from 'fastify';
import { logger } from './infra/logger';
import appConfig from './config/app.config';

// Plugins
import prismaPlugin from './plugins/prisma.plugin';
import jwtPlugin from './plugins/jwt.plugin';
import corsPlugin from './plugins/cors.plugin';
import rateLimitPlugin from './plugins/rate-limit.plugin';
import oauthPlugin from './plugins/oauth.plugin';
import rbacPlugin from './plugins/rbac.plugin';
import swaggerPlugin from './plugins/swagger.plugin';

// Modules
import { authModule } from './modules/auth/auth.module';
import { userModule } from './modules/user/user.module';
import { userMasterModule } from './modules/user-master/user-master.module';

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: logger,
    disableRequestLogging: false,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId',
  });

  // Register plugins
  await fastify.register(prismaPlugin);
  await fastify.register(corsPlugin);
  await fastify.register(rateLimitPlugin);
  await fastify.register(jwtPlugin);
  await fastify.register(oauthPlugin);
  await fastify.register(rbacPlugin);
  await fastify.register(swaggerPlugin);

  // Health check
  fastify.get('/health', {
    schema: {
      tags: ['Health'],
      description: 'Health check endpoint',
      summary: 'Check API health',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            uptime: { type: 'number' },
            environment: { type: 'string' },
          },
        },
      },
    },
  }, async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: appConfig.server.env,
    };
  });

  // API Routes
  await fastify.register(
    async (instance) => {
      await instance.register(authModule);
      await instance.register(userModule);
      await instance.register(userMasterModule);
    },
    { prefix: '/api' }
  );

  // 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
    });
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    logger.error(error);

    if (error.statusCode) {
      reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      });
    } else {
      reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      });
    }
  });

  return fastify;
}


