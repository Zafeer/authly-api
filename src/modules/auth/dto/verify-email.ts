import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { LowerCaseTransformer } from '@helpers/transformers/lower-case.transformer';

export class VerifyEmailDto {
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
  @IsNotEmpty()
  otpToken: string | null;
}
