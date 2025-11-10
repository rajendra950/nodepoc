import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedError } from '../../../common/filters/error.filter';

export interface JwtPayload {
  userId: string;
  email: string;
  roles: string[];
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export async function jwtAuthHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    request.user = request.user as JwtPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid or missing token');
  }
}

