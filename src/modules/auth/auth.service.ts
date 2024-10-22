import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '@modules/users/users.service';
import {
  INVALID_CREDENTIALS,
  INVALID_OTP_EXPIRY,
  INVALID_OTP_TOKEN,
  NOT_FOUND,
  OTP_RATE_LIMIT_EXCEEDED,
  OTP_TOKEN_IS_EXPIRED,
  UNVERIFIED_EMAIL,
  USER_NOT_FOUND,
  USER_VERIFIED_CONFLICT,
} from '@constants/http-errors-codes';
import { User } from '@prisma/client';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { TokenService } from '@modules/auth/token.service';
import { generateOTP, validateHash } from '@helpers/utils';
import { MailService } from '@helpers/mailer/mail/mail.service';
import { VerifyEmailDto } from './dto/verify-email';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private mailService: MailService,
  ) {}

  /**
   * @desc Create a new user
   * @param signUpDto
   * @returns Promise<User> - Created user
   * @throws ConflictException - User with this email already exists
   */
  async signUp(signUpDto: SignUpDto): Promise<User> {
    // Set default values for createUserDto
    const user: User = await this.usersService.create(signUpDto);

    const otpToken = generateOTP(parseInt(process.env.OTP_LENGTH));

    const otpTokenExpiredAt = new Date(Date.now() + 5 * 60 * 1000);
    await this.usersService.update(user.id, {
      otpTokenHash: otpToken,
      otpTokenExpiredAt,
    });

    await this.mailService.confirmNewEmail({
      to: user?.email,
      data: {
        otp: otpToken,
      },
    });
    return user;
  }

  /**
   * @desc Sign in a user
   * @returns Auth.AccessRefreshTokens - Access and refresh tokens
   * @throws NotFoundException - User not found
   * @throws UnauthorizedException - Invalid credentials
   * @param LoginDto - User credentials
   */
  async signIn(LoginDto: LoginDto): Promise<Auth.AccessRefreshTokens> {
    const user: User = await this.usersService.findByEmail(LoginDto.email);

    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    if (!user?.is_verified) {
      throw new UnauthorizedException(UNVERIFIED_EMAIL);
    }

    if (!(await validateHash(LoginDto.password, user.password))) {
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    return this.tokenService.sign({
      id: user.id,
      roles: user.roles,
    });
  }

  /**
   * @desc Verify a new user
   * @param verifyEmailDto
   * @returns Promise<User> - Created user
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<User> {
    const user: User = await this.usersService.findByEmail(
      verifyEmailDto.email,
    );
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    if (user.is_verified) {
      throw new ConflictException(USER_VERIFIED_CONFLICT);
    }
    if (
      !user?.otpTokenExpiredAt ||
      isNaN(new Date(user.otpTokenExpiredAt).getTime())
    ) {
      throw new UnauthorizedException(INVALID_OTP_EXPIRY);
    }
    if (user?.otpTokenExpiredAt < new Date()) {
      throw new UnauthorizedException(OTP_TOKEN_IS_EXPIRED);
    }
    if (!(await validateHash(verifyEmailDto.otpToken, user.otpTokenHash))) {
      throw new UnauthorizedException(INVALID_OTP_TOKEN);
    }
    await this.usersService.update(user.id, {
      otpTokenHash: null,
      otpTokenExpiredAt: null,
      is_verified: true,
    });
    return user;
  }

  /**
   * @desc Forgot Password request
   * @param forgotPasswordDto
   * @returns Promise<User> - Created user
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<User> {
    const user: User = await this.usersService.findByEmail(
      forgotPasswordDto.email,
    );
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const now = new Date();
    const currentOtpTokenExpiry = user.otpTokenExpiredAt;

    if (currentOtpTokenExpiry) {
      const timeDifference =
        (new Date(currentOtpTokenExpiry).getTime() - now.getTime()) / 1000 / 60; // Difference in minutes
      if (timeDifference > 4) {
        throw new BadRequestException(OTP_RATE_LIMIT_EXCEEDED);
      }
    }

    const otpToken = generateOTP(parseInt(process.env.OTP_LENGTH));

    const otpTokenExpiredAt = new Date(Date.now() + 5 * 60 * 1000);
    await this.usersService.update(user.id, {
      otpTokenHash: otpToken,
      otpTokenExpiredAt,
    });

    await this.mailService.forgotPasswordEmail({
      to: user?.email,
      data: {
        otp: otpToken,
      },
    });
    return user;
  }

  /**
   * @desc Reset Password request
   * @param resetPasswordDto
   * @returns Promise<User> - User
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
    const user: User = await this.usersService.findByEmail(
      resetPasswordDto.email,
    );
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    if (!user?.otpTokenExpiredAt) {
      throw new UnauthorizedException(INVALID_OTP_TOKEN);
    }
    if (isNaN(new Date(user.otpTokenExpiredAt).getTime())) {
      throw new UnauthorizedException(INVALID_OTP_EXPIRY);
    }
    if (user?.otpTokenExpiredAt < new Date()) {
      throw new UnauthorizedException(OTP_TOKEN_IS_EXPIRED);
    }
    if (!(await validateHash(resetPasswordDto.otpToken, user.otpTokenHash))) {
      throw new UnauthorizedException(INVALID_OTP_TOKEN);
    }

    await this.usersService.update(user.id, {
      is_verified: true,
      password: resetPasswordDto.password,
      otpTokenExpiredAt: null,
      otpTokenHash: null,
    });

    return user;
  }

  refreshTokens(
    refreshToken: string,
  ): Promise<Auth.AccessRefreshTokens | void> {
    return this.tokenService.refreshTokens(refreshToken);
  }

  logout(userId: string, accessToken: string): Promise<void> {
    return this.tokenService.logout(userId, accessToken);
  }

  findById(userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }
}
