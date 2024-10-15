import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service'; // Adjust the path as necessary
import { User } from '@prisma/client'; // Adjust the path as necessary

@Injectable()
export class UserParsePipe implements PipeTransform {
  constructor(private readonly userService: UsersService) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<User> {
    if (metadata.type === 'param' && metadata.data === 'id') {
      const user: User = await this.userService.findOne(value);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    }

    throw new NotFoundException('Invalid parameter');
  }
}
