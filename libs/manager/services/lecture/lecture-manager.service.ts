import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lecture, Course } from 'libs/manager/entities'; // Ensure both Lecture and Course are imported
import {
  CreateLectureDto,
  UpdateLectureDto,
} from 'libs/building-block/RequestableDTOs/lecture';
import { ServiceError } from 'libs/building-block/filters/service-error';
import { ILectureService } from './lecture.service';

@Injectable()
export class LectureManagerService implements ILectureService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>, // Inject the course repository
  ) {}

  // Create a lecture within a specific course
  async create(
    courseId: string,
    createLectureDto: CreateLectureDto,
  ): Promise<Lecture> {
    try {
      // Fetch the course to ensure it exists
      const course = await this.courseRepository.findOne({
        where: { id: courseId },
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found.`);
      }

      // Create the lecture and link it to the course
      const lecture = this.lectureRepository.create({
        ...createLectureDto,
        course, // Link the course to the lecture
      });

      // Save the lecture and return it
      return await this.lectureRepository.save(lecture);
    } catch (error) {
      throw new ServiceError(
        'Lecture',
        'Error while creating lecture!',
        error.message || 'An error occurred while creating the lecture.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get all lectures for a specific course
  async findAllByCourseId(courseId: string): Promise<Lecture[]> {
    try {
      return await this.lectureRepository.find({
        relations: {
          course: true,
          files: true,
        },
        where: { course: { id: courseId } },
      });
    } catch (error) {
      throw new ServiceError(
        'Lecture',
        'Error while fetching lectures!',
        error.message || 'An error occurred while fetching the lectures.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Find a specific lecture within a course
  async findOneByCourseId(courseId: string, id: string): Promise<Lecture> {
    try {
      const lecture = await this.lectureRepository.findOne({
        relations: {
          course: true,
        },
        where: { course: { id: courseId }, id },
      });

      if (!lecture) {
        throw new NotFoundException(
          `Lecture with ID ${id} not found in course ${courseId}`,
        );
      }
      return lecture;
    } catch (error) {
      throw new ServiceError(
        'Lecture',
        'Error while fetching lecture by ID!',
        error.message || 'An error occurred while fetching the lecture by ID.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update a lecture within a specific course
  async update(
    courseId: string,
    id: string,
    updateLectureDto: UpdateLectureDto,
  ): Promise<Lecture> {
    try {
      const lecture = await this.lectureRepository.findOne({
        relations: {
          course: true,
        },
        where: { course: { id: courseId }, id },
      });

      if (!lecture) {
        throw new NotFoundException(
          `Lecture with ID ${id} not found in course ${courseId}`,
        );
      }
      Object.assign(lecture, updateLectureDto);
      return await this.lectureRepository.save(lecture);
    } catch (error) {
      throw new ServiceError(
        'Lecture',
        'Error while updating lecture!',
        error.message || 'An error occurred while updating the lecture.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Remove a lecture within a specific course
  async remove(courseId: string, id: string): Promise<void> {
    try {
      const lecture = await this.lectureRepository.findOne({
        relations: {
          course: true,
        },
        where: { course: { id: courseId }, id },
      });

      if (!lecture) {
        throw new NotFoundException(
          `Lecture with ID ${id} not found in course ${courseId}`,
        );
      }
      await this.lectureRepository.remove(lecture);
    } catch (error) {
      throw new ServiceError(
        'Lecture',
        'Error while deleting lecture!',
        error.message || 'An error occurred while deleting the lecture.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
