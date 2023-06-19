import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TrackEntity {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column()
  duration: number;
}
