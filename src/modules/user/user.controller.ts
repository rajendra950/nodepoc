import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from './user.service';
import {
  validateBody,
  validateQuery,
  validateParams,
} from '../../common/pipes/validation.pipe';
import {
  updateUserSchema,
  queryUsersSchema,
  assignRoleSchema,
} from './dto/user.dto';
import { handleError } from '../../common/filters/error.filter';
import { z } from 'zod';

const userIdSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});

export async function userRoutes(fastify: FastifyInstance) {
  const userService = new UserService(fastify.prisma);

  // Get all users (Admin only)
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate, fastify.authorize(['ADMIN'])],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = await validateQuery(request, queryUsersSchema);
        const result = await userService.findAll(query);
        return reply.send(result);
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // Get user by ID
  fastify.get(
    '/:id',
    {
      onRequest: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = await validateParams(request, userIdSchema);
        const result = await userService.findById(id);
        return reply.send(result);
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // Update user
  fastify.patch(
    '/:id',
    {
      onRequest: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = await validateParams(request, userIdSchema);
        const dto = await validateBody(request, updateUserSchema);
        
        // Users can only update their own profile, unless they're admin
        if (
          request.user!.userId !== id &&
          !request.user!.roles.includes('ADMIN')
        ) {
          return reply.status(403).send({
            statusCode: 403,
            error: 'Forbidden',
            message: 'You can only update your own profile',
          });
        }

        const result = await userService.update(id, dto);
        return reply.send(result);
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // Delete user (Admin only)
  fastify.delete(
    '/:id',
    {
      onRequest: [fastify.authenticate, fastify.authorize(['ADMIN'])],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = await validateParams(request, userIdSchema);
        await userService.delete(id);
        return reply.status(204).send();
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // Assign role to user (Admin only)
  fastify.post(
    '/:id/roles',
    {
      onRequest: [fastify.authenticate, fastify.authorize(['ADMIN'])],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = await validateParams(request, userIdSchema);
        const { roleId } = await validateBody(request, assignRoleSchema);
        const result = await userService.assignRole(id, roleId);
        return reply.send(result);
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // Remove role from user (Admin only)
  fastify.delete(
    '/:id/roles/:roleId',
    {
      onRequest: [fastify.authenticate, fastify.authorize(['ADMIN'])],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const params = await validateParams(
          request,
          z.object({
            id: z.string().uuid(),
            roleId: z.string().uuid(),
          })
        );
        const result = await userService.removeRole(params.id, params.roleId);
        return reply.send(result);
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );
}


