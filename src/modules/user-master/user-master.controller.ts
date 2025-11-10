import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserMasterService } from './user-master.service';
import { handleError } from '../../common/filters/error.filter';
import { userMasterResponseSchema } from './dto/user-master.dto';

export async function userMasterRoutes(fastify: FastifyInstance) {
  const userMasterService = new UserMasterService(fastify.prisma);

  // Get 5 dummy records
  fastify.get(
    '/dummy',
    {
      schema: {
        tags: ['User Master'],
        description: 'Get 5 dummy records from user_master table',
        summary: 'List 5 sample records',
        response: {
          200: {
            description: 'Successful response',
            type: 'array',
            items: userMasterResponseSchema,
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const records = await userMasterService.getDummyRecords();
        return reply.send(records);
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // Get all records with pagination
  fastify.get(
    '/',
    {
      schema: {
        tags: ['User Master'],
        description: 'Get all user_master records with pagination',
        summary: 'List all records',
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', default: 1 },
            limit: { type: 'number', default: 10 },
          },
        },
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: userMasterResponseSchema,
              },
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number' },
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  totalPages: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = request.query as { page?: string; limit?: string };
        const page = parseInt(query.page || '1', 10);
        const limit = parseInt(query.limit || '10', 10);
        
        const result = await userMasterService.findAll(page, limit);
        return reply.send(result);
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // Get record by ID
  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['User Master'],
        description: 'Get user_master record by ID',
        summary: 'Get single record',
        params: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
          },
          required: ['id'],
        },
        response: {
          200: {
            description: 'Successful response',
            ...userMasterResponseSchema,
          },
          404: {
            description: 'Record not found',
            type: 'object',
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const params = request.params as { id: string };
        const id = parseInt(params.id, 10);
        
        const record = await userMasterService.findById(id);
        
        if (!record) {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'Record not found',
          });
        }
        
        return reply.send(record);
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );

  // Create dummy records (for initial setup)
  fastify.post(
    '/seed-dummy',
    {
      schema: {
        tags: ['User Master'],
        description: 'Create 5 dummy records in user_master table',
        summary: 'Seed dummy data',
        response: {
          201: {
            description: 'Records created successfully',
            type: 'object',
            properties: {
              message: { type: 'string' },
              count: { type: 'number' },
              records: {
                type: 'array',
                items: userMasterResponseSchema,
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const records = await userMasterService.createDummyRecords();
        return reply.status(201).send({
          message: 'Dummy records created successfully',
          count: records.length,
          records,
        });
      } catch (error) {
        return handleError(error as Error, reply);
      }
    }
  );
}

