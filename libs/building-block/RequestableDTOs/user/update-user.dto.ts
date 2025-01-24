import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['userRole'] as const),
) {
  @ApiProperty({
    description: 'Visitor ID for device tracking',
    required: false,
  })
  @IsString()
  @IsOptional()
  visitorId?: string;
}
