import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@providers/prisma/prisma.service';
import { User, Prisma, Roles } from '@prisma/client';
import { USER_CONFLICT } from '@constants/errors.constants';

export type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    const user: User = await this.prismaService.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (user) {
      // 409001: User with this email or phone already exists
      throw new ConflictException(USER_CONFLICT);
    }
    return await this.prismaService.user.create({ data: createUserDto });
  }

  async findAll(roles?: Roles[]): Promise<User[]> {
    const whereClause =
      roles && roles.length > 0 ? { roles: { hasSome: roles } } : {};
    return this.prismaService.user.findMany({ where: whereClause });
  }

  async findOne(id: string): Promise<User> {
    return await this.prismaService.user.findFirst({ where: { id } });
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    const updatedUser = this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = await updatedUser;
    return userWithoutPassword;
  }

  public async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prismaService.user.delete({ where: { id } });
  }
}
