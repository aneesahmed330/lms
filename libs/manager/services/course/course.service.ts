import { Course } from 'libs/manager/entities';
import {
  CreateCourseDto,
  UpdateCourseDto,
} from 'libs/building-block/RequestableDTOs/course';

export abstract class ICourseService {
  /**
   * Create a new course.
   * @param createCourseDto Payload to create a course.
   * @returns The created course.
   */
  abstract create(createCourseDto: CreateCourseDto): Promise<Course>;

  /**
   * Retrieve all courses.
   * @returns A list of courses.
   */
  abstract findAll(): Promise<Course[]>;

  /**
   * Retrieve a single course by ID.
   * @param id The ID of the course.
   * @returns The course if found.
   */
  abstract findOne(id: string): Promise<Course>;

  /**
   * Update a course.
   * @param id The ID of the course to update.
   * @param updateCourseDto Payload to update the course.
   * @returns The updated course.
   */
  abstract update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course>;

  /**
   * Delete a course.
   * @param id The ID of the course to delete.
   * @returns A promise indicating the operation's success.
   */
  abstract delete(id: string): Promise<void>;
}
