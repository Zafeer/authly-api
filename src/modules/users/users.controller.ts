import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles, User } from '@prisma/client';
import { UserParsePipe } from './pipes/user.parse.pipes';
import UserBaseEntity from './entities/user-base.entity';
import UserEntity from './entities/user.entity';
import Serialize from '@decorators/serialize.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Serialize(UserBaseEntity)
  @UseAbility(Actions.read, UserEntity)
  findAll(@Query('roles') roles?: Roles[]) {
    return this.usersService.findAll(roles);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', UserParsePipe) user: User,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user?.id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id', UserParsePipe) user: User) {
    return this.usersService.delete(user?.id);
  }
}
