import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserHook } from './users.hook';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles, User } from '@prisma/client';
import { UserParsePipe } from './pipes/user.parse.pipes';
import { AccessGuard, Actions, UseAbility } from '@modules/casl';
import UserBaseEntity from './entities/user-base.entity';
import UserEntity from './entities/user.entity';
import Serialize from '@decorators/serialize.decorator';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import ApiBaseResponses from '@decorators/api-base-response.decorator';
import ApiOkBaseResponse from '@decorators/api-ok-base-response.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@ApiExtraModels(UserBaseEntity)
@ApiBaseResponses()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  @ApiOkBaseResponse({ dto: UserBaseEntity, isArray: true })
  @ApiQuery({ name: 'roles', required: false, type: 'string' })
  @UseGuards(AccessGuard)
  @Serialize(UserBaseEntity)
  @UseAbility(Actions.read, UserEntity)
  findAll(@Query('roles') roles?: Roles[]) {
    return this.usersService.findAll(roles);
  }

  @Get(':id')
  @ApiOkBaseResponse({ dto: UserBaseEntity, isArray: false })
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.read, UserEntity, UserHook)
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @ApiOkBaseResponse({ dto: UserBaseEntity, isArray: false })
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.update, UserEntity, UserHook)
  async update(
    @Param('id', UserParsePipe) user: User,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    // @CaslUser() userProxy?: UserProxy<User>,
    // @CaslConditions() conditions?: ConditionsProxy,
    // @CaslSubject() subjectProxy?: SubjectProxy<User>,
  ) {
    // const tokenUser = await userProxy.get();
    // const subject = await subjectProxy.get();
    return this.usersService.update(user?.id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkBaseResponse({ dto: UserBaseEntity, isArray: false })
  @ApiParam({ name: 'id', type: 'string' })
  @UseGuards(AccessGuard)
  @UseAbility(Actions.delete, UserEntity)
  delete(@Param('id', UserParsePipe) user: User) {
    return this.usersService.delete(user?.id);
  }
}
