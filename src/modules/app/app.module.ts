import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import appConfig from '@config/app.config';
import { CaslModule } from '@modules/casl';
import { Roles } from '../auth/role.enum';
import { TokenService } from '@modules/auth/token.service';
import { TokenRepository } from '@modules/auth/token.repository';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@modules/auth/auth.guard';
import jwtConfig from '@config/jwt.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import HealthModule from '@modules/health/health.module';
import swaggerConfig from '@config/swagger.config';
import corsConfig from '@config/cors.config';
import mailConfig from '@helpers/mailer/mail/config/mail.config';
import { LoggerModule } from 'nestjs-pino';
import { SecurityMiddleware } from '@middlewares/security.middleware';
import { v4 as uuidv4 } from 'uuid';
import { RequestLoggerMiddleware } from '@middlewares/request.middleware';
import pino from 'pino';
@Module({
  imports: [
    // LoggerModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          pinoHttp: {
            level: config.get('app.loggerLevel'),
            redact: [
              'req.headers.authorization',
              'req.headers.cookie',
              'req.body.password',
              'req.body.otpToken',
            ],
            // stream: pino.destination({
            //   dest: './logs/combine.log', // omit for stdout
            //   minLength: 1024, // Buffer before writing
            //   sync: false, // Asynchronous logging
            // }),
            transport:
              config.get('app.env') === 'development'
                ? {
                    targets: [
                      {
                        target: 'pino-pretty',
                        options: {
                          singleLine: true,
                        },
                      },
                      {
                        target: 'pino/file',
                        options: {
                          destination: './logs/combined.log', // Specify the path to the log file within the logs folder
                          mkdir: true, // Create the directory if it doesn't exist
                        },
                      },
                    ],
                  }
                : undefined,
            genReqId: function (req, res) {
              let existingID = req.id ?? req.headers['x-request-id'];
              if (existingID) return existingID;
              existingID = req.headers['x-correlation-id'];
              if (existingID) return existingID;
              const id = uuidv4();
              res.setHeader('X-Request-Id', id);
              return id;
            },
          },
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, swaggerConfig, corsConfig, mailConfig],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 10000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    PrismaModule,
    JwtModule.register({
      global: true,
    }),
    CaslModule.forRoot<Roles>({
      superuserRole: Roles.ADMIN,
    }),
    UsersModule,
    HealthModule,
    AuthModule,
  ],
  providers: [
    TokenService,
    JwtService,
    TokenRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  // let's add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    // consumer.apply(SecurityMiddleware).forRoutes('*');
  }
}
