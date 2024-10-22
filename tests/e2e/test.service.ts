import { TokenService } from '@modules/auth/token.service';
import { AuthService } from '@modules/auth/auth.service';
import { PrismaClient, User } from '@prisma/client';
import { INestApplication } from '@nestjs/common';
import { AdminUserInterface } from '@tests/e2e/interfaces/admin-user.interface';
import { Roles } from '@modules/auth/role.enum';
import { createUsers, getSignUpData } from '@tests/common/user.mock.functions';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { faker } from '@faker-js/faker';

class TestService {
  private _authService!: AuthService;

  private _tokenService!: TokenService;

  private _connection!: PrismaClient;

  constructor(app: INestApplication, connection: PrismaClient) {
    this._authService = app.get<AuthService>(AuthService);

    this._tokenService = app.get<TokenService>(TokenService);

    this._connection = connection;
  }

  async createGlobalAdmin(): Promise<AdminUserInterface> {
    const role: Roles.ADMIN[] = [Roles.ADMIN];

    const signUpData: SignUpDto = getSignUpData();
    const userPassword: string = signUpData.password;

    const newAdmin: User = await this._authService.signUp(signUpData);

    await this._connection.user.update({
      where: {
        id: newAdmin.id,
      },
      data: {
        roles: ['ADMIN', 'CUSTOMER'],
      },
    });

    const { id, email } = newAdmin;

    const { accessToken, refreshToken } = await this._authService.signIn({
      email,
      password: userPassword,
    });

    return {
      id,
      email,
      password: userPassword,
      accessToken,
      refreshToken,
    };
  }

  async createUser(): Promise<User> {
    const signUpDto: SignUpDto = this.getSignUpData();
    const { password } = signUpDto;
    const user = await this._authService.signUp(signUpDto);
    console.log(user);

    return {
      ...user,
      password,
    };
  }

  getSignUpData(): SignUpDto {
    return {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password({ length: 12 }),
      roles: ['ADMIN'],
      otpTokenExpiredAt: null,
      otpTokenHash: null,
    };
  }

  async getTokens(user: User): Promise<Auth.AccessRefreshTokens> {
    return this._tokenService.sign({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
  }
}

export default TestService;
