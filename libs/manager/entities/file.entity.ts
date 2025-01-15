import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Audited } from './audited.entity';
import { Lecture } from './lecture.entity';

@Entity()
export class File extends Audited {
  @AutoMap()
  @Column()
  url: string;

  @AutoMap()
  @Column()
  key: string;

  @AutoMap()
  @Column()
  originalName: string;

  @AutoMap()
  @ManyToOne(() => Lecture, (lecture) => lecture.files, {
    onDelete: 'CASCADE', // Ensures that deleting a lecture also deletes associated files
  })
  lecture: Lecture;
}
