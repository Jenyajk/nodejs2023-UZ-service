import { TrackEntity } from '../track/track.entity';
import { ArtistEntity } from '../artist/artist.entity';
import { AlbumEntity } from '../album/album.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FavouritesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  artists: ArtistEntity[];

  @Column({ type: 'json' })
  albums: AlbumEntity[];

  @Column({ type: 'json' })
  tracks: TrackEntity[];
}
