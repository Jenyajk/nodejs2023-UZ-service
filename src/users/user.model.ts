import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  version: number;
  @Column({ type: 'bigint' })
  createdAt: number;
  @Column({ type: 'bigint' })
  updatedAt: number;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
