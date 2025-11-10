import { PrismaClient } from '@prisma/client';
import { logger } from '../infra/logger';

let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query' as never, (e: any) => {
        logger.debug({ query: e.query, duration: e.duration }, 'Database Query');
      });
    }

    prisma.$on('error' as never, (e: any) => {
      logger.error(e, 'Database Error');
    });

    prisma.$on('warn' as never, (e: any) => {
      logger.warn(e, 'Database Warning');
    });
  }

  return prisma;
};

export const disconnectDatabase = async () => {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
};

export default getPrismaClient();


