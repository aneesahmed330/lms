import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { File } from './file.entity';
import { Audited } from './audited.entity';
import { Course } from './course.entity';

@Entity()
export class Lecture extends Audited {
  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @ManyToOne(() => Course, (course) => course.lectures, {
    onDelete: 'CASCADE',
  })
  course: Course;

  @AutoMap()
  @OneToMany(() => File, (file) => file.lecture, {
    cascade: true,
    nullable: true,
  })
  files: File[];
}
