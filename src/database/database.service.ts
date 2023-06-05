import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import { Track } from '../models/track.model';
import { Artist } from '../models/artist.model';
import { Album } from '../models/album.model';

@Injectable()
export class DatabaseService {
  public users: User[] = [];
  public track: Track[] = [];
  public artists: Artist[] = [];
  public albums: Album[] = [];

  getArtistById(id: string): Artist | undefined {
    return this.artists.find((artist) => artist.id === id);
  }

  getAlbumById(id: string): Album | undefined {
    return this.albums.find((album) => album.id === id);
  }

  getTrackById(id: string): Track | undefined {
    return this.track.find((track) => track.id === id);
  }
}
