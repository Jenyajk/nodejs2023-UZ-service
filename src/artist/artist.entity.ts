import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ArtistEntity {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;
}
