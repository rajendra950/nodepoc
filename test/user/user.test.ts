import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app.module';

describe('User', () => {
  let app: FastifyInstance;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();

    // Login as admin
    const adminLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'admin@example.com',
        password: 'Admin@123',
      },
    });
    const adminBody = JSON.parse(adminLogin.body);
    adminToken = adminBody.tokens.accessToken;

    // Login as user
    const userLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'user@example.com',
        password: 'User@123',
      },
    });
    const userBody = JSON.parse(userLogin.body);
    userToken = userBody.tokens.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/users', () => {
    it('should allow admin to get all users', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users',
        headers: {
          authorization: `Bearer ${adminToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('meta');
      expect(Array.isArray(body.data)).toBe(true);
    });

    it('should deny regular user access', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users',
        headers: {
          authorization: `Bearer ${userToken}`,
        },
      });

      expect(response.statusCode).toBe(403);
    });
  });
});


