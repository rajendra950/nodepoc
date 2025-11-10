import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { validateBody } from '../../common/pipes/validation.pipe';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './dto/auth.dto';
import { handleError } from '../../common/filters/error.filter';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify.prisma, fastify);

  // Register
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dto = await validateBody(request, registerSchema);
      const result = await authService.register(dto);
      return reply.status(201).send(result);
    } catch (error) {
      return handleError(error as Error, reply);
    }
  });

  // Login
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dto = await validateBody(request, loginSchema);
      const result = await authService.login(dto);
      return reply.send(result);
    } catch (error) {
      return handleError(error as Error, reply);
    }
  });

  // Refresh Token
  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const dto = await validateBody(request, refreshTokenSchema);
      const result = await authService.refreshToken(dto.refreshToken);
      return reply.send(result);
    } catch (error) {
      return handleError(error as Error, reply);
    }
  });

  // Logout
  fastify.post(
    '/logout',
    {
      onRequest: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const dto = await validateBody(request, refreshTokenSchema);
        await authService.logout(dto.refreshToken);
        return reply.send({ message: 'Logged out successfully' });
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // Get current user
  fastify.get(
    '/me',
    {
      onRequest: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        return reply.send({ user: request.user });
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // OAuth2 - Google
  fastify.get('/google', async (request, reply) => {
    try {
      if (!fastify.googleOAuth2) {
        return reply.status(501).send({ error: 'Google OAuth not configured' });
      }
      return fastify.googleOAuth2.generateAuthorizationUri(request, reply);
    } catch (error) {
      return handleError(error as Error, reply);
    }
  });

  fastify.get('/google/callback', async (request, reply) => {
    try {
      if (!fastify.googleOAuth2) {
        return reply.status(501).send({ error: 'Google OAuth not configured' });
      }
      
      const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
      
      // Fetch user profile from Google
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      
      const profile = await response.json();
      const result = await authService.handleOAuthCallback('GOOGLE', profile);
      
      return reply.send(result);
    } catch (error) {
      return handleError(error as Error, reply);
    }
  });

  // OAuth2 - GitHub
  fastify.get('/github', async (request, reply) => {
    try {
      if (!fastify.githubOAuth2) {
        return reply.status(501).send({ error: 'GitHub OAuth not configured' });
      }
      return fastify.githubOAuth2.generateAuthorizationUri(request, reply);
    } catch (error) {
      return handleError(error as Error, reply);
    }
  });

  fastify.get('/github/callback', async (request, reply) => {
    try {
      if (!fastify.githubOAuth2) {
        return reply.status(501).send({ error: 'GitHub OAuth not configured' });
      }
      
      const token = await fastify.githubOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
      
      // Fetch user profile from GitHub
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'User-Agent': 'Fastify-App',
        },
      });
      
      const profile = await response.json();
      const result = await authService.handleOAuthCallback('GITHUB', profile);
      
      return reply.send(result);
    } catch (error) {
      return handleError(error as Error, reply);
    }
  });
}


