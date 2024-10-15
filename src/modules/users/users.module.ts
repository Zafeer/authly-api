import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { PrismaService } from '@providers/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
