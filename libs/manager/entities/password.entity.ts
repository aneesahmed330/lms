import { AutoMap } from '@automapper/classes';
import { Column, Entity } from 'typeorm';
import { Audited } from './audited.entity';

@Entity()
export class Password extends Audited {
  @AutoMap()
  @Column()
  token: string;

  @AutoMap()
  @Column({ type: 'timestamp' })
  expiry: Date;

  @AutoMap()
  @Column()
  email: string;

  @AutoMap()
  @Column({ default: 1 })
  status: number;
}
