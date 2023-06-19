import { TrackEntity } from '../track/track.model';
import { ArtistEntity } from '../artist/artist.model';
import { AlbumEntity } from '../album/album.model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FavouritesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json', nullable: true })
  artists: ArtistEntity[];

  @Column({ type: 'json', nullable: true })
  albums: AlbumEntity[];

  @Column({ type: 'json', nullable: true })
  tracks: TrackEntity[];
}
