import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Matches,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Roles } from '@prisma/client';
import { LowerCaseTransformer } from '@helpers/transformers/lower-case.transformer';

export class SignUpDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsEmail(
    {},
    {
      message:
        'Email must be a valid email address in the format: example@domain.com',
    },
  )
  @IsNotEmpty()
  @Transform(LowerCaseTransformer)
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Password must contain at least 8 characters, including 1 letter, 1 number, and 1 special character',
  })
  @Exclude({ toPlainOnly: true })
  password: string;

  @ApiProperty({ type: String })
  @IsEnum(Roles, {
    message: 'Valid role required',
    each: true,
  })
  roles: Roles[] = [Roles.CUSTOMER];
  is_verified: boolean = false;
  otpTokenExpiredAt: Date | null;
  otpTokenHash: string | null;
}
