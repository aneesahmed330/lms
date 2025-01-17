import { AutoMap } from '@automapper/classes';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Audited {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @CreateDateColumn()
  createdDate: Date;

  @AutoMap()
  @UpdateDateColumn()
  updatedDate: Date;

  @AutoMap()
  @DeleteDateColumn()
  deletedDate: Date;

  @AutoMap()
  @VersionColumn()
  version: number;
}
