import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { initializeTracing } from './config/tracing.config';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  // Initialize tracing before app creation
  initializeTracing();

  const app = await NestFactory.create(AppModule);

    // Security middleware with relaxed CSP in non-production so GraphQL Playground can load remote middleware
  const helmetOptions =
    process.env.NODE_ENV === 'production'
      ? undefined
      : {
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
              styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
              imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
              connectSrc: ["'self'", "wss:", "https://cdn.jsdelivr.net"],
              fontSrc: ["'self'", "https://fonts.gstatic.com"],
            },
          },
        };

  app.use(helmet(helmetOptions));
  app.use(compression());
  // Global validation pipe with transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global interceptors will be handled by APP_INTERCEPTOR provider in AppModule

  // CORS configuration
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Swagger documentation (disabled in production)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('thryv-partner-hub-bff API')
      .setDescription('NestJS microservices template for AWS Lambda')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
