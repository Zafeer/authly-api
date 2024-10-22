import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@providers/prisma/prisma.service';
import { User, Prisma, Roles } from '@prisma/client';
import { USER_CONFLICT } from '@constants/http-errors-codes';

export type UserWithoutPassword = Omit<
  User,
  'password' | 'otpTokenExpiredAt' | 'otpTokenHash'
>;

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    const user: User = await this.findByEmail(createUserDto.email);

    if (user) {
      // 409001: User with this email already exists
      throw new ConflictException(USER_CONFLICT);
    }
    return await this.prismaService.user.create({ data: createUserDto });
  }

  async findAll(roles?: Roles[]): Promise<User[]> {
    const whereClause =
      roles && roles.length > 0 ? { roles: { hasSome: roles } } : {};
    return this.prismaService.user.findMany({ where: whereClause });
  }

  async findById(id: string): Promise<User> {
    return await this.prismaService.user.findFirst({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findFirst({ where: { email } });
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const partialDataUpdate = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(updateUserDto).filter(([_, value]) => value !== undefined),
    );
    const updatedUser = this.prismaService.user.update({
      where: { id },
      data: partialDataUpdate,
    });
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      password,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      otpTokenExpiredAt,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      otpTokenHash,
      ...userWithoutPassword
    } = await updatedUser;
    return userWithoutPassword;
  }

  public async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prismaService.user.delete({ where: { id } });
  }
}
