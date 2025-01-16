import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLectureDto {
  @ApiProperty({
    description: 'The name of the lecture',
    example: 'Introduction to NestJS',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the lecture',
    example: 'A lecture introducing the NestJS framework and its features.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateLectureDto extends PartialType(CreateLectureDto) {}
