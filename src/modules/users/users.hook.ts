import { Injectable } from '@nestjs/common';
import { UsersService } from '@modules/users/users.service';
import { UserBeforeFilterHook } from '@modules/casl';
import { User } from '@prisma/client';

@Injectable()
export class UserHook implements UserBeforeFilterHook<User> {
  constructor(readonly usersService: UsersService) {}

  async run(request) {
    return this.usersService.findById(request.user.id);
  }
}
