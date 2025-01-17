import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { UserRole } from 'libs/building-block/constants';
import { Audited } from './audited.entity';
import { Course } from './course.entity';

@Entity()
export class User extends Audited {
  @AutoMap()
  @Column()
  firstName: string;

  @AutoMap()
  @Column()
  lastName: string;

  @AutoMap()
  @Column({ unique: true })
  email: string;

  @AutoMap()
  @Column({ default: UserRole.Student })
  userRole: string;

  @AutoMap()
  @Column({ nullable: true })
  password: string;

  @AutoMap()
  @ManyToMany(() => Course, (course) => course.users, { nullable: true })
  @JoinTable()
  courses: Course[];
}
