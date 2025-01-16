import { ILectureService } from '@app/manager/lecture/lecture.service';
import { JwtAuthGuard } from '@app/modules/auth/guard/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateLectureDto,
  UpdateLectureDto,
} from 'libs/building-block/RequestableDTOs/lecture';
import { Lecture } from 'libs/manager/entities';

@ApiTags('Lectures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lectures') // Global lectures route
export class LecturesController {
  constructor(private readonly lectureService: ILectureService) {}

  @Post(':courseId')
  @ApiOperation({ summary: 'Create a new lecture for a specific course' })
  @ApiResponse({
    status: 201,
    description: 'Lecture created successfully',
    type: Lecture,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Param('courseId') courseId: string,
    @Body() createLectureDto: CreateLectureDto,
  ) {
    return this.lectureService.create(courseId, createLectureDto);
  }

  @Get(':courseId')
  @ApiOperation({ summary: 'Get all lectures for a specific course' })
  @ApiResponse({
    status: 200,
    description: 'List of lectures',
    type: [Lecture],
  })
  async findAll(@Param('courseId') courseId: string) {
    return this.lectureService.findAllByCourseId(courseId);
  }

  @Get(':courseId/:id')
  @ApiOperation({ summary: 'Get a specific lecture by ID for a course' })
  @ApiResponse({ status: 200, description: 'Lecture details', type: Lecture })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  async findOne(@Param('courseId') courseId: string, @Param('id') id: string) {
    return this.lectureService.findOneByCourseId(courseId, id);
  }

  @Patch(':courseId/:id')
  @ApiOperation({ summary: 'Update a specific lecture for a course' })
  @ApiResponse({
    status: 200,
    description: 'Lecture updated successfully',
    type: Lecture,
  })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  async update(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
    @Body() updateLectureDto: UpdateLectureDto,
  ) {
    return this.lectureService.update(courseId, id, updateLectureDto);
  }

  @Delete(':courseId/:id')
  @ApiOperation({ summary: 'Delete a specific lecture for a course' })
  @ApiResponse({ status: 200, description: 'Lecture deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  async remove(@Param('courseId') courseId: string, @Param('id') id: string) {
    return this.lectureService.remove(courseId, id);
  }
}
