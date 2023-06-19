import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TrackEntity {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  artistId: string | null;

  @Column()
  albumId: string | null;

  @Column()
  duration: number;
}
