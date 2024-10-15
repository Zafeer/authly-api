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
import { ValidationExceptionFilter } from '@filters/validation-exception.filter';
import validationExceptionFactory from '@filters/validation-exception-factory';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from '@interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService<any, boolean> = app.get(ConfigService);
  const appConfig = configService.get('app');

  const { httpAdapter } = app.get(HttpAdapterHost);

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
    // new ThrottlerExceptionsFilter(),
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

  await app.listen(appConfig.port);
}
bootstrap();
