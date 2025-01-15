import { AutoMap } from '@automapper/classes';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Audited } from './audited.entity';

@Entity()
export class SocketEntity extends Audited {
  @AutoMap()
  @Column()
  socketId: string;

  @AutoMap()
  @OneToOne(() => User)
  @JoinColumn()
  userId: User;

  @AutoMap()
  @Column({ default: false })
  isOnline: boolean;
}
