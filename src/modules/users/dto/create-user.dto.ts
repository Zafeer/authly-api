import { LowerCaseTransformer } from '@helpers/transformers/lower-case.transformer';
import { Roles } from '@prisma/client';
import { Exclude, Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsString,
  Matches,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail(
    {},
    {
      message:
        'Email must be a valid email address in the format: example@domain.com',
    },
  )
  @Transform(LowerCaseTransformer)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password must contain at least 8 characters, including 1 letter, 1 number, and 1 special character',
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @IsEnum(Roles, {
    message: 'Valid role required',
    each: true,
  })
  roles: Roles[];

  @IsBoolean()
  is_verified: boolean;

  @IsDate()
  @Exclude({ toPlainOnly: true })
  otpTokenExpiredAt: Date;

  @IsString()
  @Exclude({ toPlainOnly: true })
  otpTokenHash: string;
}
