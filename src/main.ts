import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { VersioningOptions } from '@nestjs/common/interfaces/version-options.interface';
import { PrismaClientExceptionFilter } from './filters/prisma-client-exception.filter';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { AccessExceptionFilter } from '@filters/access-exception.filter';
import { NotFoundExceptionFilter } from '@filters/not-found-exception.filter';
import { BadRequestExceptionFilter } from '@filters/bad-request-exception.filter';
import { ThrottlerExceptionsFilter } from '@filters/throttler-exception.filter';
import { ValidationExceptionFilter } from '@filters/validation-exception.filter';
import validationExceptionFactory from '@filters/validation-exception-factory';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
// import { winstonLogger } from '@helpers/logger/logger.service';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const configService: ConfigService<any, boolean> = app.get(ConfigService);
  const appConfig = configService.get('app');
  const swaggerConfig = configService.get('swagger');
  const corsConfig = configService.get('cors');

  const { httpAdapter } = app.get(HttpAdapterHost);

  // Security
  {
    //Helmet
    app.use(helmet());

    //CORS
    if (corsConfig.enabled) {
      app.enableCors();
    }

    //CSRF
  }

  {
    /**
     * set global prefix for all routes except GET /
     */
    const options = {
      exclude: [{ path: '/', method: RequestMethod.GET }],
    };

    app.setGlobalPrefix('api', options);
  }

  {
    /**
     * Enable versioning for all routes
     * https://docs.nestjs.com/openapi/multiple-openapi-documents#versioning
     */
    const options: VersioningOptions = {
      type: VersioningType.URI,
      defaultVersion: '1',
    };

    app.enableVersioning(options);
  }

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaClientExceptionFilter(httpAdapter),
    new AccessExceptionFilter(httpAdapter),
    new NotFoundExceptionFilter(),
    new BadRequestExceptionFilter(),
    new ValidationExceptionFilter(),
    new ThrottlerExceptionsFilter(),
  );

  {
    /**
     * ValidationPipe options
     * https://docs.nestjs.com/pipes#validation-pipe
     */
    const options = {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    };

    app.useGlobalPipes(
      new ValidationPipe({
        ...options,
        exceptionFactory: validationExceptionFactory,
      }),
    );

    app.useGlobalInterceptors(new TransformInterceptor());
  }

  {
    /**
     * Setup Swagger API documentation
     * https://docs.nestjs.com/openapi/introduction
     */
    app.use(
      ['/docs'],
      basicAuth({
        challenge: true,
        users: {
          admin: swaggerConfig.password,
        },
      }),
    );

    const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle('Authly Api v1')
      .setDescription('Authly Api v1')
      .setVersion('1.0')
      .addBearerAuth({ in: 'header', type: 'http' })
      .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        // If set to true, it persists authorization data,
        // and it would not be lost on browser close/refresh
        persistAuthorization: true,
      },
    });
  }

  await app.listen(appConfig.port);
}
bootstrap();
