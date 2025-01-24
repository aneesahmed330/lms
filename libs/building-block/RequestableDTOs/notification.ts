import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The notification text',
    example: 'New course has been added',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Array of user IDs to receive the notification',
    example: ['uuid1', 'uuid2'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}

export class UpdateNotificationDto {
  @ApiProperty({
    description: 'The notification text',
    example: 'New course has been added',
  })
  @IsString()
  text?: string;

  @ApiProperty({
    description: 'Array of user IDs to receive the notification',
    example: ['uuid1', 'uuid2'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  userIds?: string[];
}
