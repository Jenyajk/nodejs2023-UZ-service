import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AlbumEntity {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column()
  artistId: string | null;
}
