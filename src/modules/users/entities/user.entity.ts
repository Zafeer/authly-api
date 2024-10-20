import { User } from '@prisma/client';
import { Roles } from '@modules/auth/role.enum';

export default class UserEntity implements User {
  readonly id!: string;

  readonly email!: string;

  readonly name!: string | null;

  readonly password!: string | null;

  readonly roles!: Roles[];

  readonly createdAt!: Date;

  readonly updatedAt!: Date;

  readonly is_verified!: boolean;

  readonly otpTokenExpiredAt: Date | null;

  readonly otpTokenHash: string | null;
}
