import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class JwtTokensDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly accessToken!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken!: string;
}
