import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '@modules/users/users.service';
import { TokenService } from '@modules/auth/token.service';
import { TokenRepository } from '@modules/auth/token.repository';
import { CaslModule } from '@modules/casl';
import { permissions } from '@modules/auth/auth.permissions';
import { PrismaModule } from '@providers/prisma';
import { MailModule } from '@helpers/mailer/mail/mail.module';

@Module({
  imports: [CaslModule.forFeature({ permissions }), PrismaModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, UsersService, TokenRepository],
})
export class AuthModule {}
