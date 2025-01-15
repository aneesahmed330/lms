import {
  CreateLectureDto,
  UpdateLectureDto,
} from 'libs/building-block/RequestableDTOs/lecture';
import { Lecture } from 'libs/manager/entities';

export abstract class ILectureService {
  abstract create(
    courseId: string,
    createLectureDto: CreateLectureDto,
  ): Promise<Lecture>;
  abstract findAllByCourseId(courseId: string): Promise<Lecture[]>;
  abstract findOneByCourseId(courseId: string, id: string): Promise<Lecture>;
  abstract update(
    courseId: string,
    id: string,
    updateLectureDto: UpdateLectureDto,
  ): Promise<Lecture>;
  abstract remove(courseId: string, id: string): Promise<void>;
}
