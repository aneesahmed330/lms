import { AutoMap } from '@automapper/classes';
import { Column, Entity, OneToMany } from 'typeorm';
import { Lecture } from './lecture.entity';
import { Audited } from './audited.entity';

@Entity()
export class Course extends Audited {
  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap()
  @OneToMany(() => Lecture, (lecture) => lecture.course, {
    cascade: true,
    nullable: true,
  })
  lectures: Lecture[];
}
