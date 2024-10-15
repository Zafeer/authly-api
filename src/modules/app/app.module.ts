import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@config/app.config';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],
})
export class AppModule {}
