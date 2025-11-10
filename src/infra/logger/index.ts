import pino from 'pino';
import { appConfig } from '../../config/app.config';

export const logger = pino({
  level: appConfig.server.isDevelopment ? 'debug' : 'info',
  transport: appConfig.server.isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;


