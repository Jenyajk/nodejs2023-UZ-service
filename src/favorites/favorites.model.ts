import { TrackEntity } from '../track/track.model';
import { ArtistEntity } from '../artist/artist.model';
import { AlbumEntity } from '../album/album.model';

export class FavouritesEntity {
  artists: ArtistEntity[] = [];
  albums: AlbumEntity[] = [];
  tracks: TrackEntity[] = [];
}
