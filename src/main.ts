import 'dotenv/config';
import { buildApp } from './app.module';
import { logger } from './infra/logger';
import appConfig from './config/app.config';
import { disconnectDatabase } from './config/database.config';

async function bootstrap() {
  try {
    const app = await buildApp();

    // Start server
    await app.listen({
      port: appConfig.server.port,
      host: appConfig.server.host,
    });

    logger.info(
      `🚀 Server is running on http://${appConfig.server.host}:${appConfig.server.port}`
    );
    logger.info(`📝 Environment: ${appConfig.server.env}`);
    logger.info(`📚 API Documentation: http://${appConfig.server.host}:${appConfig.server.port}/documentation`);
    logger.info(`🏥 Health Check: http://${appConfig.server.host}:${appConfig.server.port}/health`);

    // Graceful shutdown
    const signals = ['SIGINT', 'SIGTERM'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.info(`Received ${signal}, closing server gracefully...`);
        await app.close();
        await disconnectDatabase();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(error, 'Error starting server');
    process.exit(1);
  }
}

bootstrap();


