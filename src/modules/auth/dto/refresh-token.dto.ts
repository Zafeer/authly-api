import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class RefreshTokenDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
