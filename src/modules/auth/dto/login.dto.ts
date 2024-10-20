import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { LowerCaseTransformer } from '@helpers/transformers/lower-case.transformer';

export class LoginDto {
  @ApiProperty({ type: String })
  @IsEmail()
  @IsNotEmpty()
  @Transform(LowerCaseTransformer)
  readonly email!: string;

  @ApiProperty({ type: String })
  @IsString()
  @Length(8)
  readonly password!: string;
}
