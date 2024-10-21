import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import ApiBaseResponses from '@decorators/api-base-response.decorator';
import { User } from '@prisma/client';
import Serialize from '@decorators/serialize.decorator';
import UserBaseEntity from '@modules/users/entities/user-base.entity';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { SkipAuth } from '@modules/auth/skip-auth.guard';
import RefreshTokenDto from '@modules/auth/dto/refresh-token.dto';
import {
  AccessGuard,
  Actions,
  CaslUser,
  UseAbility,
  UserProxy,
} from '@modules/casl';
import { TokensEntity } from '@modules/auth/entities/tokens.entity';
import ApiOkBaseResponse from '@decorators/api-ok-base-response.decorator';
import { VerifyEmailDto } from './dto/verify-email';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@ApiBaseResponses()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiBody({ type: SignUpDto })
  @Serialize(UserBaseEntity)
  @ApiOkBaseResponse({ dto: UserBaseEntity, isArray: false })
  @SkipAuth()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpDto);
  }

  @Post('verify-email')
  @ApiBody({ type: VerifyEmailDto })
  @Serialize(UserBaseEntity)
  @ApiOkBaseResponse({ dto: UserBaseEntity, isArray: false })
  @SkipAuth()
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<User> {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  signIn(@Body() LoginDto: LoginDto): Promise<Auth.AccessRefreshTokens> {
    return this.authService.signIn(LoginDto);
  }

  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  @Serialize(UserBaseEntity)
  @ApiOkBaseResponse({ dto: UserBaseEntity, isArray: false })
  @SkipAuth()
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<User> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  @Serialize(UserBaseEntity)
  @ApiOkBaseResponse({ dto: UserBaseEntity, isArray: false })
  @SkipAuth()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<User> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('refresh-token')
  @ApiBody({ type: RefreshTokenDto })
  @SkipAuth()
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<Auth.AccessRefreshTokens | void> {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Get('me')
  @Serialize(UserBaseEntity)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async getMe(@CaslUser() userProxy?: UserProxy<User>): Promise<User> {
    const { id: userId } = await userProxy.get();

    return this.authService.findById(userId);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseAbility(Actions.delete, TokensEntity)
  async logout(@CaslUser() userProxy?: UserProxy<User>) {
    const { accessToken } = await userProxy.getMeta();
    const { id: userId } = await userProxy.get();

    return this.authService.logout(userId, accessToken);
  }
}
