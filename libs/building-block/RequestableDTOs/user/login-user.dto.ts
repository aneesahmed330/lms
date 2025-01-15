import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'email of the user',
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password of the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Role of the user',
  })
  @IsString()
  userRole: string;

  @ApiProperty({
    description: 'device id of the user',
  })
  @IsString()
  @IsOptional()
  deviceId?: string;
}
