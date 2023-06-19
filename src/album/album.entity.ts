import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class AlbumEntity {
  @PrimaryColumn()
  readonly id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  artistId: string | null;
}
