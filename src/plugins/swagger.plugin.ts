import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import appConfig from '../config/app.config';

export default fp(async (fastify: FastifyInstance) => {
  // Register Swagger
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Node POC API',
        description: 'Node.js REST API with Fastify, Prisma, JWT, and RBAC',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
      },
      servers: [
        {
          url: `http://${appConfig.server.host}:${appConfig.server.port}`,
          description: appConfig.server.env === 'development' ? 'Development server' : 'Production server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Enter your JWT token',
          },
        },
      },
      tags: [
        { name: 'Health', description: 'Health check endpoints' },
        { name: 'Authentication', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management endpoints' },
        { name: 'User Master', description: 'User Master table endpoints' },
      ],
    },
  });

  // Register Swagger UI
  await fastify.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true,
      filter: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
});

