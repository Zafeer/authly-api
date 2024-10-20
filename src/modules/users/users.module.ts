import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { PrismaService } from '@providers/prisma/prisma.service';
import { CaslModule } from '@modules/casl';
import { permissions } from '@modules/users/users.permissions';

@Module({
  imports: [PrismaModule, CaslModule.forFeature({ permissions })],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
