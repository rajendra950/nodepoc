import fp from 'fastify-plugin';
import oauth2 from '@fastify/oauth2';
import { FastifyInstance } from 'fastify';
import appConfig from '../config/app.config';

export default fp(async (fastify: FastifyInstance) => {
  // Google OAuth2
  if (
    appConfig.oauth.google.clientId &&
    appConfig.oauth.google.clientSecret &&
    appConfig.oauth.google.callbackUrl
  ) {
    fastify.register(oauth2, {
      name: 'googleOAuth2',
      credentials: {
        client: {
          id: appConfig.oauth.google.clientId,
          secret: appConfig.oauth.google.clientSecret,
        },
        auth: oauth2.GOOGLE_CONFIGURATION,
      },
      startRedirectPath: '/api/auth/google',
      callbackUri: appConfig.oauth.google.callbackUrl,
      scope: ['profile', 'email'],
    });
  }

  // GitHub OAuth2
  if (
    appConfig.oauth.github.clientId &&
    appConfig.oauth.github.clientSecret &&
    appConfig.oauth.github.callbackUrl
  ) {
    fastify.register(oauth2, {
      name: 'githubOAuth2',
      credentials: {
        client: {
          id: appConfig.oauth.github.clientId,
          secret: appConfig.oauth.github.clientSecret,
        },
        auth: oauth2.GITHUB_CONFIGURATION,
      },
      startRedirectPath: '/api/auth/github',
      callbackUri: appConfig.oauth.github.callbackUrl,
      scope: ['user:email'],
    });
  }
});

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2?: any;
    githubOAuth2?: any;
  }
}


