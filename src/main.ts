import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { setupSwagger } from 'src/config/swagger.config';

const logger = new Logger('App');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const apiVersion = process.env.API_VERSION || '1';
  const port = process.env.PORT || 4000;

  app.setGlobalPrefix(`/api/v${apiVersion}`);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.useStaticAssets(path.join(__dirname, '..', '/src/uploads'));

  app.enableCors(); // Configure CORS here if necessary

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  setupSwagger(app);

  await app.listen(port);
  logger.fatal(
    `Server started at port http://localhost:${process.env.PORT}/api/v${apiVersion}`, // Logger for consistent logging
  );
}
bootstrap();
