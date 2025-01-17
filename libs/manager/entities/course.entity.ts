import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Lecture } from './lecture.entity';
import { Audited } from './audited.entity';
import { User } from './user.entity';

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

  @AutoMap()
  @ManyToMany(() => User, (user) => user.courses, { nullable: true })
  users: User[];
}
