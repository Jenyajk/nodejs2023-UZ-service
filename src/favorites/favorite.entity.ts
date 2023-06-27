import { ArtistEntity } from '../artist/artist.entity';
import { AlbumEntity } from '../album/artist.entity';
import { TrackEntity } from '../track/track.entity';

export class FavouritesEntity {
  artists: ArtistEntity[] = [];
  albums: AlbumEntity[] = [];
  tracks: TrackEntity[] = [];
}
