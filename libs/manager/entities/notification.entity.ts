import { AutoMap } from '@automapper/classes';
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { Audited } from './audited.entity';
import { User } from './user.entity';

@Entity()
export class Notification extends Audited {
  @AutoMap()
  @Column()
  text: string;

  @AutoMap()
  @ManyToMany(() => User, (user) => user.notifications)
  @JoinTable()
  users: User[];
}
