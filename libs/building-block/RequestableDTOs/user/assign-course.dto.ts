import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AssignCoursesDto {
  @ApiProperty({
    description: 'Array of course IDs to assign to the user',
    example: ['course-id-1', 'course-id-2'],
  })
  @IsString({ each: true })
  @IsArray()
  courseIds: string[];
}
