import { FastifyRequest } from 'fastify';
import { ZodSchema } from 'zod';

export async function validateBody<T>(
  request: FastifyRequest,
  schema: ZodSchema<T>
): Promise<T> {
  return schema.parse(request.body);
}

export async function validateQuery<T>(
  request: FastifyRequest,
  schema: ZodSchema<T>
): Promise<T> {
  return schema.parse(request.query);
}

export async function validateParams<T>(
  request: FastifyRequest,
  schema: ZodSchema<T>
): Promise<T> {
  return schema.parse(request.params);
}


