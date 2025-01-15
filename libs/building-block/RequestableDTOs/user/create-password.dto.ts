import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePasswordDto {
  @ApiProperty({
    description: 'Password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Token of the user',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
