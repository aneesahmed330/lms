import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ServiceError } from 'libs/building-block/filters/service-error';
import { Course, Lecture } from 'libs/manager/entities';
import {
  CreateCourseDto,
  UpdateCourseDto,
} from 'libs/building-block/RequestableDTOs/course';

@Injectable()
export class CourseManagerService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
  ) {}

  // Create a new course
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const course = this.courseRepository.create(createCourseDto);
      return await this.courseRepository.save(course);
    } catch (error) {
      throw new ServiceError(
        'Course',
        'Error while creating course!',
        error.message || 'An error occurred while creating the course.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieve all courses
  async findAll(): Promise<Course[]> {
    try {
      return await this.courseRepository.find({});
    } catch (error) {
      throw new ServiceError(
        'Course',
        'Error while fetching courses!',
        error.message || 'An error occurred while fetching the courses.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieve a single course by ID
  async findOne(id: string): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({
        relations: {
          lectures: {
            files: true,
          },
        },
        where: { id },
      });

      if (!course) {
        throw new ServiceError(
          'Course',
          'Course not found!',
          `No course found with ID ${id}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return course;
    } catch (error) {
      throw new ServiceError(
        'Course',
        'Error while fetching course!',
        error.message || 'An error occurred while fetching the course.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update a course
  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });

      if (!course) {
        throw new ServiceError(
          'Course',
          'Course not found!',
          `No course found with ID ${id}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      Object.assign(course, updateCourseDto);
      return await this.courseRepository.save(course);
    } catch (error) {
      throw new ServiceError(
        'Course',
        'Error while updating course!',
        error.message || 'An error occurred while updating the course.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a course
  async delete(id: string): Promise<void> {
    try {
      const course = await this.courseRepository.findOne({ where: { id } });

      if (!course) {
        throw new ServiceError(
          'Course',
          'Course not found!',
          `No course found with ID ${id}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.courseRepository.remove(course);
    } catch (error) {
      throw new ServiceError(
        'Course',
        'Error while deleting course!',
        error.message || 'An error occurred while deleting the course.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
