import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Name of the course',
    example: 'Introduction to Programming',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the course',
    example: 'A beginner-friendly course on programming concepts.',
  })
  @IsString()
  description: string;
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
